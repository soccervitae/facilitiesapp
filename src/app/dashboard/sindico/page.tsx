"use client";

import { useState } from "react";
import {
  Users,
  AlertCircle,
  Ticket,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  X,
  ChevronRight,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  FileText,
  Home,
} from "lucide-react";
import { mockMoradores, mockBoletos, mockTickets, mockAssemblies } from "@/lib/mockData";

const TABS = [
  { id: "visao-geral", label: "Visão Geral" },
  { id: "moradores", label: "Moradores" },
  { id: "financeiro", label: "Financeiro" },
  { id: "chamados", label: "Chamados" },
  { id: "assembleias", label: "Assembleias" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Ativo: "bg-green-500/20 text-green-400 border border-green-500/30",
    Inadimplente: "bg-red-500/20 text-red-400 border border-red-500/30",
    Pago: "bg-green-500/20 text-green-400 border border-green-500/30",
    Pendente: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    Atrasado: "bg-red-500/20 text-red-400 border border-red-500/30",
    Aberto: "bg-red-500/20 text-red-400 border border-red-500/30",
    "Em Andamento": "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    Resolvido: "bg-green-500/20 text-green-400 border border-green-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? "bg-white/10 text-white/60"}`}>
      {status}
    </span>
  );
}

function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  const map: Record<string, string> = {
    Alta: "bg-red-500/20 text-red-400 border border-red-500/30",
    Média: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    Baixa: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[prioridade] ?? "bg-white/10 text-white/60"}`}>
      {prioridade}
    </span>
  );
}

