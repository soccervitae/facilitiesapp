"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockBoletos, mockBookings, mockTickets, mockAssemblies } from "@/lib/mockData";
import type { Boleto, Booking, Ticket, Assembly } from "@/types";
import {
  Home,
  FileText,
  CalendarCheck,
  Headphones,
  Users,
  CreditCard,
  Copy,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ChevronRight,
  Building2,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Tag,
  Wrench,
  Trash2,
  ShieldCheck,
  ClipboardList,
  HelpCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "inicio" | "boletos" | "reservas" | "chamados" | "assembleias";

interface NewBooking {
  area: string;
  data: string;
  periodo: string;
}

interface NewTicket {
  titulo: string;
  categoria: string;
  descricao: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// ─── Status Badges ────────────────────────────────────────────────────────────

function BoletoStatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: React.ReactNode }> = {
    Pago:     { color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30", icon: <CheckCircle size={12} /> },
    Pendente: { color: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",   icon: <Clock size={12} /> },
    Atrasado: { color: "bg-red-500/15 text-red-400 border border-red-500/30",             icon: <AlertCircle size={12} /> },
  };
  const s = map[status] ?? map["Pendente"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>
      {s.icon} {status}
    </span>
  );
}

function TicketStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aberto:          "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    "Em Andamento":  "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    Resolvido:       "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? map["Aberto"]}`}>
      {status}
    </span>
  );
}

