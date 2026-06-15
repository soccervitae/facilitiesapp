"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import {
  LayoutDashboard, Building2, Users, FileText, ScrollText,
  CalendarDays, Wrench, CreditCard, Calendar, ClipboardList,
  Package, UserCheck, LogOut, Settings, ChevronRight, Bell,
  BookOpen, BarChart2, ShieldCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { label: "Visão Geral", href: "/dashboard/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Condomínios", href: "/dashboard/admin/condominios", icon: <Building2 size={18} /> },
    { label: "Usuários", href: "/dashboard/admin/usuarios", icon: <Users size={18} /> },
    { label: "Cotações", href: "/dashboard/admin/cotacoes", icon: <FileText size={18} /> },
    { label: "Assembleias", href: "/dashboard/admin/assembleias", icon: <CalendarDays size={18} /> },
    { label: "Relatórios", href: "/dashboard/admin/relatorios", icon: <BarChart2 size={18} /> },
    { label: "Auditoria", href: "/dashboard/admin/auditoria", icon: <ShieldCheck size={18} /> },
  ],
  sindico: [
    { label: "Visão Geral", href: "/dashboard/sindico", icon: <LayoutDashboard size={18} /> },
    { label: "Moradores", href: "/dashboard/sindico/moradores", icon: <Users size={18} /> },
    { label: "Financeiro", href: "/dashboard/sindico/financeiro", icon: <CreditCard size={18} /> },
    { label: "Chamados", href: "/dashboard/sindico/chamados", icon: <Wrench size={18} /> },
    { label: "Assembleias", href: "/dashboard/sindico/assembleias", icon: <CalendarDays size={18} /> },
    { label: "Avisos", href: "/dashboard/sindico/avisos", icon: <Bell size={18} /> },
    { label: "Documentos", href: "/dashboard/sindico/documentos", icon: <ScrollText size={18} /> },
  ],
  morador: [
    { label: "Início", href: "/dashboard/morador", icon: <LayoutDashboard size={18} /> },
    { label: "Boletos", href: "/dashboard/morador/boletos", icon: <CreditCard size={18} /> },
    { label: "Reservas", href: "/dashboard/morador/reservas", icon: <Calendar size={18} /> },
    { label: "Chamados", href: "/dashboard/morador/chamados", icon: <ClipboardList size={18} /> },
    { label: "Assembleias", href: "/dashboard/morador/assembleias", icon: <CalendarDays size={18} /> },
    { label: "Avisos", href: "/dashboard/morador/avisos", icon: <Bell size={18} /> },
  ],
  colaborador: [
    { label: "Visão Geral", href: "/dashboard/colaborador", icon: <LayoutDashboard size={18} /> },
    { label: "Tarefas", href: "/dashboard/colaborador/tarefas", icon: <ClipboardList size={18} /> },
    { label: "Chamados", href: "/dashboard/colaborador/chamados", icon: <Wrench size={18} /> },
    { label: "Documentos", href: "/dashboard/colaborador/documentos", icon: <BookOpen size={18} /> },
  ],
  porteiro: [
    { label: "Portaria", href: "/dashboard/porteiro", icon: <LayoutDashboard size={18} /> },
    { label: "Visitantes", href: "/dashboard/porteiro/visitantes", icon: <UserCheck size={18} /> },
    { label: "Encomendas", href: "/dashboard/porteiro/encomendas", icon: <Package size={18} /> },
    { label: "Moradores", href: "/dashboard/porteiro/moradores", icon: <Users size={18} /> },
  ],
};

const roleLabel: Record<string, { label: string; color: string }> = {
  admin: { label: "Administrador", color: "bg-purple-600" },
  administrador: { label: "Administrador", color: "bg-purple-600" },
  sindico: { label: "Síndico", color: "bg-blue-600" },
  morador: { label: "Morador", color: "bg-green-600" },
  colaborador: { label: "Colaborador", color: "bg-amber-600" },
  porteiro: { label: "Porteiro", color: "bg-teal-600" },
};

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const rawRole = user?.tipo || "morador";
  const role = rawRole === "administrador" ? "admin" : rawRole;
  const navItems = navByRole[role] || navByRole.morador;
  const roleMeta = roleLabel[rawRole] || { label: rawRole, color: "bg-gray-600" };

  const handleLogout = () => {
    logout();
    router.push("/portal/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#061426] flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/" onClick={onClose}>
          <Logo lightText />
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#af101a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.nome?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.nome || "Usuário"}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-white text-[10px] font-bold mt-0.5 ${roleMeta.color}`}>
              {roleMeta.label}
            </span>
          </div>
        </div>
        {user?.unidade && (
          <p className="text-white/40 text-xs mt-2 truncate">{user.unidade}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-[#af101a] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-white/40 group-hover:text-white"}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={18} className="text-white/40" />
          Configurações
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
