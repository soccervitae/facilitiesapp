import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Facilities - Administração de Condomínios | Santos e Baixada Santista",
  description:
    "Administração de condomínios com excelência jurídica, proximidade humana e transparência absoluta. Atendemos Santos, São Vicente, Praia Grande, Guarujá e toda a Baixada Santista.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
