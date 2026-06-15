"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

type Status = "idle" | "success" | "error";

export default function Contato() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome é obrigatório.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail inválido.";
    if (!form.message.trim()) e.message = "Mensagem é obrigatória.";
    if (!agreed) e.agreed = "Você deve concordar com a política de privacidade.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Simulated submission
    setTimeout(() => {
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
      setAgreed(false);
    }, 800);
    setStatus("idle");
  };

  return (
    <section id="contato" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#af101a] text-sm font-semibold mb-4">
            Fale Conosco
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#101c29] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Entre em Contato
          </h2>
          <p className="text-[#5f5e5e] max-w-2xl mx-auto">
            Estamos prontos para apresentar como a Facilities pode transformar a administração
            do seu condomínio. Solicite uma cotação gratuita.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left — info */}
          <div>
            <h3
              className="text-xl font-bold text-[#101c29] mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Informações de Contato
            </h3>
            <div className="space-y-5">
              {[
                {
                  icon: <Phone size={20} />,
                  label: "Telefone / WhatsApp",
                  value: "(13) 9 9999-9999",
                },
                {
                  icon: <Mail size={20} />,
                  label: "E-mail",
                  value: "contato@facilitiescondominios.com.br",
                },
                {
                  icon: <MapPin size={20} />,
                  label: "Endereço",
                  value: "Santos, SP — Atendemos toda a Baixada Santista",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-[#af101a] flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-[#5f5e5e] mb-0.5">{item.label}</p>
                    <p className="text-[#101c29] font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-gradient-to-br from-[#101c29] to-[#1a2f47] rounded-2xl p-6 text-white">
              <p
                className="font-bold text-lg mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Horário de Atendimento
              </p>
              <p className="text-white/70 text-sm mb-1">Segunda a Sexta: 8h às 18h</p>
              <p className="text-white/70 text-sm mb-3">Sábado: 9h às 13h</p>
              <p className="text-white/50 text-xs">
                * Emergências são atendidas 24h pelo WhatsApp.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "success" && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700 text-sm">
                <CheckCircle size={18} />
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#101c29] mb-1.5">
                Seu Nome *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  errors.name ? "border-red-400" : "border-[#E2E8F0] focus:border-[#af101a]"
                }`}
                placeholder="Nome completo"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#101c29] mb-1.5">
                  Seu E-mail *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.email ? "border-red-400" : "border-[#E2E8F0] focus:border-[#af101a]"
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#101c29] mb-1.5">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#af101a] transition-colors"
                  placeholder="(13) 9 9999-9999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#101c29] mb-1.5">
                Mensagem *
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors resize-none ${
                  errors.message ? "border-red-400" : "border-[#E2E8F0] focus:border-[#af101a]"
                }`}
                placeholder="Descreva o seu condomínio e como podemos ajudá-lo..."
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-[#af101a]"
                />
                <span className="text-xs text-[#5f5e5e] leading-relaxed">
                  Concordo com a{" "}
                  <span className="text-[#af101a] underline cursor-pointer">
                    Política de Privacidade
                  </span>{" "}
                  e autorizo o contato pela Facilities.
                </span>
              </label>
              {errors.agreed && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.agreed}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-semibold transition-all hover:scale-[1.01] shadow-md shadow-red-900/20"
            >
              <Send size={16} />
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
