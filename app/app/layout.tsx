import "./system.css";
import { SystemProvider } from "../../components/system/SystemProvider";
import { SystemShell } from "../../components/system/SystemShell";
import { ProtectedApp } from "../../components/auth/ProtectedApp";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ProtectedApp><SystemProvider><SystemShell>{children}</SystemShell></SystemProvider></ProtectedApp>;
}
