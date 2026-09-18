import "./system.css";
import { SystemProvider } from "../../components/system/SystemProvider";
import { SystemShell } from "../../components/system/SystemShell";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SystemProvider><SystemShell>{children}</SystemShell></SystemProvider>;
}
