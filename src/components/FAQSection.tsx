"use client";

import { useState, useMemo } from "react";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    category: "Administração",
    q: "O que inclui o serviço de administração de condomínio?",
    a: "Nossa administração inclui gestão financeira completa, controle de inadimplência, convocação e condução de assembleias, gestão de funcionários, suporte jurídico permanente, relatórios mensais e acesso ao app Facilities.",
  },
  {
    category: "Financeiro",
    q: "Como funciona a prestação de contas?",
    a: "Realizamos prestação de contas mensais detalhadas com extrato completo de receitas e despesas, disponíveis no aplicativo Facilities em tempo real para síndico, conselheiros e moradores com permissão.",
  },
  {
    category: "Jurídico",
    q: "Como a Facilities lida com a inadimplência?",
    a: "Utilizamos metodologia exclusiva de cobrança extrajudicial com notificações escalonadas, negociação assistida e, quando necessário, encaminhamento judicial. Reduzimos a inadimplência em até 45% em 12 meses.",
  },
  {
    category: "Tecnologia",
    q: "O que é o aplicativo Facilities?",
    a: "É nossa plataforma digital exclusiva disponível para iOS e Android. Permite acesso a boletos, 2ª via, reserva de áreas comuns, atas de assembleias, comunicados, extrato financeiro e canal direto com a administração.",
  },
  {
    category: "Síndico",
    q: "O síndico continua sendo responsável pelo condomínio?",
    a: "Sim. O síndico mantém todas as responsabilidades legais. A Facilities atua como gestora profissional, fornecendo suporte especializado para que o síndico tome as melhores decisões com toda a informação necessária.",
  },
  {
    category: "Contrato",
    q: "Qual é o prazo mínimo de contrato?",
    a: "Nossos contratos têm prazo de 12 meses, com renovação automática. Acreditamos que resultados consistentes exigem tempo de maturação, mas garantimos a qualidade do serviço desde o primeiro mês.",
  },
  {
    category: "Administração",
    q: "Como é feita a migração de outra administradora?",
    a: "Nosso processo de onboarding é estruturado e acompanhado. Cuidamos de toda a transferência de documentos, histórico financeiro, contratos e registros, minimizando qualquer impacto no dia a dia do condomínio.",
  },
  {
    category: "Financeiro",
    q: "Como são cobrados os honorários de administração?",
    a: "Nossos honorários são percentuais sobre a receita condominial, com valores competitivos que variam de acordo com o porte e complexidade do condomínio. Solicite uma cotação personalizada.",
  },
];

const categories = ["Todos", ...Array.from(new Set(faqs.map((f) => f.category)))];

export default function FAQSection() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchCat = category === "Todos" || f.category === category;
      const matchSearch =
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <section id="faq" className="py-20 bg-[#f8f9ff]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#af101a] text-sm font-semibold mb-4">
            Dúvidas Frequentes
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#101c29] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            FAQ
          </h2>
          <p className="text-[#5f5e5e] max-w-xl mx-auto">
            Respostas para as principais dúvidas sobre administração condominial.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5f5e5e]" />
          <input
            type="text"
            placeholder="Pesquisar por palavras-chave (ex: síndico, inadimplência, boletos)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#101c29] focus:outline-none focus:border-[#af101a] transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-[#af101a] text-white"
                  : "bg-white text-[#5f5e5e] border border-[#E2E8F0] hover:border-[#af101a]/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#5f5e5e]">
              Nenhuma pergunta encontrada para sua busca.
            </div>
          ) : (
            filtered.map((f, i) => (
              <button
                key={i}
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full text-left rounded-xl border transition-all overflow-hidden ${
                  open === i
                    ? "border-[#af101a] bg-white shadow-sm"
                    : "border-[#E2E8F0] bg-white hover:border-[#af101a]/30"
                }`}
              >
                <div className="flex items-center gap-3 p-5">
                  <HelpCircle
                    size={18}
                    className={open === i ? "text-[#af101a]" : "text-[#5f5e5e]"}
                  />
                  <span
                    className={`flex-1 font-medium text-sm ${
                      open === i ? "text-[#af101a]" : "text-[#101c29]"
                    }`}
                  >
                    {f.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#5f5e5e] transition-transform flex-shrink-0 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {open === i && (
                  <div className="px-5 pb-5 text-sm text-[#5f5e5e] leading-relaxed border-t border-[#af101a]/10 pt-4">
                    {f.a}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        <p className="text-center text-xs text-[#5f5e5e] mt-6">
          Mostrando {filtered.length} de {faqs.length} perguntas
        </p>
      </div>
    </section>
  );
}
