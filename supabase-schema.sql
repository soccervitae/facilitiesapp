-- ============================================================
-- FACILITIES — Schema Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- 1. PROFILES (vinculado ao auth.users)
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  nome       text not null,
  email      text not null,
  cpf        text unique,
  tipo       text not null check (tipo in ('administrador','sindico','morador','colaborador','porteiro')),
  unidade    text,
  ativo      boolean default true,
  condominio_id text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Usuário lê/edita apenas o próprio perfil; admin lê todos
create policy "Usuário vê próprio perfil" on public.profiles
  for select using (auth.uid() = id);

create policy "Usuário atualiza próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- Trigger: cria perfil automaticamente ao registrar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, nome, email, tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'tipo', 'morador')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. CONDOMINIOS
create table if not exists public.condominios (
  id            text primary key,
  nome          text not null,
  endereco      text,
  cidade        text,
  bairro        text,
  unidades      integer default 0,
  sindico       text,
  inadimplencia numeric(5,2) default 0,
  status        text default 'Ativo',
  data_cadastro date default current_date
);

alter table public.condominios enable row level security;
create policy "Autenticados leem condomínios" on public.condominios
  for select using (auth.role() = 'authenticated');

-- 3. MORADORES
create table if not exists public.moradores (
  id            text primary key default gen_random_uuid()::text,
  nome          text not null,
  unidade       text not null,
  email         text,
  telefone      text,
  tipo          text default 'Proprietário' check (tipo in ('Proprietário','Inquilino')),
  status        text default 'Ativo' check (status in ('Ativo','Inativo','Inadimplente')),
  condominio_id text references public.condominios(id),
  created_at    timestamptz default now()
);

alter table public.moradores enable row level security;
create policy "Autenticados leem moradores" on public.moradores
  for select using (auth.role() = 'authenticated');
create policy "Admin/Síndico gerencia moradores" on public.moradores
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and tipo in ('administrador','sindico')
    )
  );

-- 4. TICKETS / CHAMADOS
create table if not exists public.tickets (
  id           text primary key default gen_random_uuid()::text,
  titulo       text not null,
  descricao    text,
  categoria    text check (categoria in ('Manutenção','Limpeza','Barulho','Financeiro','Outros')),
  status       text default 'Aberto' check (status in ('Aberto','Em Andamento','Resolvido')),
  prioridade   text default 'Média' check (prioridade in ('Alta','Média','Baixa')),
  unidade      text,
  autor_id     uuid references auth.users(id),
  condominio_id text references public.condominios(id),
  data_criacao date default current_date,
  created_at   timestamptz default now()
);

alter table public.tickets enable row level security;
create policy "Usuário vê próprios chamados" on public.tickets
  for select using (autor_id = auth.uid());
create policy "Admin/Síndico/Colaborador vê todos chamados" on public.tickets
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and tipo in ('administrador','sindico','colaborador','porteiro')
    )
  );
create policy "Autenticado cria chamado" on public.tickets
  for insert with check (auth.role() = 'authenticated');
create policy "Admin/Síndico/Colaborador atualiza chamado" on public.tickets
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and tipo in ('administrador','sindico','colaborador')
    )
  );

-- 5. BOLETOS
create table if not exists public.boletos (
  id           text primary key default gen_random_uuid()::text,
  referencia   text not null,
  vencimento   date not null,
  valor        numeric(10,2) not null,
  status       text default 'Pendente' check (status in ('Pendente','Pago','Atrasado')),
  codigo_barras text,
  morador_id   text references public.moradores(id),
  unidade      text,
  condominio_id text references public.condominios(id),
  created_at   timestamptz default now()
);

alter table public.boletos enable row level security;
create policy "Morador vê próprios boletos" on public.boletos
  for select using (
    exists (
      select 1 from public.profiles p
      join public.moradores m on m.unidade = p.unidade
      where p.id = auth.uid() and m.id = boletos.morador_id
    )
  );
create policy "Admin/Síndico gerencia boletos" on public.boletos
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and tipo in ('administrador','sindico')
    )
  );

-- 6. RESERVAS
create table if not exists public.reservas (
  id           text primary key default gen_random_uuid()::text,
  area         text not null,
  data         date not null,
  periodo      text check (periodo in ('Manhã','Tarde','Noite','Integral')),
  status       text default 'Confirmada' check (status in ('Confirmada','Pendente','Cancelada')),
  unidade      text,
  autor_id     uuid references auth.users(id),
  condominio_id text references public.condominios(id),
  created_at   timestamptz default now()
);

