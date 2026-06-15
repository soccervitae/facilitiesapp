"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockTickets } from "@/lib/mockData";
import { Ticket } from "@/types";
import {
  ClipboardList, Wrench, CheckCircle2, Clock, AlertTriangle, Plus, X,
} from "lucide-react";

const tabs = ["visao-geral", "tarefas", "chamados"] as const;
type Tab = typeof tabs[number];

const tabLabels: Record<Tab, string> = {
  "visao-geral": "Visão Geral",
  tarefas: "Minhas Tarefas",
  chamados: "Chamados",
};

const TAREFAS_MOCK = [
  { id: "tk-1", titulo: "Verificar iluminação do corredor", local: "Bloco B – 3º andar", prazo: "2026-06-16", status: "Pendente" },
  { id: "tk-2", titulo: "Limpeza área da piscina", local: "Área de Lazer", prazo: "2026-06-15", status: "Em Andamento" },
  { id: "tk-3", titulo: "Revisão dos extintores", local: "Todos os andares", prazo: "2026-06-20", status: "Pendente" },
  { id: "tk-4", titulo: "Troca de lâmpada – Portaria", local: "Portaria", prazo: "2026-06-14", status: "Concluído" },
];

export default function ColaboradorPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("visao-geral");
  const [chamados, setChamados] = useState<Ticket[]>(mockTickets);
  const [showForm, setShowForm] = useState(false);
  const [newChamado, setNewChamado] = useState({ titulo: "", categoria: "Manutenção" as Ticket["categoria"], descricao: "" });

  const pendentes = TAREFAS_MOCK.filter((t) => t.status !== "Concluído").length;
  const abertos = chamados.filter((c) => c.status === "Aberto").length;
  const emAndamento = chamados.filter((c) => c.status === "Em Andamento").length;

  const statusColor = (s: string) => {
    if (s === "Resolvido" || s === "Concluído") return "bg-green-500/20 text-green-400";
    if (s === "Em Andamento") return "bg-amber-500/20 text-amber-400";
    return "bg-red-500/20 text-red-400";
  };

  const handleAddChamado = (e: React.FormEvent) => {
    e.preventDefault();
    const novo: Ticket = {
      id: `t-${Date.now()}`,
      categoria: newChamado.categoria,
      titulo: newChamado.titulo,
      descricao: newChamado.descricao,
      dataCriacao: new Date().toISOString().split("T")[0],
      status: "Aberto",
      prioridade: "Média",
    };
    setChamados([novo, ...chamados]);
    setNewChamado({ titulo: "", categoria: "Manutenção", descricao: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white font-bold text-2xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Painel do Colaborador
        </h1>
        <p className="text-white/50 text-sm mt-1">Olá, {user?.nome}! Aqui estão suas atividades de hoje.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#101c29] border border-white/10 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t ? "bg-[#af101a] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Visão Geral */}
      {activeTab === "visao-geral" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Tarefas Pendentes", value: pendentes, icon: <ClipboardList size={22} />, color: "text-amber-400 bg-amber-400/10" },
              { label: "Chamados Abertos", value: abertos, icon: <AlertTriangle size={22} />, color: "text-red-400 bg-red-400/10" },
              { label: "Em Andamento", value: emAndamento, icon: <Clock size={22} />, color: "text-blue-400 bg-blue-400/10" },
            ].map((k) => (
              <div key={k.label} className="bg-[#101c29] border border-white/10 rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>{k.icon}</div>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>{k.value}</div>
                <div className="text-white/50 text-xs mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Recent tasks */}
          <div className="bg-[#101c29] border border-white/10 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 text-sm">Próximas Tarefas</h3>
            <div className="space-y-3">
              {TAREFAS_MOCK.filter((t) => t.status !== "Concluído").slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <Wrench size={16} className="text-[#af101a] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{t.titulo}</p>
                    <p className="text-white/40 text-xs">{t.local} · Prazo: {t.prazo}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(t.status)}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tarefas */}
      {activeTab === "tarefas" && (
        <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>Minhas Tarefas</h3>
          </div>
          <div className="divide-y divide-white/5">
            {TAREFAS_MOCK.map((t) => (
              <div key={t.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  t.status === "Concluído" ? "border-green-500 bg-green-500/20" : "border-white/20"
                }`}>
                  {t.status === "Concluído" && <CheckCircle2 size={14} className="text-green-400" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.status === "Concluído" ? "text-white/30 line-through" : "text-white"}`}>
                    {t.titulo}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">{t.local} · Prazo: {t.prazo}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${statusColor(t.status)}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chamados */}
      {activeTab === "chamados" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white text-sm font-semibold transition-colors"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancelar" : "Novo Chamado"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAddChamado} className="bg-[#101c29] border border-[#af101a]/30 rounded-2xl p-5 space-y-3">
              <h3 className="text-white font-bold text-sm">Registrar Chamado</h3>
              <input required type="text" placeholder="Título do chamado" value={newChamado.titulo}
                onChange={(e) => setNewChamado({ ...newChamado, titulo: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30" />
              <select value={newChamado.categoria} onChange={(e) => setNewChamado({ ...newChamado, categoria: e.target.value as Ticket["categoria"] })}
                className="w-full px-3 py-2.5 rounded-lg bg-[#101c29] border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a]">
                {["Manutenção", "Limpeza", "Barulho", "Financeiro", "Outros"].map((c) => <option key={c}>{c}</option>)}
              </select>
              <textarea required rows={3} placeholder="Descreva o problema..." value={newChamado.descricao}
                onChange={(e) => setNewChamado({ ...newChamado, descricao: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30 resize-none" />
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[#af101a] text-white text-sm font-semibold">
                Registrar Chamado
              </button>
            </form>
          )}

          <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {chamados.map((c) => (
                <div key={c.id} className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors">
                  <Wrench size={16} className="text-[#af101a] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium">{c.titulo}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#af101a]/20 text-[#af101a]">{c.categoria}</span>
                    </div>
                    <p className="text-white/50 text-xs mt-1">{c.descricao}</p>
                    <p className="text-white/30 text-xs mt-1">{c.dataCriacao} · {c.unidade || "Área Comum"}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${statusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
