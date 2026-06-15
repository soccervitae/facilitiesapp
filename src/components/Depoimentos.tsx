"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Eduardo Mendes",
    role: "Síndico Residencial",
    condo: "Edifício Atlântico – Santos",
    initials: "CE",
    text: "A Facilities transformou completamente a gestão do nosso condomínio. A transparência nas prestações de contas e o suporte diário da equipe nos deram tranquilidade que nunca tínhamos tido com outras administradoras.",
    stars: 5,
  },
  {
    name: "Marina Figueiredo",
    role: "Presidente de Clube Náutico",
    condo: "Real Yacht Club – Santos",
    initials: "MF",
    text: "O suporte jurídico integrado da Facilities foi decisivo para a aprovação e execução de uma grande reforma estrutural. A expertise da Dra. Cristhiane evitou uma série de complicações legais que poderiam ter paralisado a obra.",
    stars: 5,
  },
  {
    name: "Roberto Almeida",
    role: "Condômino",
    condo: "Residencial Praia Grande",
    initials: "RA",
    text: "O aplicativo da Facilities é excelente. Acesso a boletos, atas de assembleias, extrato financeiro — tudo na palma da mão. Nunca tive acesso tão fácil à gestão do meu condomínio.",
    stars: 5,
  },
];

export default function Depoimentos() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section id="depoimentos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#af101a] text-sm font-semibold mb-4">
            Depoimentos
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#101c29] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            O que dizem nossos clientes
          </h2>
          <p className="text-[#5f5e5e] max-w-2xl mx-auto">
            A satisfação dos nossos clientes é o melhor indicador da qualidade da nossa gestão.
          </p>
        </div>

        {/* Desktop: all cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

        {/* Mobile: slider */}
        <div className="lg:hidden">
          <TestimonialCard t={testimonials[current]} />
          <div className="flex items-center justify-between mt-6 px-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#af101a] hover:text-[#af101a] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-[#5f5e5e]">
              {current + 1} de {testimonials.length}
            </span>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#af101a] hover:text-[#af101a] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="premium-card p-6 rounded-2xl border-l-4 border-[#af101a]">
      <div className="flex mb-3">
        {Array.from({ length: t.stars }).map((_, i) => (
          <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-[#5f5e5e] text-sm leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#af101a] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {t.initials}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-[#101c29] text-sm">{t.name}</p>
            <CheckCircle size={14} className="text-[#2E7D32]" />
          </div>
          <p className="text-xs text-[#5f5e5e]">{t.role}</p>
          <p className="text-xs text-[#af101a]">{t.condo}</p>
        </div>
      </div>
    </div>
  );
}
