"use client";

import { useState } from "react";
import {
  Handshake,
  Eye,
  Headphones,
  LifeBuoy,
  Cpu,
  Heart,
} from "lucide-react";

const pillars = [
  {
    icon: <Handshake size={22} />,
    title: "Parceria",
    detail:
      "Atuamos em alinhamento integral com os objetivos da comissão e do conselho do seu condomínio, participando ativamente de todas as decisões estratégicas.",
  },
  {
    icon: <Eye size={22} />,
    title: "Transparência",
    detail:
      "Visibilidade financeira diária através do nosso aplicativo digital. Prestações de contas mensais detalhadas e acesso irrestrito a todos os documentos.",
  },
  {
    icon: <Headphones size={22} />,
    title: "Atendimento",
    detail:
      "Múltiplos canais de contato — WhatsApp, e-mail, telefone e presencial — para resolução ágil de demandas com tempo de resposta de até 4 horas.",
  },
  {
    icon: <LifeBuoy size={22} />,
    title: "Suporte",
    detail:
      "Consultoria jurídica permanente que reduz passivos trabalhistas em até 90%, com suporte completo em questões condominiais, contratuais e legais.",
  },
  {
    icon: <Cpu size={22} />,
    title: "Tecnologia",
    detail:
      "Sistemas integrados que eliminam gargalos burocráticos, automatizam cobranças, gerenciam contratos e fornecem relatórios em tempo real.",
  },
  {
    icon: <Heart size={22} />,
    title: "Convivência",
    detail:
      "Mediação proativa de conflitos e iniciativas de engajamento comunitário que promovem harmonia e sentido de pertencimento entre os moradores.",
  },
];

export default function ComoTrabalhamos() {
  const [active, setActive] = useState(0);

  return (
    <section id="metodologia" className="py-20 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#af101a] text-sm font-semibold mb-4">
            Nossa Metodologia
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#101c29] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Como Trabalhamos
          </h2>
          <p className="text-[#5f5e5e] max-w-2xl mx-auto">
            Seis pilares que sustentam uma gestão condominial de excelência.
          </p>
        </div>

        {/* Pillars row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
          {pillars.map((p, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-sm font-medium ${
                active === i
                  ? "bg-[#af101a] text-white shadow-lg scale-105"
                  : "bg-white text-[#5f5e5e] hover:bg-red-50 hover:text-[#af101a]"
              }`}
            >
              <span>{p.icon}</span>
              {p.title}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-[#af101a] flex-shrink-0">
              {pillars[active].icon}
            </div>
            <div>
              <h3
                className="text-xl font-bold text-[#101c29] mb-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {pillars[active].title}
              </h3>
              <p className="text-[#5f5e5e] leading-relaxed text-base max-w-2xl">
                {pillars[active].detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
