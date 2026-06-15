"use client";

import { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";

interface QuoteModalProps {
  onClose: () => void;
}

export default function QuoteModal({ onClose }: QuoteModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    condo: "",
    units: "",
    role: "Síndico",
  });
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#af101a] to-[#d32f2f] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Solicitar Cotação
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Gratuita e sem compromisso
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-[#101c29] text-lg mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Cotação Solicitada!
              </h3>
              <p className="text-[#5f5e5e] text-sm mb-6">
                Recebemos sua solicitação. Nossa equipe entrará em contato em até 24 horas.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#af101a] text-white font-semibold text-sm"
              >
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#101c29] mb-1.5">Nome Completo *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#af101a]"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#101c29] mb-1.5">E-mail *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#af101a]"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#101c29] mb-1.5">Telefone *</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#af101a]"
                    placeholder="(13) 9 9999-9999"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#101c29] mb-1.5">Nome do Condomínio</label>
                  <input
                    type="text"
                    value={form.condo}
                    onChange={(e) => setForm({ ...form, condo: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#af101a]"
                    placeholder="Edifício / Residencial"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#101c29] mb-1.5">Nº de Unidades</label>
                  <input
                    type="number"
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#af101a]"
                    placeholder="Ex: 48"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#101c29] mb-1.5">Você é:</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#af101a] bg-white"
                  >
                    {["Síndico", "Conselheiro", "Morador", "Administradora"].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-semibold transition-colors"
              >
                <Send size={16} />
                Solicitar Cotação Gratuita
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
