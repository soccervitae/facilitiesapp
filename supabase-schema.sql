-- ============================================================
-- FACILITIES — Setup completo do banco de dados
-- Execute no Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ── 1. TABELA DE TIPOS DE PERFIL ─────────────────────────────────────────────

create table if not exists public.tipos_perfil (
  id          text primary key,
  nome        text not null,
  descricao   text,
  nivel       integer not null default 1,
  created_at  timestamptz default now()
);

insert into public.tipos_perfil (id, nome, descricao, nivel) values
  ('administrador', 'Administrador',  'Acesso total ao sistema. Gerencia todos os condomínios, usuários e configurações.', 5),
  ('sindico',       'Síndico',        'Gerencia um condomínio: moradores, finanças, chamados e assembleias.',               4),
  ('colaborador',   'Colaborador',    'Funcionário interno. Visualiza e executa tarefas e chamados.',                       3),
  ('porteiro',      'Porteiro',       'Controla acesso: visitantes e encomendas.',                                          2),
  ('morador',       'Morador',        'Acesso ao próprio apartamento: boletos, reservas, chamados e assembleias.',          1)
on conflict (id) do nothing;


-- ── 2. TRIGGER: criar perfil ao registrar usuário ────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, nome, email, tipo_perfil_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    new.email,
    coalesce(new.raw_user_meta_data->>'tipo', 'morador')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 3. TABELAS ───────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  nome            text not null,
  email           text not null,
  cpf             text unique,
  tipo_perfil_id  text not null default 'morador'
                  references public.tipos_perfil(id),
  unidade         text,
  telefone        text,
  foto_url        text,
  ativo           boolean default true,
  condominio_id   text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

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

create table if not exists public.moradores (
  id            text primary key default gen_random_uuid()::text,
  profile_id    uuid references public.profiles(id) on delete set null,
  nome          text not null,
  unidade       text not null,
  email         text,
  telefone      text,
  tipo          text default 'Proprietário' check (tipo in ('Proprietário','Inquilino')),
  status        text default 'Ativo' check (status in ('Ativo','Inativo','Inadimplente')),
  condominio_id text references public.condominios(id),
  created_at    timestamptz default now()
);

create table if not exists public.tickets (
  id            text primary key default gen_random_uuid()::text,
  titulo        text not null,
  descricao     text,
  categoria     text check (categoria in ('Manutenção','Limpeza','Barulho','Financeiro','Outros')),
  status        text default 'Aberto' check (status in ('Aberto','Em Andamento','Resolvido')),
  prioridade    text default 'Média' check (prioridade in ('Alta','Média','Baixa')),
  unidade       text,
  autor_id      uuid references auth.users(id),
  condominio_id text references public.condominios(id),
  data_criacao  date default current_date,
  created_at    timestamptz default now()
);

create table if not exists public.boletos (
  id            text primary key default gen_random_uuid()::text,
  referencia    text not null,
  vencimento    date not null,
  valor         numeric(10,2) not null,
  status        text default 'Pendente' check (status in ('Pendente','Pago','Atrasado')),
  codigo_barras text,
  morador_id    text references public.moradores(id),
  unidade       text,
  condominio_id text references public.condominios(id),
  created_at    timestamptz default now()
);

create table if not exists public.reservas (
  id            text primary key default gen_random_uuid()::text,
  area          text not null,
  data          date not null,
  periodo       text check (periodo in ('Manhã','Tarde','Noite','Integral')),
  status        text default 'Confirmada' check (status in ('Confirmada','Pendente','Cancelada')),
  unidade       text,
  autor_id      uuid references auth.users(id),
  condominio_id text references public.condominios(id),
  created_at    timestamptz default now()
);

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


-- ── 4. ROW LEVEL SECURITY ────────────────────────────────────────────────────

alter table public.tipos_perfil  enable row level security;
alter table public.profiles      enable row level security;
alter table public.condominios   enable row level security;
alter table public.moradores     enable row level security;
alter table public.tickets       enable row level security;
alter table public.boletos       enable row level security;
alter table public.reservas      enable row level security;
alter table public.assembleias   enable row level security;
alter table public.visitantes    enable row level security;
alter table public.encomendas    enable row level security;

-- tipos_perfil: todos autenticados podem ler
create policy "Autenticados leem tipos de perfil"
  on public.tipos_perfil for select using (auth.role() = 'authenticated');

-- profiles: cada um vê o próprio; admin vê todos
create policy "Usuário vê próprio perfil"
  on public.profiles for select using (auth.uid() = id);

create policy "Usuário atualiza próprio perfil"
  on public.profiles for update using (auth.uid() = id);

create policy "Admin vê todos os perfis"
  on public.profiles for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.tipo_perfil_id = 'administrador')
  );

create policy "Admin gerencia todos os perfis"
  on public.profiles for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.tipo_perfil_id = 'administrador')
  );

-- condominios
create policy "Autenticados leem condomínios"
  on public.condominios for select using (auth.role() = 'authenticated');

create policy "Admin gerencia condomínios"
  on public.condominios for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id = 'administrador')
  );

-- moradores
create policy "Autenticados leem moradores"
  on public.moradores for select using (auth.role() = 'authenticated');

create policy "Admin e Síndico gerenciam moradores"
  on public.moradores for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id in ('administrador','sindico'))
  );

-- tickets
create policy "Usuário vê próprios chamados"
  on public.tickets for select using (autor_id = auth.uid());

create policy "Gestores veem todos os chamados"
  on public.tickets for select using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id in ('administrador','sindico','colaborador','porteiro'))
  );

create policy "Autenticado abre chamado"
  on public.tickets for insert with check (auth.role() = 'authenticated');

