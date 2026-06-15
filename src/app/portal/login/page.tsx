"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { LogIn, Eye, EyeOff, AlertCircle, Lock, User } from "lucide-react";
import Link from "next/link";

const DEMO_ACCOUNTS = [
  { label: "Administrador", cpf: "456", pass: "456", color: "bg-purple-600" },
  { label: "Síndico", cpf: "789", pass: "789", color: "bg-blue-600" },
  { label: "Morador", cpf: "123", pass: "123", color: "bg-green-600" },
  { label: "Porteiro", cpf: "102", pass: "102", color: "bg-amber-600" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(credential, password);
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

  const handleDemo = async (cpf: string, pass: string) => {
    setCredential(cpf);
    setPassword(pass);
    setError("");
    setLoading(true);
    try {
      await login(cpf, pass);
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
    <div className="min-h-screen bg-[#070b12] flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#af101a] opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#af101a] opacity-5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to site */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo lightText />
          </Link>
          <Link href="/" className="text-white/40 hover:text-white text-xs transition-colors">
            ← Voltar ao site
          </Link>
        </div>

        <div className="bg-[#101c29] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#af101a] to-[#d32f2f] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Lock size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Portal do Condômino
                </h1>
                <p className="text-white/70 text-sm">Acesse com CPF ou e-mail</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Demo accounts */}
            <div className="mb-6">
              <p className="text-white/40 text-xs mb-2 font-medium tracking-wide uppercase">Acesso rápido — contas demo</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.label}
                    onClick={() => handleDemo(acc.cpf, acc.pass)}
                    className={`${acc.color} hover:opacity-90 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center gap-2`}
                  >
                    <User size={12} />
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/30 text-xs">ou entre manualmente</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">CPF ou E-mail</label>
                <input
                  type="text"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30 transition-colors"
                  placeholder="123.456.789-00 ou email@exemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#af101a] placeholder:text-white/30 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#af101a] hover:bg-[#930010] text-white font-semibold text-sm transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn size={16} />
                )}
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/portal/register" className="text-[#af101a] hover:text-red-400 text-xs transition-colors">
                Não tem conta? Cadastre-se
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-4">
          Facilities © {new Date().getFullYear()} — Sistema seguro com criptografia de dados
        </p>
      </div>
    </div>
  );
}
