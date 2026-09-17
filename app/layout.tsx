import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NR NEXUS | Gestão de Inspeções e Laudos NR-13",
  description: "Gestão completa de inspeções, prontuários e laudos técnicos NR-13.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
