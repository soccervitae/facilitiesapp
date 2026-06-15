"use client";

import { useState } from "react";
import { Scale, MessageSquare, Zap, TrendingDown, BarChart2, Clock, ChevronDown } from "lucide-react";

const metrics = [
  {
    icon: <TrendingDown size={20} />,
    value: "45%",
    label: "Redução de inadimplência em 12 meses",
    detail: "Metodologia exclusiva de negociação e cobrança extrajudicial com índice de recuperação acima da média do mercado.",
  },
  {
    icon: <BarChart2 size={20} />,
    value: "20%",
    label: "Otimização de despesas coletivas",
    detail: "Contratos coletivos com fornecedores homologados e poder de negociação ampliado pela escala da nossa carteira.",
  },
  {
    icon: <Clock size={20} />,
    value: "15+",
    label: "Anos de atuação contínua no mercado",
    detail: "Trajetória consolidada desde 2009, com crescimento consistente e retenção de clientes acima de 95%.",
  },
];

const pillars = [
  {
    icon: <Scale size={22} />,
    title: "Segurança Jurídica",
    desc: "Liderada pela Dra. Cristhiane Xavier, nossa equipe oferece consultoria técnica contínua para evitar multas, notificações e sanções contenciosas.",
  },
  {
    icon: <MessageSquare size={22} />,
    title: "Resolução de Conflitos",
    desc: "Métodos ativos de conciliação que abordam perturbações e mantêm a harmonia interna sem necessidade de litígios.",
  },
  {
    icon: <Zap size={22} />,
    title: "Eficiência Operacional",
    desc: "Sistemas qualificados e fornecedores realizando inspeções preventivas para reduzir despesas de manutenção extraordinária.",
  },
];

export default function SobreNos() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="sobre" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#af101a] text-sm font-semibold mb-4">
              Sobre a Facilities
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#101c29] mb-6 leading-tight"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              15 anos transformando a gestão condominial na Baixada Santista
            </h2>
            <p className="text-[#5f5e5e] text-lg leading-relaxed mb-6">
              A Facilities nasceu da visão de que administração condominial exige muito mais do que controle
              financeiro — exige conhecimento jurídico profundo, tecnologia de ponta e, acima de tudo,
              conexão humana genuína com cada comunidade que atendemos.
            </p>
            <p className="text-[#5f5e5e] leading-relaxed mb-8">
              Com expertise em direito condominial e tecnologia proprietária, entregamos uma gestão
              transparente que protege o patrimônio dos condôminos e promove a harmonia da convivência.
            </p>

            {/* Metric cards */}
            <div className="space-y-3">
              {metrics.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full text-left bg-[#f8f9ff] border border-[#E2E8F0] rounded-xl p-4 hover:border-[#af101a]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#af101a] flex-shrink-0">
                      {m.icon}
                    </div>
                    <div className="flex-1">
                      <span className="text-xl font-bold text-[#af101a]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        {m.value}
                      </span>
                      <span className="text-sm text-[#5f5e5e] ml-2">{m.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-[#5f5e5e] transition-transform ${expanded === i ? "rotate-180" : ""}`}
                    />
                  </div>
                  {expanded === i && (
                    <p className="mt-3 text-sm text-[#5f5e5e] leading-relaxed pl-13">
                      {m.detail}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right — pillars */}
          <div className="space-y-6">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="premium-card p-6 rounded-2xl flex gap-5 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-[#af101a] flex items-center justify-center text-white flex-shrink-0">
                  {p.icon}
                </div>
                <div>
                  <h3
                    className="font-bold text-[#101c29] mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-[#5f5e5e] text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}

            {/* Highlight box */}
            <div className="bg-gradient-to-r from-[#af101a] to-[#d32f2f] rounded-2xl p-6 text-white">
              <p className="font-semibold mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Dra. Cristhiane Xavier
              </p>
              <p className="text-white/80 text-sm">
                Vice-presidente da Comissão de Direito Condominial da OAB Santos —
                garantindo excelência jurídica em cada decisão da sua administração.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
