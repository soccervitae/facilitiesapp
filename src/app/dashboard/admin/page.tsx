"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Home,
  TrendingDown,
  Search,
  Plus,
  Eye,
  Pencil,
  Shield,
  UserCheck,
  UserX,
  Activity,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Bell,
  FileText,
  LogIn,
  LogOut,
  Settings,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { mockCondominios, mockUsers, mockAuditLog } from "@/lib/mockData";

type Tab = "visao-geral" | "condominios" | "usuarios" | "auditoria";

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  administrador: { label: "Administrador", color: "bg-purple-500/20 text-purple-300 border border-purple-500/30" },
  sindico:       { label: "Síndico",        color: "bg-blue-500/20 text-blue-300 border border-blue-500/30" },
  morador:       { label: "Morador",         color: "bg-green-500/20 text-green-300 border border-green-500/30" },
  colaborador:   { label: "Colaborador",     color: "bg-amber-500/20 text-amber-300 border border-amber-500/30" },
  porteiro:      { label: "Porteiro",        color: "bg-teal-500/20 text-teal-300 border border-teal-500/30" },
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  ativo:    { label: "Ativo",    color: "bg-green-500/20 text-green-300" },
  inativo:  { label: "Inativo",  color: "bg-red-500/20 text-red-300" },
  pendente: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-300" },
};

const AUDIT_ICON: Record<string, React.ReactElement> = {
  login:    <LogIn  className="w-4 h-4 text-blue-400" />,
  logout:   <LogOut className="w-4 h-4 text-white/40" />,
  create:   <Plus   className="w-4 h-4 text-green-400" />,
  update:   <Pencil className="w-4 h-4 text-amber-400" />,
  delete:   <Trash2 className="w-4 h-4 text-red-400" />,
  settings: <Settings className="w-4 h-4 text-purple-400" />,
  alert:    <AlertTriangle className="w-4 h-4 text-yellow-400" />,
};

const KPI_CARDS = [
  {
    label: "Condomínios",
    value: "4",
    delta: "+0%",
    deltaUp: true,
    icon: <Building2 className="w-6 h-6 text-[#af101a]" />,
    bg: "from-[#af101a]/10 to-transparent",
  },
  {
    label: "Unidades",
    value: "164",
    delta: "+2.5%",
    deltaUp: true,
    icon: <Home className="w-6 h-6 text-blue-400" />,
    bg: "from-blue-500/10 to-transparent",
  },
  {
    label: "Moradores",
    value: "312",
    delta: "+4.1%",
    deltaUp: true,
    icon: <Users className="w-6 h-6 text-green-400" />,
    bg: "from-green-500/10 to-transparent",
  },
  {
    label: "Inadimplência Média",
    value: "10.2%",
    delta: "-1.3%",
    deltaUp: false,
    icon: <TrendingDown className="w-6 h-6 text-amber-400" />,
    bg: "from-amber-500/10 to-transparent",
  },
];

const BAR_DATA = [
  { month: "Jan", value: 68 },
  { month: "Fev", value: 74 },
  { month: "Mar", value: 80 },
  { month: "Abr", value: 72 },
  { month: "Mai", value: 85 },
  { month: "Jun", value: 91 },
  { month: "Jul", value: 88 },
  { month: "Ago", value: 76 },
  { month: "Set", value: 82 },
  { month: "Out", value: 79 },
  { month: "Nov", value: 93 },
  { month: "Dez", value: 87 },
];