alter table public.reservas enable row level security;
create policy "Usuário vê próprias reservas" on public.reservas
  for select using (autor_id = auth.uid());
create policy "Admin/Síndico vê todas reservas" on public.reservas
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and tipo in ('administrador','sindico')
    )
  );
create policy "Autenticado cria reserva" on public.reservas
  for insert with check (auth.role() = 'authenticated');

-- 7. ASSEMBLEIAS
create table if not exists public.assembleias (
  id             text primary key default gen_random_uuid()::text,
  titulo         text not null,
  pauta          text,
  data           date not null,
  hora           text,
  local          text,
  tipo           text default 'Ordinária' check (tipo in ('Ordinária','Extraordinária')),
  status         text default 'Agendada' check (status in ('Agendada','Em Andamento','Encerrada')),
  votacao_ativa  boolean default false,
  votos_favor    integer default 0,
  votos_contra   integer default 0,
  condominio_id  text references public.condominios(id),
  created_at     timestamptz default now()
);

alter table public.assembleias enable row level security;
create policy "Autenticados leem assembleias" on public.assembleias
  for select using (auth.role() = 'authenticated');
create policy "Admin/Síndico gerencia assembleias" on public.assembleias
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and tipo in ('administrador','sindico')
    )
  );

-- 8. VISITANTES
create table if not exists public.visitantes (
  id               text primary key default gen_random_uuid()::text,
  nome             text not null,
  documento        text,
  unidade_destino  text not null,
  entrada          text not null,
  saida            text,
  status           text default 'Dentro' check (status in ('Dentro','Saiu')),
  porteiro_id      uuid references auth.users(id),
  condominio_id    text references public.condominios(id),
  created_at       timestamptz default now()
);

alter table public.visitantes enable row level security;
create policy "Porteiro/Admin gerencia visitantes" on public.visitantes
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and tipo in ('administrador','sindico','porteiro')
    )
  );

-- 9. ENCOMENDAS
create table if not exists public.encomendas (
  id               text primary key default gen_random_uuid()::text,
  destinatario     text not null,
  unidade          text not null,
  descricao        text,
  data_recebimento text not null,
  data_retirada    text,
  status           text default 'Aguardando' check (status in ('Aguardando','Retirado')),
  porteiro_id      uuid references auth.users(id),
  condominio_id    text references public.condominios(id),
  created_at       timestamptz default now()
);

alter table public.encomendas enable row level security;
create policy "Porteiro/Admin gerencia encomendas" on public.encomendas
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and tipo in ('administrador','sindico','porteiro')
    )
  );

-- ============================================================
-- DADOS INICIAIS
-- ============================================================

insert into public.condominios (id, nome, endereco, cidade, bairro, unidades, inadimplencia, status)
values
  ('cd-1', 'Edifício Solar das Palmeiras', 'Av. Ana Costa, 500', 'Santos', 'Vila Belmiro', 48, 12.5, 'Ativo'),
  ('cd-2', 'Residencial Praia Grande', 'R. Tupinambás, 200', 'Praia Grande', 'Aviação', 32, 8.3, 'Ativo'),
  ('cd-3', 'Condomínio Vista Mar', 'Av. Presidente Wilson, 1200', 'Guarujá', 'Pitangueiras', 64, 15.7, 'Ativo')
on conflict (id) do nothing;

insert into public.moradores (id, nome, unidade, email, telefone, tipo, status, condominio_id)
values
  ('m-1', 'João Silva', 'Apto 42-A', 'joao@email.com', '(13) 99999-0001', 'Proprietário', 'Ativo', 'cd-1'),
  ('m-2', 'Ana Souza', 'Apto 15-B', 'ana@email.com', '(13) 99999-0002', 'Inquilino', 'Ativo', 'cd-1'),
  ('m-3', 'Pedro Costa', 'Apto 32-C', 'pedro@email.com', '(13) 99999-0003', 'Proprietário', 'Inadimplente', 'cd-1'),
  ('m-4', 'Maria Lima', 'Apto 08-D', 'maria@email.com', '(13) 99999-0004', 'Proprietário', 'Ativo', 'cd-1')
on conflict (id) do nothing;
