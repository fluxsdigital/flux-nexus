"use client";
import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { useAuth } from "@/components/auth/AuthProvider";

function ResetPasswordForm() {
  const { request } = useAuth();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(params.get("token") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function requestReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setMessage("");
    try { const result = await request<{ message: string; resetToken?: string }>("/auth/password-reset/request", { method: "POST", body: JSON.stringify({ email }) }); setToken(result.resetToken || ""); setMessage(result.resetToken ? "Token de teste gerado. Defina sua nova senha abaixo." : result.message); }
    catch (x) { setError(x instanceof Error ? x.message : "Falha ao solicitar redefinição"); }
  }
  async function confirmReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setMessage(""); const form = new FormData(e.currentTarget);
    try { await request("/auth/password-reset/confirm", { method: "POST", body: JSON.stringify({ token, password: form.get("password") }) }); setMessage("Senha redefinida. Você já pode fazer login."); }
    catch (x) { setError(x instanceof Error ? x.message : "Falha ao redefinir senha"); }
  }
  return <AuthFrame title="Redefinir senha" subtitle="Solicite um token e escolha uma nova senha." footer={<Link href="/login">Voltar para o login</Link>}><form className="authForm" onSubmit={requestReset}><label>E-mail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label><button className="secondaryBtn">Gerar token</button></form>{token&&<form className="authForm" onSubmit={confirmReset}><label>Token<input required value={token} onChange={e=>setToken(e.target.value)} /></label><label>Nova senha<input required minLength={10} type="password" name="password" /></label><button className="primary">Redefinir senha</button></form>}{message&&<p className="authSuccess">{message}</p>}{error&&<p className="formError">{error}</p>}</AuthFrame>;
}

export default function ResetPassword() { return <Suspense fallback={<main className="authScreen"><div className="authLoading">Carregando…</div></main>}><ResetPasswordForm /></Suspense>; }