function CategoriaBadge({ categoria }: { categoria: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#af101a]/20 text-[#e05060] border border-[#af101a]/30">
      {categoria}
    </span>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#101c29] border border-white/10 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-white/50 text-sm font-medium">{label}</span>
        <div className={`p-2 rounded-lg ${color ?? "bg-[#af101a]/20"}`}>
          <Icon size={18} className={color ? "text-white/70" : "text-[#af101a]"} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white font-[Montserrat]">{value}</p>
        {sub && <p className="text-white/40 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── TAB: VISÃO GERAL ────────────────────────────────────────────────────────

function VisaoGeral() {
  const totalMoradores = mockMoradores.length;
  const inadimplentes = mockMoradores.filter((m: any) => m.status === "Inadimplente").length;
  const chamadosAbertos = mockTickets.filter((t: any) => t.status === "Aberto").length;
  const proximaAssembleia = mockAssemblies[0]?.data ?? "—";

  const recentTickets = mockTickets.slice(0, 5);
  const recentBoletos = mockBoletos.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Total de Moradores" value={totalMoradores} sub="unidades cadastradas" />
        <KpiCard
          icon={AlertCircle}
          label="Inadimplência"
          value={inadimplentes}
          sub={`${Math.round((inadimplentes / totalMoradores) * 100)}% do total`}
          color="bg-red-500/20"
        />
        <KpiCard
          icon={Ticket}
          label="Chamados Abertos"
          value={chamadosAbertos}
          sub="aguardando atendimento"
          color="bg-amber-500/20"
        />
        <KpiCard
          icon={Calendar}
          label="Próxima Assembleia"
          value={proximaAssembleia}
          sub={mockAssemblies[0]?.titulo ?? ""}
          color="bg-blue-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <div className="bg-[#101c29] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white font-[Montserrat]">Chamados Recentes</h3>
            <ChevronRight size={16} className="text-white/40" />
          </div>
          <div className="space-y-3">
            {recentTickets.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-white/80 font-medium">{t.titulo}</p>
                  <p className="text-xs text-white/40 mt-0.5">{t.unidade} · {t.data}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Boletos */}
        <div className="bg-[#101c29] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white font-[Montserrat]">Boletos Recentes</h3>
            <ChevronRight size={16} className="text-white/40" />
          </div>
          <div className="space-y-3">
            {recentBoletos.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-white/80 font-medium">{b.morador}</p>
                  <p className="text-xs text-white/40 mt-0.5">{b.unidade} · Venc. {b.vencimento}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={b.status} />
                  <span className="text-xs text-white/50">{b.valor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: MORADORES ──────────────────────────────────────────────────────────

function Moradores() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");

  const filtered = mockMoradores.filter((m: any) => {
    const matchSearch =
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.unidade.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Todos" || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nome ou unidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#101c29] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#af101a]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-white/40" />
          {["Todos", "Ativo", "Inadimplente"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === s
                  ? "bg-[#af101a] text-white"
                  : "bg-[#101c29] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#101c29] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Nome</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Unidade</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Tipo</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m: any) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#af101a]/20 flex items-center justify-center text-xs font-bold text-[#e05060]">
                        {m.nome.charAt(0)}
                      </div>
                      <span className="text-sm text-white font-medium">{m.nome}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white/70">{m.unidade}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white/70">{m.tipo}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white/70">{m.telefone}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-white/30 text-sm">
                    Nenhum morador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: FINANCEIRO ─────────────────────────────────────────────────────────

function Financeiro() {
  const receitaMensal = 40800;
  const despesas = 31200;
  const saldo = receitaMensal - despesas;

  const inadimplentes = mockMoradores.filter((m: any) => m.status === "Inadimplente");

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#101c29] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp size={18} className="text-green-400" />
            </div>
            <span className="text-white/50 text-sm">Receita Mensal</span>
          </div>
          <p className="text-2xl font-bold text-green-400 font-[Montserrat]">{fmt(receitaMensal)}</p>
          <p className="text-white/30 text-xs mt-1">Competência: junho/2026</p>
        </div>
        <div className="bg-[#101c29] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown size={18} className="text-red-400" />
            </div>
            <span className="text-white/50 text-sm">Despesas</span>
          </div>
          <p className="text-2xl font-bold text-red-400 font-[Montserrat]">{fmt(despesas)}</p>
          <p className="text-white/30 text-xs mt-1">Competência: junho/2026</p>
        </div>
        <div className="bg-[#101c29] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DollarSign size={18} className="text-blue-400" />
            </div>
            <span className="text-white/50 text-sm">Saldo</span>
          </div>
          <p className="text-2xl font-bold text-blue-400 font-[Montserrat]">{fmt(saldo)}</p>
          <p className="text-white/30 text-xs mt-1">Resultado do mês</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Boletos table */}
        <div className="lg:col-span-2 bg-[#101c29] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h3 className="font-semibold text-white font-[Montserrat]">Boletos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Morador</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Unidade</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Valor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Vencimento</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockBoletos.map((b: any) => (
                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-white/80">{b.morador}</td>
                    <td className="px-5 py-3.5 text-sm text-white/60">{b.unidade}</td>
                    <td className="px-5 py-3.5 text-sm text-white/80 font-medium">{b.valor}</td>
                    <td className="px-5 py-3.5 text-sm text-white/60">{b.vencimento}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inadimplência */}
        <div className="bg-[#101c29] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10">
            <h3 className="font-semibold text-white font-[Montserrat]">Inadimplentes</h3>
          </div>
          <div className="p-4 space-y-3">
            {inadimplentes.length === 0 && (
              <p className="text-white/30 text-sm text-center py-6">Nenhum inadimplente.</p>
            )}
            {inadimplentes.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                <div>
                  <p className="text-sm text-white/80 font-medium">{m.nome}</p>
                  <p className="text-xs text-white/40">{m.unidade}</p>
                </div>
                <AlertCircle size={16} className="text-red-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: CHAMADOS ───────────────────────────────────────────────────────────

function Chamados() {
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titulo: "", categoria: "", prioridade: "Baixa", unidade: "" });

  const filtered = mockTickets.filter((t: any) =>
    filterStatus === "Todos" ? true : t.status === filterStatus
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Filter size={14} className="text-white/40" />
          {["Todos", "Aberto", "Em Andamento", "Resolvido"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filterStatus === s
                  ? "bg-[#af101a] text-white"
                  : "bg-[#101c29] border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#af101a] hover:bg-[#c41520] text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancelar" : "Novo Chamado"}
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-[#101c29] border border-[#af101a]/30 rounded-xl p-5">
          <h3 className="font-semibold text-white font-[Montserrat] mb-4">Abrir Novo Chamado</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-1.5">Título</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Descreva brevemente o problema..."
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#af101a]/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Categoria</label>
              <input
                type="text"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                placeholder="Ex: Manutenção, Segurança..."
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#af101a]/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Unidade</label>
              <input
                type="text"
                value={form.unidade}
                onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                placeholder="Ex: Apto 101"
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#af101a]/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Prioridade</label>
              <select
                value={form.prioridade}
                onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#af101a]/50"
              >
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => { setShowForm(false); setForm({ titulo: "", categoria: "", prioridade: "Baixa", unidade: "" }); }}
              className="px-5 py-2.5 bg-[#af101a] hover:bg-[#c41520] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Enviar Chamado
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#101c29] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Título</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Categoria</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Prioridade</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Unidade</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/40 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: any) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white/80 font-medium">{t.titulo}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <CategoriaBadge categoria={t.categoria} />
                  </td>
                  <td className="px-5 py-3.5">
                    <PrioridadeBadge prioridade={t.prioridade} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white/60">{t.unidade}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white/50">{t.data}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-white/30 text-sm">
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: ASSEMBLEIAS ────────────────────────────────────────────────────────

function Assembleias() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {mockAssemblies.map((a: any) => {
        const total = (a.votosFavor ?? 0) + (a.votosContra ?? 0);
        const favorPct = total > 0 ? Math.round((a.votosFavor / total) * 100) : 0;
        const contraPct = total > 0 ? Math.round((a.votosContra / total) * 100) : 0;

        return (
          <div key={a.id} className="bg-[#101c29] border border-white/10 rounded-xl p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white font-[Montserrat] text-base">{a.titulo}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <Calendar size={12} />
                    {a.data}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <Clock size={12} />
                    {a.hora}
                  </span>
                </div>
              </div>
              {a.votacaoAtiva && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap">
                  Votação Ativa
                </span>
              )}
            </div>

            {/* Pauta */}
            {a.pauta && (
              <div className="bg-[#070b12] rounded-lg p-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText size={11} /> Pauta
                </p>
                <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{a.pauta}</p>
              </div>
            )}

            {/* Voting panel */}
            {a.votacaoAtiva && (
              <div className="bg-[#070b12] rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 size={11} /> Resultado da Votação
                </p>

                {/* A favor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-green-400">
                      <CheckCircle2 size={12} /> A Favor
                    </span>
                    <span className="text-xs text-white/50">{a.votosFavor} votos ({favorPct}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-700"
                      style={{ width: `${favorPct}%` }}
                    />
                  </div>
                </div>

                {/* Contra */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-red-400">
                      <XCircle size={12} /> Contra
                    </span>
                    <span className="text-xs text-white/50">{a.votosContra} votos ({contraPct}%)</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-700"
                      style={{ width: `${contraPct}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-white/30 text-right">{total} voto{total !== 1 ? "s" : ""} computado{total !== 1 ? "s" : ""}</p>
              </div>
            )}
          </div>
        );
      })}

      {mockAssemblies.length === 0 && (
        <div className="lg:col-span-2 text-center py-16 text-white/30 text-sm">
          Nenhuma assembleia cadastrada.
        </div>
      )}
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function SindicoPage() {
  const [activeTab, setActiveTab] = useState("visao-geral");

  const renderTab = () => {
    switch (activeTab) {
      case "visao-geral": return <VisaoGeral />;
      case "moradores":   return <Moradores />;
      case "financeiro":  return <Financeiro />;
      case "chamados":    return <Chamados />;
      case "assembleias": return <Assembleias />;
      default:            return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#101c29]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-5">
            <div className="p-2.5 bg-[#af101a]/20 rounded-xl">
              <Building2 size={22} className="text-[#af101a]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-[Montserrat]">
                Painel do Síndico
              </h1>
              <p className="text-white/40 text-sm">Facilities — Gestão de Condomínios</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-px scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#af101a] text-white"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTab()}
      </div>
    </div>
  );
}
