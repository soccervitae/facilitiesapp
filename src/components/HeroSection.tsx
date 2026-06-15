"use client";

import { FileText, Play, Shield, Star, Users } from "lucide-react";

interface HeroSectionProps {
  onSolicitarCotacao: () => void;
}

export default function HeroSection({ onSolicitarCotacao }: HeroSectionProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #101c29 0%, #1a2f47 50%, #0d1e30 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "#af101a" }}
        />
        <div
          className="absolute bottom-20 -left-20 w-64 h-64 rounded-full opacity-5"
          style={{ background: "#af101a" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 border border-white"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium mb-6">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span>Referência em Santos e Baixada Santista</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Administração de
              <span className="block text-[#af101a]">Condomínios</span>
              com Excelência
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-4 max-w-lg">
              Sob a liderança da{" "}
              <strong className="text-white">Dra. Cristhiane Xavier</strong>,
              vice-presidente da Comissão de Direito Condominial da OAB Santos,
              oferecemos gestão com excelência jurídica, proximidade humana e
              transparência absoluta.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {["Gestão Transparente", "Suporte Jurídico", "App Exclusivo"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onSolicitarCotacao}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-red-900/30"
              >
                <FileText size={18} />
                Solicitar Cotação Gratuita
              </button>
              <button
                onClick={() => scrollToSection("sobre")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10 font-semibold transition-all"
              >
                <Play size={16} className="fill-white" />
                Conheça a Facilities
              </button>
            </div>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: <Shield size={28} className="text-[#af101a]" />,
                value: "15+",
                label: "Anos de Experiência",
                desc: "Sólida trajetória no mercado condominial",
              },
              {
                icon: <Users size={28} className="text-[#af101a]" />,
                value: "200+",
                label: "Condomínios Gerenciados",
                desc: "Residenciais e comerciais",
              },
              {
                icon: <Star size={28} className="text-yellow-400 fill-yellow-400" />,
                value: "45%",
                label: "Redução de Inadimplência",
                desc: "Em até 12 meses de gestão",
              },
              {
                icon: (
                  <span className="text-2xl font-bold text-[#af101a]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    20%
                  </span>
                ),
                value: "",
                label: "Economia nas Despesas",
                desc: "Otimização de contratos coletivos",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="premium-card p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div className="mb-3">{stat.icon}</div>
                {stat.value && (
                  <div
                    className="text-3xl font-bold text-white mb-1"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {stat.value}
                  </div>
                )}
                <div className="text-white font-semibold text-sm mb-1">{stat.label}</div>
                <div className="text-white/50 text-xs">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm">
          {[
            "OAB Santos",
            "SECOVI-SP",
            "AABIC",
            "ISO 9001",
            "LGPD Compliance",
          ].map((cert) => (
            <span key={cert} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#af101a]" />
              {cert}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
