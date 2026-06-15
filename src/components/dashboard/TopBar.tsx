"use client";

import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";

export default function TopBar({ title }: { title?: string }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-[#070b12] border-b border-white/5 flex items-center gap-4 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-white/60 hover:text-white"
        >
          <Menu size={22} />
        </button>

        {title && (
          <h1 className="text-white font-bold text-lg hidden sm:block" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {title}
          </h1>
        )}

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-56">
          <Search size={15} className="text-white/40" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none flex-1"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
          <Bell size={17} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#af101a] flex items-center justify-center text-white text-[9px] font-bold">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[#af101a] flex items-center justify-center text-white font-bold text-sm">
          {user?.nome?.charAt(0) || "U"}
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0">
            <div className="relative">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-3 right-3 z-10 text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