function CategoriaBadge({ categoria }: { categoria: string }) {
  const icons: Record<string, React.ReactNode> = {
    Manutenção:     <Wrench size={11} />,
    Limpeza:        <Trash2 size={11} />,
    Segurança:      <ShieldCheck size={11} />,
    Administrativo: <ClipboardList size={11} />,
    Barulho:        <Headphones size={11} />,
    Outro:          <HelpCircle size={11} />,
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#af101a]/15 text-[#e05560] border border-[#af101a]/30">
      {icons[categoria] ?? <Tag size={11} />} {categoria}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmado: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    Pendente:   "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    Cancelado:  "bg-red-500/15 text-red-400 border border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? map["Pendente"]}`}>
      {status}
    </span>
  );
}

// ─── Tab: Início ──────────────────────────────────────────────────────────────

function TabInicio({
  onNavigate,
  boletos,
  assemblies,
}: {
  onNavigate: (tab: Tab) => void;
  boletos: Boleto[];
  assemblies: Assembly[];
}) {
  const { user } = useAuth();
  const lastBoleto  = boletos[0];
  const nextAssembly = assemblies.find((a) => new Date(a.data) >= new Date());

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#af101a]/30 via-[#101c29] to-[#101c29] border border-[#af101a]/25 p-6">
        <p className="text-sm text-gray-400 mb-1">Bem-vindo de volta,</p>
        <h2 className="font-montserrat text-2xl font-bold text-white">{user?.nome ?? "Morador"}</h2>
        <div className="flex items-center gap-2 mt-2">
          <Building2 size={14} className="text-gray-400" />
          <span className="text-sm text-gray-300">{user?.unidade ?? "—"}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-montserrat text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Ações rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(
            [
              { label: "Pagar Boleto",  icon: <CreditCard size={20} />,    tab: "boletos"   as Tab },
              { label: "Fazer Reserva", icon: <CalendarCheck size={20} />, tab: "reservas"  as Tab },
              { label: "Abrir Chamado", icon: <Headphones size={20} />,    tab: "chamados"  as Tab },
            ] as const
          ).map(({ label, icon, tab }) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#101c29] border border-white/5 hover:border-[#af101a]/40 hover:bg-[#af101a]/10 transition-all duration-200 group"
            >
              <span className="text-[#af101a] group-hover:scale-110 transition-transform">{icon}</span>
              <span className="text-sm font-medium text-gray-200">{label}</span>
              <ChevronRight size={14} className="ml-auto text-gray-600 group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Last boleto */}
      {lastBoleto && (
        <div>
          <h3 className="font-montserrat text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Último boleto</h3>
          <div className="rounded-xl bg-[#101c29] border border-white/5 p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-white font-medium">{lastBoleto.referencia}</p>
              <p className="text-sm text-gray-400">Venc. {formatDate(lastBoleto.vencimento)}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-white font-semibold">{formatCurrency(lastBoleto.valor)}</p>
              <BoletoStatusBadge status={lastBoleto.status} />
            </div>
          </div>
        </div>
      )}

      {/* Next assembly */}
      {nextAssembly && (
        <div>
          <h3 className="font-montserrat text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Próxima assembleia</h3>
          <div className="rounded-xl bg-[#101c29] border border-white/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-white font-medium">{nextAssembly.titulo}</p>
                <p className="text-sm text-gray-400 line-clamp-2">{nextAssembly.pauta}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center gap-1.5 text-[#af101a]">
                  <Calendar size={14} />
                  <span className="text-sm font-medium">{formatDate(nextAssembly.data)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{nextAssembly.hora}</p>
              </div>
            </div>
            {nextAssembly.votacaoAtiva && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#af101a]/15 border border-[#af101a]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#af101a] animate-pulse" />
                <span className="text-xs text-[#e05560] font-medium">Votação em andamento</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Boletos ─────────────────────────────────────────────────────────────

function TabBoletos({ boletos }: { boletos: Boleto[] }) {
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat text-lg font-bold text-white">Boletos</h2>
        <span className="text-xs text-gray-500">{boletos.length} boleto(s)</span>
      </div>

      <div className="space-y-3">
        {boletos.map((b) => (
          <div key={b.id} className="rounded-xl bg-[#101c29] border border-white/5 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-montserrat font-bold text-white text-lg">{b.referencia}</p>
                <p className="text-sm text-gray-400 mt-0.5">Vencimento: {formatDate(b.vencimento)}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xl font-bold text-white">{formatCurrency(b.valor)}</p>
                <BoletoStatusBadge status={b.status} />
              </div>
            </div>

            {b.codigoBarras && (
              <div className="rounded-lg bg-[#070b12] border border-white/5 px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">Código de barras</p>
                <p className="text-xs text-gray-300 font-mono break-all leading-relaxed">{b.codigoBarras}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCopy(b.id, b.codigoBarras ?? "")}
                disabled={!b.codigoBarras}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#af101a]/15 border border-[#af101a]/30 text-[#e05560] text-sm font-medium hover:bg-[#af101a]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied[b.id] ? (
                  <><CheckCircle size={14} /> Copiado!</>
                ) : (
                  <><Copy size={14} /> Copiar código de barras</>
                )}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-all">
                <Download size={14} /> Baixar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Reservas ────────────────────────────────────────────────────────────

const AREAS    = ["Salão de Festas", "Churrasqueira 1", "Churrasqueira 2", "Quadra Esportiva", "Sala de Reuniões"];
const PERIODOS = ["Manhã", "Tarde", "Noite", "Integral"];

function TabReservas({ bookings: initial }: { bookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initial);
  const [form, setForm]         = useState<NewBooking>({ area: AREAS[0], data: "", periodo: PERIODOS[0] });
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.data) { setError("Selecione uma data."); return; }
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      area: form.area,
      data: form.data,
      periodo: form.periodo,
      status: "Pendente",
    };
    setBookings((prev) => [newBooking, ...prev]);
    setForm({ area: AREAS[0], data: "", periodo: PERIODOS[0] });
    setShowForm(false);
    setError("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat text-lg font-bold text-white">Reservas</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#af101a] hover:bg-[#c9151f] text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Reserva
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-[#101c29] border border-[#af101a]/25 p-5 space-y-4"
        >
          <h3 className="font-montserrat font-semibold text-white">Solicitar Reserva</h3>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Área</label>
              <select
                value={form.area}
                onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#af101a]/60"
              >
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Data</label>
              <input
                type="date"
                value={form.data}
                onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#af101a]/60 [color-scheme:dark]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Período</label>
              <select
                value={form.periodo}
                onChange={(e) => setForm((f) => ({ ...f, periodo: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#af101a]/60"
              >
                {PERIODOS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#af101a] hover:bg-[#c9151f] text-white text-sm font-medium transition-colors"
            >
              Confirmar Reserva
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(""); }}
              className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {bookings.length === 0 && (
          <div className="rounded-xl bg-[#101c29] border border-white/5 p-8 text-center text-gray-500 text-sm">
            Nenhuma reserva encontrada.
          </div>
        )}
        {bookings.map((b) => (
          <div
            key={b.id}
            className="rounded-xl bg-[#101c29] border border-white/5 p-4 flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <p className="font-medium text-white">{b.area}</p>
              <p className="text-sm text-gray-400">{formatDate(b.data)} · {b.periodo}</p>
            </div>
            <BookingStatusBadge status={b.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Chamados ────────────────────────────────────────────────────────────

const CATEGORIAS = ["Manutenção", "Limpeza", "Segurança", "Administrativo", "Outro"];

function TabChamados({ tickets: initial }: { tickets: Ticket[] }) {
  const { user }  = useAuth();
  const [tickets, setTickets]   = useState<Ticket[]>(initial);
  const [form, setForm]         = useState<NewTicket>({ titulo: "", categoria: CATEGORIAS[0], descricao: "" });
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim())    { setError("Informe um título."); return; }
    if (!form.descricao.trim()) { setError("Informe uma descrição."); return; }

    const newTicket: Ticket = {
      id:          `t-${Date.now()}`,
      titulo:      form.titulo,
      categoria:   form.categoria,
      descricao:   form.descricao,
      dataCriacao: new Date().toISOString().split("T")[0],
      status:      "Aberto",
      prioridade:  "Média",
      unidade:     user?.unidade ?? "",
    };

    setTickets((prev) => [newTicket, ...prev]);
    setForm({ titulo: "", categoria: CATEGORIAS[0], descricao: "" });
    setShowForm(false);
    setError("");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat text-lg font-bold text-white">Chamados</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#af101a] hover:bg-[#c9151f] text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Abrir Chamado
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-[#101c29] border border-[#af101a]/25 p-5 space-y-4"
        >
          <h3 className="font-montserrat font-semibold text-white">Novo Chamado</h3>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Título</label>
              <input
                type="text"
                placeholder="Descreva o problema brevemente"
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Categoria</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#af101a]/60"
              >
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium">Descrição</label>
            <textarea
              rows={4}
              placeholder="Descreva detalhadamente o problema..."
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#af101a] hover:bg-[#c9151f] text-white text-sm font-medium transition-colors"
            >
              Enviar Chamado
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(""); }}
              className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {tickets.length === 0 && (
          <div className="rounded-xl bg-[#101c29] border border-white/5 p-8 text-center text-gray-500 text-sm">
            Nenhum chamado encontrado.
          </div>
        )}
        {tickets.map((t) => (
          <div key={t.id} className="rounded-xl bg-[#101c29] border border-white/5 p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-white">{t.titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(t.dataCriacao)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <CategoriaBadge categoria={t.categoria} />
                <TicketStatusBadge status={t.status} />
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Assembleias ─────────────────────────────────────────────────────────

function TabAssembleias({ assemblies: initial }: { assemblies: Assembly[] }) {
  const [assemblies, setAssemblies] = useState<Assembly[]>(initial);
  const [voted, setVoted]           = useState<Record<string, "favor" | "contra">>({});

  const handleVote = (id: string, side: "favor" | "contra") => {
    if (voted[id]) return;
    setVoted((prev) => ({ ...prev, [id]: side }));
    setAssemblies((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          votosFavor:  side === "favor"  ? (a.votosFavor  ?? 0) + 1 : (a.votosFavor  ?? 0),
          votosContra: side === "contra" ? (a.votosContra ?? 0) + 1 : (a.votosContra ?? 0),
        };
      })
    );
  };

  return (
    <div className="space-y-5">
      <h2 className="font-montserrat text-lg font-bold text-white">Assembleias</h2>

      <div className="space-y-4">
        {assemblies.map((a) => {
          const totalVotos = (a.votosFavor ?? 0) + (a.votosContra ?? 0);
          const pctFavor   = totalVotos > 0 ? Math.round(((a.votosFavor  ?? 0) / totalVotos) * 100) : 0;
          const pctContra  = totalVotos > 0 ? 100 - pctFavor : 0;
          const myVote     = voted[a.id];

          return (
            <div key={a.id} className="rounded-xl bg-[#101c29] border border-white/5 p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-montserrat font-semibold text-white">{a.titulo}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={12} /> {formatDate(a.data)}
                    </span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-400">{a.hora}</span>
                  </div>
                </div>
                {a.votacaoAtiva && (
                  <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#af101a]/15 border border-[#af101a]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#af101a] animate-pulse" />
                    <span className="text-xs text-[#e05560] font-medium">Votação aberta</span>
                  </span>
                )}
              </div>

              {/* Pauta */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5">Pauta</p>
                <p className="text-sm text-gray-300 leading-relaxed">{a.pauta}</p>
              </div>

              {/* Voting section */}
              {a.votacaoAtiva && (
                <div className="space-y-3 border-t border-white/5 pt-4">
                  {a.perguntaVotacao && (
                    <p className="text-sm font-medium text-white">{a.perguntaVotacao}</p>
                  )}

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex h-2.5 rounded-full overflow-hidden bg-white/5">
                      <div
                        className="bg-emerald-500 transition-all duration-700 ease-out"
                        style={{ width: `${pctFavor}%` }}
                      />
                      <div
                        className="bg-red-500 transition-all duration-700 ease-out"
                        style={{ width: `${pctContra}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400 font-medium">
                        {a.votosFavor ?? 0} a favor{totalVotos > 0 ? ` (${pctFavor}%)` : ""}
                      </span>
                      <span className="text-red-400 font-medium">
                        {a.votosContra ?? 0} contra{totalVotos > 0 ? ` (${pctContra}%)` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Vote buttons */}
                  {myVote ? (
                    <p className="text-xs text-gray-400">
                      Você votou{" "}
                      <span className={myVote === "favor" ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>
                        {myVote === "favor" ? "a favor" : "contra"}
                      </span>
                      . Obrigado pela participação!
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(a.id, "favor")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-all"
                      >
                        <ThumbsUp size={14} /> A Favor
                      </button>
                      <button
                        onClick={() => handleVote(a.id, "contra")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-all"
                      >
                        <ThumbsDown size={14} /> Contra
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Nav Tab Button ───────────────────────────────────────────────────────────

function NavTab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        active
          ? "bg-[#af101a] text-white shadow-lg shadow-[#af101a]/20"
          : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MoradorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("inicio");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "inicio",      label: "Início",      icon: <Home size={16} /> },
    { id: "boletos",     label: "Boletos",     icon: <FileText size={16} /> },
    { id: "reservas",    label: "Reservas",    icon: <CalendarCheck size={16} /> },
    { id: "chamados",    label: "Chamados",    icon: <Headphones size={16} /> },
    { id: "assembleias", label: "Assembleias", icon: <Users size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={18} className="text-[#af101a]" />
            <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">Facilities</span>
          </div>
          <h1 className="font-montserrat text-3xl font-bold text-white">Portal do Morador</h1>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
          {tabs.map((t) => (
            <NavTab
              key={t.id}
              label={t.label}
              icon={t.icon}
              active={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
            />
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "inicio" && (
            <TabInicio
              onNavigate={setActiveTab}
              boletos={mockBoletos}
              assemblies={mockAssemblies}
            />
          )}
          {activeTab === "boletos"     && <TabBoletos     boletos={mockBoletos} />}
          {activeTab === "reservas"    && <TabReservas    bookings={mockBookings} />}
          {activeTab === "chamados"    && <TabChamados    tickets={mockTickets} />}
          {activeTab === "assembleias" && <TabAssembleias assemblies={mockAssemblies} />}
        </div>
      </div>
    </div>
  );
}