const RECENT_ACTIVITY = [
  { icon: <CheckCircle2 className="w-4 h-4 text-green-400" />, text: "Boleto gerado para Apt 203 — Jardim das Flores", time: "há 5 min" },
  { icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, text: "Inadimplência registrada — Unidade 105, Residencial Sol", time: "há 12 min" },
  { icon: <UserCheck className="w-4 h-4 text-blue-400" />, text: "Novo morador cadastrado — Roberto Lima, Apt 401", time: "há 1h" },
  { icon: <Info className="w-4 h-4 text-purple-400" />, text: "Assembleia agendada — Condomínio Vista Verde, 20/06", time: "há 2h" },
  { icon: <Bell className="w-4 h-4 text-[#af101a]" />, text: "Notificação enviada para 48 moradores — Manutenção", time: "há 3h" },
  { icon: <FileText className="w-4 h-4 text-white/40" />, text: "Relatório mensal gerado — Maio 2026", time: "há 5h" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("visao-geral");
  const [condSearch, setCondSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const filteredCondominios = (mockCondominios ?? []).filter((c: any) =>
    c.nome?.toLowerCase().includes(condSearch.toLowerCase()) ||
    c.cidade?.toLowerCase().includes(condSearch.toLowerCase())
  );

  const filteredUsers = (mockUsers ?? []).filter((u: any) =>
    u.nome?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "visao-geral",  label: "Visão Geral" },
    { id: "condominios",  label: "Condomínios" },
    { id: "usuarios",     label: "Usuários" },
    { id: "auditoria",    label: "Auditoria" },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-white font-sans">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-[#101c29] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-sm text-white/80">{toast}</span>
          <button onClick={() => setToast(null)} className="text-white/40 hover:text-white transition-colors ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold tracking-tight mb-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Painel <span style={{ color: "#af101a" }}>Administrativo</span>
          </h1>
          <p className="text-white/40 text-sm">Facilities — Gestão de Condomínios</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#101c29] border border-white/10 p-1 rounded-xl w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-[#af101a] text-white shadow"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── VISÃO GERAL ── */}
        {activeTab === "visao-geral" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KPI_CARDS.map((k) => (
                <div
                  key={k.label}
                  className={`bg-[#101c29] border border-white/10 rounded-2xl p-5 bg-gradient-to-br ${k.bg}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/5">{k.icon}</div>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        k.deltaUp
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {k.deltaUp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {k.delta}
                    </span>
                  </div>
                  <p className="text-3xl font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {k.value}
                  </p>
                  <p className="text-white/50 text-sm mt-1">{k.label}</p>
                </div>
              ))}
            </div>

            {/* Bar Chart */}
            <div className="bg-[#101c29] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-[#af101a]" />
                <h2 className="font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Arrecadação Mensal (%)
                </h2>
              </div>
              <div className="flex items-end gap-2 h-40">
                {BAR_DATA.map((b) => (
                  <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md transition-all duration-500"
                      style={{
                        height: `${(b.value / 100) * 140}px`,
                        background: `linear-gradient(to top, #af101a, #d91a27)`,
                        opacity: 0.8,
                      }}
                    />
                    <span className="text-white/30 text-[10px]">{b.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end mt-4 gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#af101a] inline-block" />
                  Arrecadação %
                </span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#101c29] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-[#af101a]" />
                <h2 className="font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Atividade Recente
                </h2>
              </div>
              <ul className="space-y-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 shrink-0">{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 leading-snug">{a.text}</p>
                    </div>
                    <span className="text-xs text-white/30 whitespace-nowrap shrink-0 mt-0.5">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── CONDOMÍNIOS ── */}
        {activeTab === "condominios" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Buscar condomínio ou cidade..."
                  value={condSearch}
                  onChange={(e) => setCondSearch(e.target.value)}
                  className="w-full bg-[#101c29] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#af101a]/50 transition-colors"
                />
              </div>
              <button
                onClick={() => showToast("Em desenvolvimento — funcionalidade disponível em breve.")}
                className="flex items-center gap-2 bg-[#af101a] hover:bg-[#c41219] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                Novo Condomínio
              </button>
            </div>

            <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Nome</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Cidade</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Unidades</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Síndico</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Inadimpl.</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Status</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCondominios.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16 text-white/30">
                          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">Nenhum condomínio encontrado</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCondominios.map((c: any, i: number) => {
                        const st = STATUS_BADGE[c.status] ?? STATUS_BADGE["ativo"];
                        return (
                          <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-white">{c.nome}</td>
                            <td className="px-5 py-3.5 text-white/60">{c.cidade}</td>
                            <td className="px-5 py-3.5 text-white/60">{c.unidades}</td>
                            <td className="px-5 py-3.5 text-white/60">{c.sindico}</td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`font-medium ${
                                  parseFloat(c.inadimplencia) > 15
                                    ? "text-red-400"
                                    : parseFloat(c.inadimplencia) > 8
                                    ? "text-amber-400"
                                    : "text-green-400"
                                }`}
                              >
                                {c.inadimplencia}%
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {st.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => showToast("Em desenvolvimento — visualização em breve.")}
                                  className="flex items-center gap-1 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1 rounded-lg transition-all"
                                >
                                  <Eye className="w-3 h-3" />
                                  Ver
                                </button>
                                <button
                                  onClick={() => showToast("Em desenvolvimento — edição em breve.")}
                                  className="flex items-center gap-1 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-2.5 py-1 rounded-lg transition-all"
                                >
                                  <Pencil className="w-3 h-3" />
                                  Editar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USUÁRIOS ── */}
        {activeTab === "usuarios" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Buscar nome ou email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#101c29] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#af101a]/50 transition-colors"
                />
              </div>
              <button
                onClick={() => showToast("Em desenvolvimento — funcionalidade disponível em breve.")}
                className="flex items-center gap-2 bg-[#af101a] hover:bg-[#c41219] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                Novo Usuário
              </button>
            </div>

            <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Nome</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Email</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Tipo</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Unidade</th>
                      <th className="text-left text-white/40 font-medium px-5 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16 text-white/30">
                          <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                          <p className="text-sm">Nenhum usuário encontrado</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u: any, i: number) => {
                        const role = ROLE_BADGE[u.tipo] ?? { label: u.tipo, color: "bg-white/10 text-white/60 border border-white/10" };
                        const [isActive, setIsActive] = useState<boolean>(u.status === "ativo");
                        return (
                          <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#af101a]/20 flex items-center justify-center text-xs font-bold text-[#af101a] shrink-0">
                                  {u.nome?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-white">{u.nome}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-white/50">{u.email}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${role.color}`}>
                                {role.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-white/50">{u.unidade ?? "—"}</td>
                            <td className="px-5 py-3.5">
                              <button
                                onClick={() => setIsActive((p) => !p)}
                                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
                                  isActive
                                    ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                    : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                }`}
                                title="Clique para alternar status"
                              >
                                {isActive ? (
                                  <>
                                    <UserCheck className="w-3 h-3" /> Ativo
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3 h-3" /> Inativo
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── AUDITORIA ── */}
        {activeTab === "auditoria" && (
          <div className="bg-[#101c29] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#af101a]" />
              <h2 className="font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Log de Auditoria
              </h2>
            </div>

            {(!mockAuditLog || mockAuditLog.length === 0) ? (
              <div className="text-center py-16 text-white/30">
                <Shield className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Nenhum evento de auditoria registrado</p>
              </div>
            ) : (
              <ol className="relative border-l border-white/10 space-y-0 ml-2">
                {(mockAuditLog as any[]).map((ev: any, i: number) => {
                  const iconEl = AUDIT_ICON[ev.tipo] ?? <Info className="w-4 h-4 text-white/40" />;
                  return (
                    <li key={i} className="ml-6 pb-6 last:pb-0">
                      <span className="absolute -left-[11px] flex items-center justify-center w-5 h-5 rounded-full bg-[#070b12] border border-white/10 ring-2 ring-[#070b12]">
                        {iconEl}
                      </span>
                      <div className="bg-[#070b12]/60 border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{ev.acao}</span>
                            {ev.entidade && (
                              <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-md">
                                {ev.entidade}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-white/30 whitespace-nowrap">{ev.data}</span>
                        </div>
                        {ev.detalhes && (
                          <p className="text-sm text-white/50 leading-relaxed">{ev.detalhes}</p>
                        )}
                        {ev.usuario && (
                          <p className="text-xs text-white/30 mt-1.5 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {ev.usuario}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
