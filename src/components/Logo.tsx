"use client";

interface LogoProps {
  className?: string;
  lightText?: boolean;
}

export default function Logo({ className = "", lightText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#af101a]">
        <span className="text-white font-bold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>F</span>
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className={`font-bold text-base tracking-tight ${lightText ? "text-white" : "text-[#101c29]"}`}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Facilities
        </span>
        <span className={`text-[10px] tracking-wide ${lightText ? "text-white/70" : "text-[#5f5e5e]"}`}>
          ADMINISTRAÇÃO DE CONDOMÍNIOS
        </span>
      </div>
    </div>
  );
}
