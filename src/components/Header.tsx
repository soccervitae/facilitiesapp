"use client";

import { useState, useEffect } from "react";
import { Menu, X, FileText, LogIn } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  onSolicitarCotacao: () => void;
  onAcessarPortal: () => void;
  currentSection?: string;
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre Nós", href: "#sobre" },
  { label: "Contato", href: "#contato" },
  { label: "Blog", href: "#blog" },
  { label: "FAQ", href: "#faq" },
];

export default function Header({ onSolicitarCotacao, onAcessarPortal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["home", "servicos", "sobre", "contato", "blog", "faq"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-header shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button onClick={() => handleNavClick("#home")} className="focus:outline-none">
            <Logo lightText={!scrolled} />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-[#af101a] bg-red-50"
                    : scrolled
                    ? "text-[#101c29] hover:text-[#af101a] hover:bg-red-50"
                    : "text-white hover:text-white/80"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={onSolicitarCotacao}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#af101a] text-white text-sm font-semibold hover:bg-[#930010] transition-colors"
            >
              <FileText size={16} />
              Solicitar Cotação
            </button>
            <button
              onClick={onAcessarPortal}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                scrolled
                  ? "border-[#af101a] text-[#af101a] hover:bg-red-50"
                  : "border-white text-white hover:bg-white/10"
              }`}
            >
              <LogIn size={16} />
              Área do Condômino
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden p-2 rounded-lg ${scrolled ? "text-[#101c29]" : "text-white"}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-[#af101a] bg-red-50"
                    : "text-[#101c29] hover:bg-gray-50"
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-2">
              <button
                onClick={() => { setMenuOpen(false); onSolicitarCotacao(); }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#af101a] text-white text-sm font-semibold"
              >
                <FileText size={16} />
                Solicitar Cotação
              </button>
              <button
                onClick={() => { setMenuOpen(false); onAcessarPortal(); }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#af101a] text-[#af101a] text-sm font-semibold"
              >
                <LogIn size={16} />
                Área do Condômino
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