create policy "Gestores atualizam chamados"
  on public.tickets for update using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id in ('administrador','sindico','colaborador'))
  );

-- boletos
create policy "Admin e Síndico gerenciam boletos"
  on public.boletos for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id in ('administrador','sindico'))
  );

create policy "Morador vê próprios boletos"
  on public.boletos for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.unidade = boletos.unidade
    )
  );

-- reservas
create policy "Autenticado cria reserva"
  on public.reservas for insert with check (auth.role() = 'authenticated');

create policy "Usuário vê próprias reservas"
  on public.reservas for select using (autor_id = auth.uid());

create policy "Admin e Síndico veem todas as reservas"
  on public.reservas for select using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id in ('administrador','sindico'))
  );

-- assembleias
create policy "Autenticados leem assembleias"
  on public.assembleias for select using (auth.role() = 'authenticated');

create policy "Admin e Síndico gerenciam assembleias"
  on public.assembleias for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id in ('administrador','sindico'))
  );

-- visitantes
create policy "Porteiro e gestores gerenciam visitantes"
  on public.visitantes for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id in ('administrador','sindico','porteiro'))
  );

-- encomendas
create policy "Porteiro e gestores gerenciam encomendas"
  on public.encomendas for all using (
    exists (select 1 from public.profiles where id = auth.uid() and tipo_perfil_id in ('administrador','sindico','porteiro'))
  );


-- ── 5. DADOS INICIAIS ────────────────────────────────────────────────────────

insert into public.condominios (id, nome, endereco, cidade, bairro, unidades, inadimplencia, status)
values
  ('cd-1', 'Edifício Solar das Palmeiras', 'Av. Ana Costa, 500',          'Santos',       'Vila Belmiro',  48, 12.5, 'Ativo'),
  ('cd-2', 'Residencial Praia Grande',     'R. Tupinambás, 200',          'Praia Grande', 'Aviação',        32,  8.3, 'Ativo'),
  ('cd-3', 'Condomínio Vista Mar',         'Av. Presidente Wilson, 1200', 'Guarujá',      'Pitangueiras',   64, 15.7, 'Ativo')
on conflict (id) do nothing;

insert into public.moradores (id, nome, unidade, email, telefone, tipo, status, condominio_id)
values
  ('m-1', 'João Silva',  'Apto 42-A', 'joao@email.com',  '(13) 99999-0001', 'Proprietário', 'Ativo',        'cd-1'),
  ('m-2', 'Ana Souza',   'Apto 15-B', 'ana@email.com',   '(13) 99999-0002', 'Inquilino',    'Ativo',        'cd-1'),
  ('m-3', 'Pedro Costa', 'Apto 32-C', 'pedro@email.com', '(13) 99999-0003', 'Proprietário', 'Inadimplente', 'cd-1'),
  ('m-4', 'Maria Lima',  'Apto 08-D', 'maria@email.com', '(13) 99999-0004', 'Proprietário', 'Ativo',        'cd-1')
on conflict (id) do nothing;

insert into public.assembleias (id, titulo, pauta, data, hora, local, tipo, status, votacao_ativa, votos_favor, votos_contra, condominio_id)
values
  ('a-1', 'Assembleia Ordinária – Junho 2026', 'Aprovação do orçamento anual e eleição de síndico', '2026-06-20', '19:00', 'Salão de Festas', 'Ordinária',      'Agendada', false,  0, 0, 'cd-1'),
  ('a-2', 'Assembleia Extraordinária – Obras', 'Aprovação de reforma da fachada e área de lazer',   '2026-06-25', '18:30', 'Salão de Festas', 'Extraordinária', 'Agendada', true,  34, 8, 'cd-1')
on conflict (id) do nothing;

insert into public.boletos (id, referencia, vencimento, valor, status, codigo_barras, unidade, condominio_id)
values
  ('b-1', 'JUN/2026', '2026-06-10', 520.00, 'Atrasado', '23790.00012 00000.000000 00000.000000 1 00000000052000', 'Apto 41-B', 'cd-1'),
  ('b-2', 'JUL/2026', '2026-07-10', 520.00, 'Pendente', '23790.00012 00000.000000 00000.000001 1 00000000052000', 'Apto 41-B', 'cd-1'),
  ('b-3', 'MAI/2026', '2026-05-10', 520.00, 'Pago',     '23790.00012 00000.000000 00000.000002 1 00000000052000', 'Apto 41-B', 'cd-1')
on conflict (id) do nothing;


-- ── 6. APÓS CRIAR OS USUÁRIOS NO AUTH ────────────────────────────────────────
-- Crie os usuários em Authentication → Users → Add User com as senhas,
-- depois descomente e execute os UPDATEs abaixo:

-- update public.profiles set tipo_perfil_id='administrador', cpf='456', nome='Dra. Cristhiane Xavier', unidade='Sede Administrativa', condominio_id='cd-1' where email='admin@facilities.com.br';
-- update public.profiles set tipo_perfil_id='sindico',       cpf='789', nome='Carlos Eduardo',         unidade='Apto 01-A',           condominio_id='cd-1' where email='sindico@facilities.com.br';
-- update public.profiles set tipo_perfil_id='morador',       cpf='123', nome='Roberto Silva',           unidade='Apto 41-B',           condominio_id='cd-1' where email='contato@facilities.com.br';
-- update public.profiles set tipo_perfil_id='colaborador',   cpf='101', nome='Lucas Ferreira',          unidade='Portaria',            condominio_id='cd-1' where email='colaborador@facilities.com.br';
-- update public.profiles set tipo_perfil_id='porteiro',      cpf='102', nome='Marcos Porteiro',         unidade='Guarita',             condominio_id='cd-1' where email='porteiro@facilities.com.br';
