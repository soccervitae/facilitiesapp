"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";

const ROLES = ["Morador", "Proprietário", "Síndico", "Conselheiro", "Colaborador"];

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", unidade: "", perfil: "Morador", senha: "", confirmar: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.senha !== form.confirmar) return setError("As senhas não coincidem.");
    if (form.senha.length < 3) return setError("Senha deve ter pelo menos 3 caracteres.");

    setLoading(true);
    try {
      const stored = localStorage.getItem("facilities_portal_users");
      let users: any[] = [];
      try { if (stored) users = JSON.parse(stored); } catch { /* ignore */ }

      const tipo = form.perfil.toLowerCase().replace("proprietário", "proprietario").replace("síndico", "sindico");
      const newUser = { cpf: form.cpf.replace(/\D/g, ""), email: form.email, pass: form.senha, name: form.nome, unit: form.unidade, profile: form.perfil, tipo };
      users.push(newUser);
      localStorage.setItem("facilities_portal_users", JSON.stringify(users));

      await login(form.cpf || form.email, form.senha);
      const saved = localStorage.getItem("facilities_session");
      if (saved) {
        const profile = JSON.parse(saved);
        const role = profile.tipo === "administrador" ? "admin" : profile.tipo;
        router.push(`/dashboard/${role}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] flex items-center justify-center p-4 py-10">
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/"><Logo lightText /></Link>
          <Link href="/portal/login" className="text-white/40 hover:text-white text-xs transition-colors">← Já tenho conta</Link>
        </div>

        <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-[#101c29] to-[#1a2f47] p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#af101a]/20 flex items-center justify-center">
                <UserPlus size={20} className="text-[#af101a]" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>Criar Conta</h1>
                <p className="text-white/50 text-sm">Cadastro no Portal Facilities</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
                <AlertCircle size={16} />{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Nome Completo *</label>
                  <input required type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30"
                    placeholder="Seu nome completo" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">CPF *</label>
                  <input required type="text" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30"
                    placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Unidade</label>
                  <input type="text" value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30"
                    placeholder="Apto 42-A" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-white/70 mb-1.5">E-mail *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30"
                    placeholder="seu@email.com" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Perfil</label>
                  <select value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#101c29] border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a]">
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Senha *</label>
                  <div className="relative">
                    <input required type={showPass ? "text" : "password"} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })}
                      className="w-full px-3 py-2.5 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Confirmar *</label>
                  <input required type="password" value={form.confirmar} onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30"
                    placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-semibold text-sm transition-all disabled:opacity-60 mt-2">
                {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={16} />}
                {loading ? "Cadastrando..." : "Criar Conta"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
