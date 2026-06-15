"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Scale,
  Smartphone,
  UserPlus,
  BarChart2,
  ClipboardList,
  Users,
  Shield,
  ChevronRight,
} from "lucide-react";

const individualServices = [
  {
    icon: <AlertTriangle size={22} />,
    title: "Gestão de Inadimplência",
    desc: "Acompanhamento individualizado de devedores com notificações extrajudiciais e negociação assistida.",
    slug: "gestao-inadimplencia",
  },
  {
    icon: <Scale size={22} />,
    title: "Expertise Jurídica",
    desc: "Consultoria jurídica permanente em direito condominial, prevenção de litígios e suporte em assembleias.",
    slug: "expertise-juridica",
  },
  {
    icon: <Smartphone size={22} />,
    title: "Sistema Facilities",
    desc: "App exclusivo com acesso a boletos, reservas, atas, financeiro e comunicação em tempo real.",
    slug: "sistema-facilities",
  },
  {
    icon: <UserPlus size={22} />,
    title: "RH e Recrutamento",
    desc: "Seleção e gestão de funcionários do condomínio com suporte em folha de pagamento e eSocial.",
    slug: "rh-recrutamento",
  },
];

const collectiveServices = [
  {
    icon: <BarChart2 size={22} />,
    title: "Gestão Financeira",
    desc: "Prestação de contas mensais, controle de inadimplência coletiva e planejamento orçamentário anual.",
    slug: "gestao-financeira",
  },
  {
    icon: <ClipboardList size={22} />,
    title: "Vistorias Periódicas",
    desc: "Inspeções regulares das áreas comuns com relatórios técnicos e recomendações de manutenção preventiva.",
    slug: "vistorias-periodicas",
  },
  {
    icon: <Users size={22} />,
    title: "Assembleias",
    desc: "Organização e condução de assembleias ordinárias e extraordinárias, presenciais e virtuais.",
    slug: "assembleias",
  },
  {
    icon: <Shield size={22} />,
    title: "Suporte Jurídico Coletivo",
    desc: "Assessoria em contratos com fornecedores, seguros obrigatórios e conformidade com a LGPD.",
    slug: "suporte-juridico-coletivo",
  },
];

export default function ServicesSection() {
  const [tab, setTab] = useState<"individual" | "coletivo">("individual");
  const services = tab === "individual" ? individualServices : collectiveServices;

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-[#af101a] text-sm font-semibold mb-4">
            O que oferecemos
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#101c29] mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Nossos Serviços
          </h2>
          <p className="text-[#5f5e5e] max-w-2xl mx-auto">
            Soluções completas para a administração condominial, do atendimento individual
            ao suporte coletivo do seu condomínio.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab sidebar */}
          <div className="flex lg:flex-col gap-2 lg:w-56 flex-shrink-0">
            <button
              onClick={() => setTab("individual")}
              className={`px-5 py-3.5 rounded-xl text-sm font-semibold text-left transition-all ${
                tab === "individual"
                  ? "bg-[#af101a] text-white shadow-md"
                  : "bg-gray-50 text-[#5f5e5e] hover:bg-gray-100"
              }`}
            >
              Serviços Individuais
            </button>
            <button
              onClick={() => setTab("coletivo")}
              className={`px-5 py-3.5 rounded-xl text-sm font-semibold text-left transition-all ${
                tab === "coletivo"
                  ? "bg-[#af101a] text-white shadow-md"
                  : "bg-gray-50 text-[#5f5e5e] hover:bg-gray-100"
              }`}
            >
              Serviços Coletivos
            </button>
          </div>

          {/* Service cards */}
          <div className="grid sm:grid-cols-2 gap-4 flex-1">
            {services.map((s, i) => (
              <div
                key={i}
                className="group premium-card p-6 rounded-2xl border border-transparent hover:border-[#af101a]/20 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-[#af101a] flex-shrink-0 group-hover:bg-[#af101a] group-hover:text-white transition-colors">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-[#101c29] mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-[#5f5e5e] text-sm leading-relaxed">{s.desc}</p>
                    <button className="flex items-center gap-1 mt-3 text-[#af101a] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Saiba mais <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
