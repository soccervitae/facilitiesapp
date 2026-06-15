"use client";

import { useState } from "react";
import { mockVisitantes, mockEncomendas, mockMoradores } from "@/lib/mockData";
import type { Visitante, Encomenda, Morador } from "@/types";
import {
  ShieldCheck,
  Users,
  Package,
  Home,
  Building2,
  UserPlus,
  LogIn,
  LogOut,
  CheckCircle,
  Clock,
  Plus,
  Phone,
  Search,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "portaria" | "visitantes" | "encomendas" | "moradores";

interface NewVisitante {
  nome: string;
  documento: string;
  unidadeDestino: string;
}

interface NewEncomenda {
  destinatario: string;
  unidade: string;
  descricao: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nowTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTimestamp(ts: string): string {
  if (!ts) return "—";
  const parts = ts.split(" ");
  if (parts.length === 2) {
    const [date, time] = parts;
    const [y, m, day] = date.split("-");
    if (y && m && day) return `${day}/${m}/${y} ${time}`;
  }
  return ts;
}

function formatTimeOnly(ts: string): string {
  if (!ts) return "—";
  const parts = ts.split(" ");
  return parts[1] ?? ts;
}

// ─── Status Badges ────────────────────────────────────────────────────────────

function VisitanteStatusBadge({ status }: { status: "Dentro" | "Saiu" }) {
  return status === "Dentro" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Dentro
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/15 text-gray-400 border border-gray-500/30">
      Saiu
    </span>
  );
}

function EncomendaStatusBadge({ status }: { status: "Aguardando" | "Retirado" }) {
  return status === "Aguardando" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
      <Clock size={11} /> Aguardando
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
      <CheckCircle size={11} /> Retirado
    </span>
  );
}

// ─── Tab: Portaria ────────────────────────────────────────────────────────────

