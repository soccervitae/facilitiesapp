"use client";

import { useState } from "react";
import { UserCheck, Award, Cpu, Heart, X, Check } from "lucide-react";

const diferenciais = [
  {
    icon: <UserCheck size={32} />,
    title: "Atendimento Personalizado",
    subtitle: "Gerente exclusivo por condomínio",
    desc: "Cada condomínio tem um gerente dedicado, garantindo atenção total às suas necessidades específicas.",
    details: [
      "Gerente exclusivo por condomínio",
      "Tempo de resposta: até 4 horas",
      "Reuniões mensais com o conselho",
      "Relatórios personalizados",
      "Canal direto via WhatsApp",
    ],
    highlighted: false,
  },
  {
    icon: <Award size={32} />,
    title: "Expertise Reconhecida",
    subtitle: "Liderança jurídica OAB Santos",
    desc: "Dra. Cristhiane Xavier, vice-presidente da Comissão de Direito Condominial OAB Santos, lidera nossa equipe jurídica.",
    details: [
      "Liderança da OAB Santos",
      "15+ anos de experiência",
      "Consultoria jurídica permanente",
      "Prevenção de conflitos legais",
      "Atualização contínua da legislação",
    ],
    highlighted: true,
  },
  {
    icon: <Cpu size={32} />,
    title: "Tecnologia Avançada",
    subtitle: "App exclusivo Facilities",
    desc: "Plataforma digital integrada para gestão financeira, reservas, assembleias e comunicação em tempo real.",
    details: [
      "App para iOS e Android",
      "Boletos e 2ª via online",
      "Reserva de áreas comuns",
      "Assembleias virtuais",
      "Transparência financeira diária",
    ],
    highlighted: false,
  },
  {
    icon: <Heart size={32} />,
    title: "Gestão Humanizada",
    subtitle: "Mediação e convivência",
    desc: "Promovemos a harmonia condominial através de mediação de conflitos e iniciativas de engajamento comunitário.",
    details: [
      "Mediação de conflitos",
      "Programas de convivência",
      "Suporte psicológico organizacional",
      "Resolução extrajudicial",
      "Cultura de comunidade",
    ],
    highlighted: false,
  },
];

export default function DiferenciaisSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="diferenciais" className="py-20 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#af101a] text-sm font-semibold mb-4">
            Por que escolher a Facilities?
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#101c29] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Nossos Diferenciais
          </h2>
          <p className="text-[#5f5e5e] max-w-2xl mx-auto text-lg">
            Uma combinação única de expertise jurídica, tecnologia e atendimento humanizado
            que transforma a administração do seu condomínio.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {diferenciais.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`text-left p-6 rounded-2xl transition-all duration-300 cursor-pointer border ${
                d.highlighted
                  ? "bg-[#af101a] text-white border-[#af101a] shadow-xl shadow-red-900/20"
                  : "bg-white text-[#101c29] border-transparent hover:border-[#af101a]/20 premium-card"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                  d.highlighted ? "bg-white/20" : "bg-red-50 text-[#af101a]"
                }`}
              >
                <span className={d.highlighted ? "text-white" : "text-[#af101a]"}>
                  {d.icon}
                </span>
              </div>
              <h3
                className={`font-bold text-lg mb-1 ${d.highlighted ? "text-white" : "text-[#101c29]"}`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {d.title}
              </h3>
              <p
                className={`text-sm font-medium mb-3 ${
                  d.highlighted ? "text-white/80" : "text-[#af101a]"
                }`}
              >
                {d.subtitle}
              </p>
              <p className={`text-sm leading-relaxed ${d.highlighted ? "text-white/70" : "text-[#5f5e5e]"}`}>
                {d.desc}
              </p>
              <span
                className={`inline-block mt-4 text-xs font-semibold underline ${
                  d.highlighted ? "text-white/80" : "text-[#af101a]"
                }`}
              >
                Ver detalhes →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#af101a]">
                  {diferenciais[selected].icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#101c29]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {diferenciais[selected].title}
                  </h3>
                  <p className="text-sm text-[#af101a]">{diferenciais[selected].subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-3">
              {diferenciais[selected].details.map((item, j) => (
                <li key={j} className="flex items-center gap-3 text-[#101c29]">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-green-600" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
