/**
 * Facilities — Setup do banco de dados Supabase
 * Execute: node scripts/setup-db.mjs
 */

import pg from "pg";
const { Client } = pg;

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres.gkkuttabavwxjuibmrnr:lDMJu75dLgoIcBpu@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run(label, sql) {
  try {
    await client.query(sql);
    console.log(`✅ ${label}`);
  } catch (e) {
    console.error(`❌ ${label}: ${e.message}`);
  }
}

async function main() {
  console.log("🔌 Conectando ao banco...");
  await client.connect();
  console.log("✅ Conectado!\n");

  // ── Trigger function ──────────────────────────────────────────────────────
  await run("Função handle_new_user", `
    create or replace function public.handle_new_user()
    returns trigger language plpgsql security definer as $$
    begin
      insert into public.profiles (id, nome, email, tipo)
      values (
        new.id,
        coalesce(new.raw_user_meta_data->>'nome', new.email),
        new.email,
        coalesce(new.raw_user_meta_data->>'tipo', 'morador')
      ) on conflict (id) do nothing;
      return new;
    end;
    $$;
  `);

  // ── Tabelas ───────────────────────────────────────────────────────────────
  await run("Tabela profiles", `
    create table if not exists public.profiles (
      id            uuid references auth.users(id) on delete cascade primary key,
      nome          text not null,
      email         text not null,
      cpf           text unique,
      tipo          text not null default 'morador'
                    check (tipo in ('administrador','sindico','morador','colaborador','porteiro')),
      unidade       text,
      ativo         boolean default true,
      condominio_id text,
      created_at    timestamptz default now()
    );
  `);

  await run("Tabela condominios", `
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
  `);

  await run("Tabela moradores", `
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
  `);

  await run("Tabela tickets", `
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
  `);

  await run("Tabela boletos", `
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
  `);

  await run("Tabela reservas", `
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
  `);

  await run("Tabela assembleias", `
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
  `);

  await run("Tabela visitantes", `
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
  `);

  await run("Tabela encomendas", `
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
  `);

  // ── Trigger ───────────────────────────────────────────────────────────────
  await run("Trigger on_auth_user_created", `
    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  `);

  // ── RLS ───────────────────────────────────────────────────────────────────
  const tables = ["profiles","condominios","moradores","tickets","boletos","reservas","assembleias","visitantes","encomendas"];
  for (const t of tables) {
    await run(`RLS em ${t}`, `alter table public.${t} enable row level security;`);
  }

  await run("Policy: profiles leitura própria", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Usuário vê próprio perfil') then
        create policy "Usuário vê próprio perfil" on public.profiles for select using (auth.uid() = id);
      end if;
    end $$;
  `);

  await run("Policy: profiles update próprio", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='profiles' and policyname='Usuário atualiza próprio perfil') then
        create policy "Usuário atualiza próprio perfil" on public.profiles for update using (auth.uid() = id);
      end if;
    end $$;
  `);

  await run("Policy: autenticados leem condominios", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='condominios' and policyname='Autenticados leem condominios') then
        create policy "Autenticados leem condominios" on public.condominios for select using (auth.role() = 'authenticated');
      end if;
    end $$;
  `);

  await run("Policy: autenticados leem moradores", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='moradores' and policyname='Autenticados leem moradores') then
        create policy "Autenticados leem moradores" on public.moradores for select using (auth.role() = 'authenticated');
      end if;
    end $$;
  `);

  await run("Policy: autenticados leem assembleias", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='assembleias' and policyname='Autenticados leem assembleias') then
        create policy "Autenticados leem assembleias" on public.assembleias for select using (auth.role() = 'authenticated');
      end if;
    end $$;
  `);

  await run("Policy: tickets próprios", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='tickets' and policyname='Usuário vê próprios chamados') then
        create policy "Usuário vê próprios chamados" on public.tickets for select using (autor_id = auth.uid());
      end if;
    end $$;
  `);

  await run("Policy: tickets admin/sindico", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='tickets' and policyname='Gestores veem todos chamados') then
        create policy "Gestores veem todos chamados" on public.tickets for select using (
          exists (select 1 from public.profiles where id = auth.uid() and tipo in ('administrador','sindico','colaborador','porteiro'))
        );
      end if;
    end $$;
  `);

  await run("Policy: autenticado cria ticket", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='tickets' and policyname='Autenticado cria chamado') then
        create policy "Autenticado cria chamado" on public.tickets for insert with check (auth.role() = 'authenticated');
      end if;
    end $$;
  `);

  await run("Policy: porteiro gerencia visitantes", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='visitantes' and policyname='Porteiro gerencia visitantes') then
        create policy "Porteiro gerencia visitantes" on public.visitantes for all using (
          exists (select 1 from public.profiles where id = auth.uid() and tipo in ('administrador','sindico','porteiro'))
        );
      end if;
    end $$;
  `);

  await run("Policy: porteiro gerencia encomendas", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='encomendas' and policyname='Porteiro gerencia encomendas') then
        create policy "Porteiro gerencia encomendas" on public.encomendas for all using (
          exists (select 1 from public.profiles where id = auth.uid() and tipo in ('administrador','sindico','porteiro'))
        );
      end if;
    end $$;
  `);

  await run("Policy: autenticado cria reserva", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='reservas' and policyname='Autenticado cria reserva') then
        create policy "Autenticado cria reserva" on public.reservas for insert with check (auth.role() = 'authenticated');
      end if;
    end $$;
  `);

  await run("Policy: usuário vê próprias reservas", `
    do $$ begin
      if not exists (select 1 from pg_policies where tablename='reservas' and policyname='Usuário vê próprias reservas') then
        create policy "Usuário vê próprias reservas" on public.reservas for select using (autor_id = auth.uid());
      end if;
    end $$;
  `);

  // ── Seed data ─────────────────────────────────────────────────────────────
  await run("Seed: condominios", `
    insert into public.condominios (id, nome, endereco, cidade, bairro, unidades, inadimplencia, status)
    values
      ('cd-1', 'Edifício Solar das Palmeiras', 'Av. Ana Costa, 500', 'Santos', 'Vila Belmiro', 48, 12.5, 'Ativo'),
      ('cd-2', 'Residencial Praia Grande', 'R. Tupinambás, 200', 'Praia Grande', 'Aviação', 32, 8.3, 'Ativo'),
      ('cd-3', 'Condomínio Vista Mar', 'Av. Presidente Wilson, 1200', 'Guarujá', 'Pitangueiras', 64, 15.7, 'Ativo')
    on conflict (id) do nothing;
  `);

  await run("Seed: moradores", `
    insert into public.moradores (id, nome, unidade, email, telefone, tipo, status, condominio_id)
    values
      ('m-1', 'João Silva', 'Apto 42-A', 'joao@email.com', '(13) 99999-0001', 'Proprietário', 'Ativo', 'cd-1'),
      ('m-2', 'Ana Souza', 'Apto 15-B', 'ana@email.com', '(13) 99999-0002', 'Inquilino', 'Ativo', 'cd-1'),
      ('m-3', 'Pedro Costa', 'Apto 32-C', 'pedro@email.com', '(13) 99999-0003', 'Proprietário', 'Inadimplente', 'cd-1'),
      ('m-4', 'Maria Lima', 'Apto 08-D', 'maria@email.com', '(13) 99999-0004', 'Proprietário', 'Ativo', 'cd-1')
    on conflict (id) do nothing;
  `);

  await run("Seed: assembleias", `
    insert into public.assembleias (id, titulo, pauta, data, hora, local, tipo, status, votacao_ativa, votos_favor, votos_contra, condominio_id)
    values
      ('a-1', 'Assembleia Ordinária – Junho 2026', 'Aprovação do orçamento anual e eleição de síndico', '2026-06-20', '19:00', 'Salão de Festas', 'Ordinária', 'Agendada', false, 0, 0, 'cd-1'),
      ('a-2', 'Assembleia Extraordinária – Obras', 'Aprovação de reforma da fachada e área de lazer', '2026-06-25', '18:30', 'Salão de Festas', 'Extraordinária', 'Agendada', true, 34, 8, 'cd-1')
    on conflict (id) do nothing;
  `);

  console.log("\n🎉 Setup concluído! Agora crie os usuários no Supabase Auth.");
  console.log("\nUsuários para criar em Authentication > Users:");
  console.log("  admin@facilities.com.br     / senha: 123456 (administrador)");
  console.log("  sindico@facilities.com.br   / senha: 123456 (sindico)");
  console.log("  contato@facilities.com.br   / senha: 123456 (morador)");
  console.log("  colaborador@facilities.com.br / senha: 123456 (colaborador)");
  console.log("  porteiro@facilities.com.br  / senha: 123456 (porteiro)");
  console.log("\nApós criar os usuários, execute no SQL Editor:");
  console.log(`
  update profiles set tipo = 'administrador', cpf = '456', nome = 'Dra. Cristhiane Xavier', unidade = 'Sede Administrativa', condominio_id = 'cd-1' where email = 'admin@facilities.com.br';
  update profiles set tipo = 'sindico',        cpf = '789', nome = 'Carlos Eduardo',         unidade = 'Apto 01-A',           condominio_id = 'cd-1' where email = 'sindico@facilities.com.br';
  update profiles set tipo = 'morador',        cpf = '123', nome = 'Roberto Silva',           unidade = 'Apto 41-B',           condominio_id = 'cd-1' where email = 'contato@facilities.com.br';
  update profiles set tipo = 'colaborador',    cpf = '101', nome = 'Lucas Ferreira',          unidade = 'Portaria',            condominio_id = 'cd-1' where email = 'colaborador@facilities.com.br';
  update profiles set tipo = 'porteiro',       cpf = '102', nome = 'Marcos Porteiro',         unidade = 'Guarita',             condominio_id = 'cd-1' where email = 'porteiro@facilities.com.br';
  `);

  await client.end();
}

main().catch(console.error);
