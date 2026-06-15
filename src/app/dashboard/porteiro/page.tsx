"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mockVisitantes, mockEncomendas, mockMoradores } from "@/lib/mockData";
import { Visitante, Encomenda } from "@/types";
import {
  Users, Package, LogIn, LogOut, CheckCircle2, Clock, Plus, X, Shield,
} from "lucide-react";

const tabs = ["portaria", "visitantes", "encomendas", "moradores"] as const;
type Tab = typeof tabs[number];

const tabLabels: Record<Tab, string> = {
  portaria: "Portaria",
  visitantes: "Visitantes",
  encomendas: "Encomendas",
  moradores: "Moradores",
};

export default function PorteiroPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("portaria");
  const [visitantes, setVisitantes] = useState<Visitante[]>(mockVisitantes);
  const [encomendas, setEncomendas] = useState<Encomenda[]>(mockEncomendas);
  const [showVisitanteForm, setShowVisitanteForm] = useState(false);
  const [showEncForm, setShowEncForm] = useState(false);
  const [newVisitante, setNewVisitante] = useState({ nome: "", documento: "", unidadeDestino: "" });
  const [newEncomenda, setNewEncomenda] = useState({ destinatario: "", unidade: "", descricao: "" });

  const visitantesDentro = visitantes.filter((v) => v.status === "Dentro").length;
  const encAguardando = encomendas.filter((e) => e.status === "Aguardando").length;

  const now = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const handleRegistrarEntrada = (e: React.FormEvent) => {
    e.preventDefault();
    const novo: Visitante = {
      id: `v-${Date.now()}`,
      nome: newVisitante.nome,
      documento: newVisitante.documento,
      unidadeDestino: newVisitante.unidadeDestino,
      entrada: now(),
      status: "Dentro",
    };
    setVisitantes([novo, ...visitantes]);
    setNewVisitante({ nome: "", documento: "", unidadeDestino: "" });
    setShowVisitanteForm(false);
  };

  const handleRegistrarSaida = (id: string) => {
    setVisitantes(visitantes.map((v) => v.id === id ? { ...v, saida: now(), status: "Saiu" } : v));
  };

  const handleReceberEncomenda = (e: React.FormEvent) => {
    e.preventDefault();
    const nova: Encomenda = {
      id: `e-${Date.now()}`,
      destinatario: newEncomenda.destinatario,
      unidade: newEncomenda.unidade,
      descricao: newEncomenda.descricao,
      dataRecebimento: now(),
      status: "Aguardando",
    };
    setEncomendas([nova, ...encomendas]);
    setNewEncomenda({ destinatario: "", unidade: "", descricao: "" });
    setShowEncForm(false);
  };

  const handleConfirmarRetirada = (id: string) => {
    setEncomendas(encomendas.map((e) => e.id === id ? { ...e, dataRetirada: now(), status: "Retirado" } : e));
  };

  const statusBadge = (s: string) => {
    if (s === "Dentro" || s === "Aguardando") return "bg-amber-500/20 text-amber-400";
    return "bg-green-500/20 text-green-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white font-bold text-2xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Painel da Portaria
        </h1>
        <p className="text-white/50 text-sm mt-1">Olá, {user?.nome}! Controle de acesso em tempo real.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#101c29] border border-white/10 rounded-xl p-1 w-fit flex-wrap">
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

      {/* Portaria */}
      {activeTab === "portaria" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Visitantes Dentro", value: visitantesDentro, icon: <Users size={22} />, color: "text-amber-400 bg-amber-400/10" },
              { label: "Encomendas Aguardando", value: encAguardando, icon: <Package size={22} />, color: "text-blue-400 bg-blue-400/10" },
              { label: "Total Visitantes Hoje", value: visitantes.length, icon: <LogIn size={22} />, color: "text-green-400 bg-green-400/10" },
              { label: "Moradores Cadastrados", value: mockMoradores.length, icon: <Shield size={22} />, color: "text-purple-400 bg-purple-400/10" },
            ].map((k) => (
              <div key={k.label} className="bg-[#101c29] border border-white/10 rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>{k.icon}</div>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "Montserrat, sans-serif" }}>{k.value}</div>
                <div className="text-white/50 text-xs mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#101c29] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 text-sm">Visitantes Recentes</h3>
              <div className="space-y-3">
                {visitantes.slice(0, 3).map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <LogIn size={15} className="text-[#af101a] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{v.nome}</p>
                      <p className="text-white/40 text-xs">{v.unidadeDestino} · {v.entrada}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge(v.status)}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#101c29] border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 text-sm">Encomendas Pendentes</h3>
              <div className="space-y-3">
                {encomendas.filter((e) => e.status === "Aguardando").map((e) => (
                  <div key={e.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Package size={15} className="text-[#af101a] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{e.destinatario}</p>
                      <p className="text-white/40 text-xs">{e.unidade} · {e.descricao}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">Aguardando</span>
                  </div>
                ))}
                {encomendas.filter((e) => e.status === "Aguardando").length === 0 && (
                  <p className="text-white/30 text-sm text-center py-4">Nenhuma encomenda pendente</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visitantes */}
      {activeTab === "visitantes" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowVisitanteForm(!showVisitanteForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white text-sm font-semibold transition-colors"
            >
              {showVisitanteForm ? <X size={16} /> : <Plus size={16} />}
              {showVisitanteForm ? "Cancelar" : "Registrar Entrada"}
            </button>
          </div>

          {showVisitanteForm && (
            <form onSubmit={handleRegistrarEntrada} className="bg-[#101c29] border border-[#af101a]/30 rounded-2xl p-5 space-y-3">
              <h3 className="text-white font-bold text-sm">Registrar Entrada de Visitante</h3>
              <input required type="text" placeholder="Nome do visitante" value={newVisitante.nome}
                onChange={(e) => setNewVisitante({ ...newVisitante, nome: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30" />
              <input required type="text" placeholder="Documento (CPF/RG)" value={newVisitante.documento}
                onChange={(e) => setNewVisitante({ ...newVisitante, documento: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30" />
              <input required type="text" placeholder="Unidade de destino (ex: Apto 42-A)" value={newVisitante.unidadeDestino}
                onChange={(e) => setNewVisitante({ ...newVisitante, unidadeDestino: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30" />
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[#af101a] text-white text-sm font-semibold">
                Registrar Entrada
              </button>
            </form>
          )}

          <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="text-white font-bold text-sm">Registro de Visitantes</h3>
            </div>
            <div className="divide-y divide-white/5">
              {visitantes.map((v) => (
                <div key={v.id} className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${v.status === "Dentro" ? "bg-amber-400/10" : "bg-green-400/10"}`}>
                    {v.status === "Dentro" ? <LogIn size={16} className="text-amber-400" /> : <LogOut size={16} className="text-green-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{v.nome}</p>
                    <p className="text-white/50 text-xs mt-0.5">Doc: {v.documento} · Destino: {v.unidadeDestino}</p>
                    <p className="text-white/30 text-xs mt-0.5">
                      Entrada: {v.entrada}
                      {v.saida && ` · Saída: ${v.saida}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge(v.status)}`}>{v.status}</span>
                    {v.status === "Dentro" && (
                      <button
                        onClick={() => handleRegistrarSaida(v.id)}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs transition-colors"
                      >
                        Registrar Saída
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Encomendas */}
      {activeTab === "encomendas" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowEncForm(!showEncForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white text-sm font-semibold transition-colors"
            >
              {showEncForm ? <X size={16} /> : <Plus size={16} />}
              {showEncForm ? "Cancelar" : "Receber Encomenda"}
            </button>
          </div>

          {showEncForm && (
            <form onSubmit={handleReceberEncomenda} className="bg-[#101c29] border border-[#af101a]/30 rounded-2xl p-5 space-y-3">
              <h3 className="text-white font-bold text-sm">Registrar Recebimento de Encomenda</h3>
              <input required type="text" placeholder="Nome do destinatário" value={newEncomenda.destinatario}
                onChange={(e) => setNewEncomenda({ ...newEncomenda, destinatario: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30" />
              <input required type="text" placeholder="Unidade (ex: Apto 42-A)" value={newEncomenda.unidade}
                onChange={(e) => setNewEncomenda({ ...newEncomenda, unidade: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30" />
              <input required type="text" placeholder="Descrição (ex: Caixa Amazon)" value={newEncomenda.descricao}
                onChange={(e) => setNewEncomenda({ ...newEncomenda, descricao: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30" />
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[#af101a] text-white text-sm font-semibold">
                Registrar Encomenda
              </button>
            </form>
          )}

          <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="text-white font-bold text-sm">Registro de Encomendas</h3>
            </div>
            <div className="divide-y divide-white/5">
              {encomendas.map((enc) => (
                <div key={enc.id} className="flex items-start gap-4 p-4 hover:bg-white/5 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${enc.status === "Aguardando" ? "bg-amber-400/10" : "bg-green-400/10"}`}>
                    {enc.status === "Aguardando" ? <Package size={16} className="text-amber-400" /> : <CheckCircle2 size={16} className="text-green-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{enc.destinatario}</p>
                    <p className="text-white/50 text-xs mt-0.5">{enc.unidade} · {enc.descricao}</p>
                    <p className="text-white/30 text-xs mt-0.5">
                      Recebido: {enc.dataRecebimento}
                      {enc.dataRetirada && ` · Retirado: ${enc.dataRetirada}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge(enc.status)}`}>{enc.status}</span>
                    {enc.status === "Aguardando" && (
                      <button
                        onClick={() => handleConfirmarRetirada(enc.id)}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs transition-colors"
                      >
                        Confirmar Retirada
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Moradores */}
      {activeTab === "moradores" && (
        <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h3 className="text-white font-bold text-sm">Moradores Cadastrados</h3>
            <p className="text-white/40 text-xs mt-1">Lista de moradores autorizados</p>
          </div>
          <div className="divide-y divide-white/5">
            {mockMoradores.map((m) => (
              <div key={m.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-[#af101a]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#af101a] font-bold text-sm">{m.nome.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{m.nome}</p>
                  <p className="text-white/40 text-xs mt-0.5">{m.unidade} · {m.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:block px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/50">
                    {m.tipo}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${m.status === "Ativo" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
