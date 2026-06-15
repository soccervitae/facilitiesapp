"use client";

import { MapPin, ChevronRight, Waves, Users, Shield } from "lucide-react";

const cities = [
  { name: "Santos", neighborhoods: "Gonzaga, Boqueirão, Embaré, Encruzilhada, Pompéia, Ponta da Praia" },
  { name: "São Vicente", neighborhoods: "Centro, Itararé, Japuí, Parque Bitaru, Vila Valença" },
  { name: "Praia Grande", neighborhoods: "Guilhermina, Aviação, Canto do Forte, Boqueirão, Tupi" },
  { name: "Guarujá", neighborhoods: "Enseada, Pitangueiras, Astúrias, Pernambuco, Santa Cruz" },
  { name: "Cubatão", neighborhoods: "Centro, Vila Nova, Jardim Casqueiro, Vila Esperança" },
  { name: "Mongaguá", neighborhoods: "Vera Cruz, Agenor de Campos, Balneário Flórida" },
  { name: "Itanhaém", neighborhoods: "Centro, Jardim Savoy, Balneário Gaivota, Belas Artes" },
];

const challenges = [
  {
    icon: <Waves size={20} />,
    title: "Maresia e Corrosão",
    desc: "Protocolos preventivos específicos para a agressividade do ambiente litorâneo.",
  },
  {
    icon: <Users size={20} />,
    title: "Sazonalidade Turística",
    desc: "Gestão de alta temporada com reforço de equipes e controle de acesso.",
  },
  {
    icon: <Shield size={20} />,
    title: "Segurança Costeira",
    desc: "Sistemas integrados adaptados às características dos condomínios de praia.",
  },
];

export default function AreasAtendidas() {
  return (
    <section id="areas" className="py-20 bg-[#f8f9ff] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#af101a] text-sm font-semibold mb-4">
            Onde Atuamos
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#101c29] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Áreas Atendidas
          </h2>
          <p className="text-[#5f5e5e] max-w-2xl mx-auto">
            Cobertura completa em toda a Baixada Santista, com expertise nas
            particularidades de cada município litorâneo.
          </p>
        </div>

        {/* Challenges */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {challenges.map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-5 flex items-start gap-4 border border-[#E2E8F0]">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#af101a] flex-shrink-0">
                {c.icon}
              </div>
              <div>
                <p className="font-semibold text-[#101c29] text-sm mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {c.title}
                </p>
                <p className="text-[#5f5e5e] text-xs leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* City grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cities.map((city, i) => (
            <div
              key={i}
              className="premium-card p-5 rounded-2xl group cursor-pointer border border-transparent hover:border-[#af101a]/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-[#af101a]" />
                <h3
                  className="font-bold text-[#101c29]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {city.name}
                </h3>
              </div>
              <p className="text-[#5f5e5e] text-xs leading-relaxed mb-3">{city.neighborhoods}</p>
              <button className="flex items-center gap-1 text-[#af101a] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Ver Soluções Locais <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
