"use client";

import { ArrowUp, Share2, Link, Rss } from "lucide-react";
import Logo from "./Logo";

const services = [
  "Administração de Condomínios",
  "Gestão Financeira",
  "Síndico Profissional",
  "Assessoria Jurídica",
  "Gestão de Inadimplência",
  "Serviços de RH",
  "Contabilidade Condominial",
];

const areas = [
  "Santos", "São Vicente", "Praia Grande", "Guarujá",
  "Cubatão", "Mongaguá", "Itanhaém",
];

const resources = ["Blog", "FAQ", "Política de Privacidade", "Termos de Uso"];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer className="bg-[#101c29] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 */}
          <div className="lg:col-span-1">
            <Logo lightText />
            <p className="text-white/60 text-sm leading-relaxed mt-4 mb-6">
              Administração de condomínios com excelência jurídica, proximidade humana e
              transparência absoluta em Santos e toda a Baixada Santista.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Share2 size={18} />, label: "Instagram" },
                { icon: <Rss size={18} />, label: "Facebook" },
                { icon: <Link size={18} />, label: "LinkedIn" },
              ].map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#af101a] transition-colors"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wide uppercase text-white/80" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Serviços
            </h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => scrollToSection("servicos")}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wide uppercase text-white/80" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Áreas de Atuação
            </h4>
            <ul className="space-y-2">
              {areas.map((a) => (
                <li key={a}>
                  <button
                    onClick={() => scrollToSection("areas")}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {a}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wide uppercase text-white/80" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Recursos &amp; Acesso
            </h4>
            <ul className="space-y-2 mb-6">
              {resources.map((r) => (
                <li key={r}>
                  <button className="text-white/60 hover:text-white text-sm transition-colors">
                    {r}
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection("contato")}
                className="w-full px-4 py-2.5 rounded-lg bg-[#af101a] hover:bg-[#930010] text-white text-sm font-semibold transition-colors"
              >
                Painel Administrativo
              </button>
              <button
                onClick={() => scrollToSection("contato")}
                className="w-full px-4 py-2.5 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 text-sm font-medium transition-colors"
              >
                Portal do Condômino
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Facilities Administração de Condomínios. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-[#af101a] transition-colors"
            aria-label="Voltar ao topo"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