function TabPortaria({
  visitantes,
  encomendas,
  onNavigate,
}: {
  visitantes: Visitante[];
  encomendas: Encomenda[];
  onNavigate: (tab: Tab) => void;
}) {
  const dentroCount     = visitantes.filter((v) => v.status === "Dentro").length;
  const aguardandoCount = encomendas.filter((e) => e.status === "Aguardando").length;

  const today       = new Date().toISOString().split("T")[0];
  const todayEntries = visitantes.filter((v) => v.entrada.startsWith(today));

  const summaryCards = [
    {
      label:     "Visitantes dentro",
      value:     dentroCount,
      icon:      <Users size={22} className="text-emerald-400" />,
      border:    "border-emerald-500/20 bg-emerald-500/5",
      textColor: "text-emerald-400",
    },
    {
      label:     "Encomendas aguardando",
      value:     aguardandoCount,
      icon:      <Package size={22} className="text-yellow-400" />,
      border:    "border-yellow-500/20 bg-yellow-500/5",
      textColor: "text-yellow-400",
    },
    {
      label:     "Entradas hoje",
      value:     todayEntries.length,
      icon:      <LogIn size={22} className="text-blue-400" />,
      border:    "border-blue-500/20 bg-blue-500/5",
      textColor: "text-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map(({ label, value, icon, border, textColor }) => (
          <div key={label} className={`rounded-xl bg-[#101c29] border ${border} p-5`}>
            <div className="p-2 rounded-lg bg-white/5 w-fit mb-3">{icon}</div>
            <p className={`text-3xl font-bold font-montserrat ${textColor}`}>{value}</p>
            <p className="text-sm text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-montserrat text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Registrar
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate("visitantes")}
            className="flex items-center gap-3 p-4 rounded-xl bg-[#101c29] border border-white/5 hover:border-[#af101a]/40 hover:bg-[#af101a]/10 transition-all duration-200 group"
          >
            <UserPlus size={20} className="text-[#af101a] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-200">Registrar Entrada de Visitante</span>
          </button>
          <button
            onClick={() => onNavigate("encomendas")}
            className="flex items-center gap-3 p-4 rounded-xl bg-[#101c29] border border-white/5 hover:border-[#af101a]/40 hover:bg-[#af101a]/10 transition-all duration-200 group"
          >
            <Package size={20} className="text-[#af101a] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-200">Registrar Nova Encomenda</span>
          </button>
        </div>
      </div>

      {/* Today's activity */}
      <div>
        <h3 className="font-montserrat text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Atividade de hoje
        </h3>
        {todayEntries.length === 0 ? (
          <div className="rounded-xl bg-[#101c29] border border-white/5 p-6 text-center text-gray-500 text-sm">
            Nenhuma entrada registrada hoje.
          </div>
        ) : (
          <div className="rounded-xl bg-[#101c29] border border-white/5 overflow-hidden divide-y divide-white/5">
            {todayEntries.map((v) => (
              <div key={v.id} className="flex items-center justify-between px-4 py-3 gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#af101a]/15 flex items-center justify-center shrink-0">
                    <LogIn size={14} className="text-[#af101a]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{v.nome}</p>
                    <p className="text-xs text-gray-500">{v.unidadeDestino}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="text-xs text-gray-400">{formatTimeOnly(v.entrada)}</p>
                  <VisitanteStatusBadge status={v.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Visitantes ─────────────────────────────────────────────────────────

function TabVisitantes({ visitantes: initial }: { visitantes: Visitante[] }) {
  const [visitantes, setVisitantes] = useState<Visitante[]>(initial);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState<NewVisitante>({ nome: "", documento: "", unidadeDestino: "" });
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");

  const handleRegisterEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim())            { setError("Informe o nome do visitante."); return; }
    if (!form.documento.trim())       { setError("Informe o documento."); return; }
    if (!form.unidadeDestino.trim())  { setError("Informe a unidade de destino."); return; }

    const newVisitante: Visitante = {
      id:             `v-${Date.now()}`,
      nome:           form.nome.trim(),
      documento:      form.documento.trim(),
      unidadeDestino: form.unidadeDestino.trim(),
      entrada:        nowTimestamp(),
      status:         "Dentro",
    };

    setVisitantes((prev) => [newVisitante, ...prev]);
    setForm({ nome: "", documento: "", unidadeDestino: "" });
    setShowForm(false);
    setError("");
  };

  const handleRegisterExit = (id: string) => {
    setVisitantes((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: "Saiu" as const, saida: nowTimestamp() } : v
      )
    );
  };

  const filtered = visitantes.filter(
    (v) =>
      v.nome.toLowerCase().includes(search.toLowerCase()) ||
      v.documento.includes(search) ||
      v.unidadeDestino.toLowerCase().includes(search.toLowerCase())
  );

  const dentroCount = visitantes.filter((v) => v.status === "Dentro").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-montserrat text-lg font-bold text-white">Visitantes</h2>
          <p className="text-xs text-gray-500 mt-0.5">{dentroCount} dentro agora · {visitantes.length} total</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#af101a] hover:bg-[#c9151f] text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Registrar Entrada
        </button>
      </div>

      {/* Registration form */}
      {showForm && (
        <form
          onSubmit={handleRegisterEntry}
          className="rounded-xl bg-[#101c29] border border-[#af101a]/25 p-5 space-y-4"
        >
          <h3 className="font-montserrat font-semibold text-white">Novo Visitante</h3>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Nome completo</label>
              <input
                type="text"
                placeholder="Nome do visitante"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Documento (CPF/RG)</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={form.documento}
                onChange={(e) => setForm((f) => ({ ...f, documento: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Unidade de destino</label>
              <input
                type="text"
                placeholder="Ex: Apto 42-A"
                value={form.unidadeDestino}
                onChange={(e) => setForm((f) => ({ ...f, unidadeDestino: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#af101a] hover:bg-[#c9151f] text-white text-sm font-medium transition-colors"
            >
              <LogIn size={14} /> Registrar Entrada
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

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nome, documento ou unidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#101c29] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[#101c29] border border-white/5 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Nome</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Documento</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Unidade</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Entrada</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Nenhum visitante encontrado.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((v) => (
              <div
                key={v.id}
                className="flex flex-col sm:grid sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-2 sm:gap-4 items-start sm:items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <p className="text-sm font-medium text-white">{v.nome}</p>
                <p className="text-sm text-gray-400">{v.documento}</p>
                <p className="text-sm text-gray-400">{v.unidadeDestino}</p>
                <p className="text-xs text-gray-500">{formatTimestamp(v.entrada)}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <VisitanteStatusBadge status={v.status} />
                  {v.status === "Dentro" && (
                    <button
                      onClick={() => handleRegisterExit(v.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-medium hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 transition-all"
                    >
                      <LogOut size={12} /> Registrar Saída
                    </button>
                  )}
                  {v.status === "Saiu" && v.saida && (
                    <span className="text-xs text-gray-600">Saída: {formatTimeOnly(v.saida)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Encomendas ─────────────────────────────────────────────────────────

function TabEncomendas({ encomendas: initial }: { encomendas: Encomenda[] }) {
  const [encomendas, setEncomendas] = useState<Encomenda[]>(initial);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState<NewEncomenda>({ destinatario: "", unidade: "", descricao: "" });
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.destinatario.trim()) { setError("Informe o destinatário."); return; }
    if (!form.unidade.trim())      { setError("Informe a unidade."); return; }
    if (!form.descricao.trim())    { setError("Informe uma descrição da encomenda."); return; }

    const newEncomenda: Encomenda = {
      id:              `e-${Date.now()}`,
      destinatario:    form.destinatario.trim(),
      unidade:         form.unidade.trim(),
      descricao:       form.descricao.trim(),
      dataRecebimento: nowTimestamp(),
      status:          "Aguardando",
    };

    setEncomendas((prev) => [newEncomenda, ...prev]);
    setForm({ destinatario: "", unidade: "", descricao: "" });
    setShowForm(false);
    setError("");
  };

  const handleConfirmRetirada = (id: string) => {
    setEncomendas((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "Retirado" as const, dataRetirada: nowTimestamp() }
          : e
      )
    );
  };

  const filtered = encomendas.filter(
    (e) =>
      e.destinatario.toLowerCase().includes(search.toLowerCase()) ||
      e.unidade.toLowerCase().includes(search.toLowerCase()) ||
      e.descricao.toLowerCase().includes(search.toLowerCase())
  );

  const aguardandoCount = encomendas.filter((e) => e.status === "Aguardando").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-montserrat text-lg font-bold text-white">Encomendas</h2>
          <p className="text-xs text-gray-500 mt-0.5">{aguardandoCount} aguardando retirada · {encomendas.length} total</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#af101a] hover:bg-[#c9151f] text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Encomenda
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-[#101c29] border border-[#af101a]/25 p-5 space-y-4"
        >
          <h3 className="font-montserrat font-semibold text-white">Registrar Encomenda</h3>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Destinatário</label>
              <input
                type="text"
                placeholder="Nome do morador"
                value={form.destinatario}
                onChange={(e) => setForm((f) => ({ ...f, destinatario: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Unidade</label>
              <input
                type="text"
                placeholder="Ex: Apto 42-A"
                value={form.unidade}
                onChange={(e) => setForm((f) => ({ ...f, unidade: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Caixa Amazon"
                value={form.descricao}
                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                className="w-full bg-[#070b12] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#af101a] hover:bg-[#c9151f] text-white text-sm font-medium transition-colors"
            >
              <Package size={14} /> Registrar Encomenda
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

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por destinatário, unidade ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#101c29] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-[#101c29] border border-white/5 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1.5fr_auto_1fr_1fr_auto] gap-4 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Destinatário</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Unidade</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Descrição</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Recebido em</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Nenhuma encomenda encontrada.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((enc) => (
              <div
                key={enc.id}
                className="flex flex-col sm:grid sm:grid-cols-[1.5fr_auto_1fr_1fr_auto] gap-2 sm:gap-4 items-start sm:items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <p className="text-sm font-medium text-white">{enc.destinatario}</p>
                <p className="text-sm text-gray-300 whitespace-nowrap">{enc.unidade}</p>
                <p className="text-sm text-gray-400 truncate">{enc.descricao}</p>
                <p className="text-xs text-gray-500 whitespace-nowrap">{formatTimestamp(enc.dataRecebimento)}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <EncomendaStatusBadge status={enc.status} />
                  {enc.status === "Aguardando" && (
                    <button
                      onClick={() => handleConfirmRetirada(enc.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-medium hover:bg-emerald-500/15 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                    >
                      <CheckCircle size={12} /> Confirmar Retirada
                    </button>
                  )}
                  {enc.status === "Retirado" && enc.dataRetirada && (
                    <span className="text-xs text-gray-600">Retirado: {formatTimestamp(enc.dataRetirada)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Moradores ───────────────────────────────────────────────────────────

function TabMoradores({ moradores }: { moradores: Morador[] }) {
  const [search, setSearch] = useState("");

  const filtered = moradores.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.unidade.toLowerCase().includes(search.toLowerCase()) ||
      m.telefone.includes(search)
  );

  const statusColor: Record<string, string> = {
    Ativo:        "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    Inadimplente: "bg-red-500/15 text-red-400 border border-red-500/30",
    Inativo:      "bg-gray-500/15 text-gray-400 border border-gray-500/30",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-montserrat text-lg font-bold text-white">Moradores</h2>
          <p className="text-xs text-gray-500 mt-0.5">{moradores.length} morador(es) cadastrado(s)</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nome, unidade ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#101c29] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#af101a]/60"
        />
      </div>

      {/* List */}
      <div className="rounded-xl bg-[#101c29] border border-white/5 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1.5fr_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Nome</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Unidade</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Telefone</span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Nenhum morador encontrado.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="flex flex-col sm:grid sm:grid-cols-[1.5fr_auto_auto_auto] gap-2 sm:gap-4 items-start sm:items-center px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white">{m.nome}</p>
                  <p className="text-xs text-gray-500">{m.tipo}</p>
                </div>
                <p className="text-sm text-gray-300 whitespace-nowrap">{m.unidade}</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-400 whitespace-nowrap">
                  <Phone size={12} className="text-gray-600" />
                  {m.telefone}
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    statusColor[m.status] ?? statusColor["Inativo"]
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Nav Tab Button ───────────────────────────────────────────────────────────

function NavTab({
  label,
  icon,
  active,
  badge,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        active
          ? "bg-[#af101a] text-white shadow-lg shadow-[#af101a]/20"
          : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
      {badge !== undefined && badge > 0 && (
        <span
          className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
            active ? "bg-white/25 text-white" : "bg-[#af101a] text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PorteiroPage() {
  const [activeTab, setActiveTab]   = useState<Tab>("portaria");
  const [visitantes]                = useState<Visitante[]>(mockVisitantes);
  const [encomendas]                = useState<Encomenda[]>(mockEncomendas);

  const dentroCount     = visitantes.filter((v) => v.status === "Dentro").length;
  const aguardandoCount = encomendas.filter((e) => e.status === "Aguardando").length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "portaria",   label: "Portaria",   icon: <ShieldCheck size={16} /> },
    { id: "visitantes", label: "Visitantes", icon: <Users size={16} />,   badge: dentroCount > 0 ? dentroCount : undefined },
    { id: "encomendas", label: "Encomendas", icon: <Package size={16} />, badge: aguardandoCount > 0 ? aguardandoCount : undefined },
    { id: "moradores",  label: "Moradores",  icon: <Home size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={18} className="text-[#af101a]" />
            <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">Facilities</span>
          </div>
          <h1 className="font-montserrat text-3xl font-bold text-white">Painel da Portaria</h1>
          <p className="text-sm text-gray-400 mt-1">Controle de acesso e recebimento de encomendas</p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
          {tabs.map((t) => (
            <NavTab
              key={t.id}
              label={t.label}
              icon={t.icon}
              active={activeTab === t.id}
              badge={t.badge}
              onClick={() => setActiveTab(t.id)}
            />
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "portaria" && (
            <TabPortaria
              visitantes={mockVisitantes}
              encomendas={mockEncomendas}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === "visitantes" && <TabVisitantes visitantes={mockVisitantes} />}
          {activeTab === "encomendas" && <TabEncomendas encomendas={mockEncomendas} />}
          {activeTab === "moradores"  && <TabMoradores  moradores={mockMoradores} />}
        </div>
      </div>
    </div>
  );
}
