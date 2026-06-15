import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SETUP_SECRET = process.env.DB_SETUP_SECRET || "facilities-setup-2026";

const SQL_SCHEMA = `
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
  nome          text not null,
  unidade       text not null,
  email         text,
  telefone      text,
  tipo          text default 'Proprietário',
  status        text default 'Ativo',
  condominio_id text,
  created_at    timestamptz default now()
);

create table if not exists public.tickets (
  id            text primary key default gen_random_uuid()::text,
  titulo        text not null,
  descricao     text,
  categoria     text,
  status        text default 'Aberto',
  prioridade    text default 'Média',
  unidade       text,
  autor_id      uuid references auth.users(id),
  condominio_id text,
  data_criacao  date default current_date,
  created_at    timestamptz default now()
);

create table if not exists public.boletos (
  id            text primary key default gen_random_uuid()::text,
  referencia    text not null,
  vencimento    date not null,
  valor         numeric(10,2) not null,
  status        text default 'Pendente',
  codigo_barras text,
  morador_id    text,
  unidade       text,
  condominio_id text,
  created_at    timestamptz default now()
);

create table if not exists public.reservas (
  id            text primary key default gen_random_uuid()::text,
  area          text not null,
  data          date not null,
  periodo       text,
  status        text default 'Confirmada',
  unidade       text,
  autor_id      uuid references auth.users(id),
  condominio_id text,
  created_at    timestamptz default now()
);

create table if not exists public.assembleias (
  id             text primary key default gen_random_uuid()::text,
  titulo         text not null,
  pauta          text,
  data           date not null,
  hora           text,
  local          text,
  tipo           text default 'Ordinária',
  status         text default 'Agendada',
  votacao_ativa  boolean default false,
  votos_favor    integer default 0,
  votos_contra   integer default 0,
  condominio_id  text,
  created_at     timestamptz default now()
);

create table if not exists public.visitantes (
  id               text primary key default gen_random_uuid()::text,
  nome             text not null,
  documento        text,
  unidade_destino  text not null,
  entrada          text not null,
  saida            text,
  status           text default 'Dentro',
  porteiro_id      uuid references auth.users(id),
  condominio_id    text,
  created_at       timestamptz default now()
);

create table if not exists public.encomendas (
  id               text primary key default gen_random_uuid()::text,
  destinatario     text not null,
  unidade          text not null,
  descricao        text,
  data_recebimento text not null,
  data_retirada    text,
  status           text default 'Aguardando',
  porteiro_id      uuid references auth.users(id),
  condominio_id    text,
  created_at       timestamptz default now()
);
`;

const SQL_SEED = `
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
`;

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const results: Record<string, string> = {};

  // Execute schema via pg_query (requires pg_net or direct SQL)
  // Using supabase.rpc if exec_sql function exists, otherwise report instructions
  try {
    const { error: schemaError } = await supabase.rpc("exec_sql", { sql: SQL_SCHEMA });
    if (schemaError) throw schemaError;
    results.schema = "OK";
  } catch {
    results.schema = "Use o SQL Editor do Supabase para criar as tabelas";
  }

  try {
    const { error: seedError } = await supabase.rpc("exec_sql", { sql: SQL_SEED });
    if (seedError) throw seedError;
    results.seed = "OK";
  } catch {
    results.seed = "Seed não executado (schema pendente)";
  }

  return NextResponse.json({ message: "Setup concluído", results });
}

export async function GET() {
  return NextResponse.json({
    message: "Facilities DB Setup",
    usage: "POST /api/db-setup?secret=facilities-setup-2026",
    steps: [
      "1. Execute o SQL do arquivo supabase-schema.sql no SQL Editor do Supabase",
      "2. Crie os usuários em Authentication > Users",
      "3. Execute os UPDATE de tipos no SQL Editor",
    ],
  });
}
