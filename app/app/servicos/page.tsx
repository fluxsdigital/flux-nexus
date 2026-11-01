"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../components/auth/AuthProvider";
import { Icon } from "../../../components/Icon";

type Service = { id:string; name:string; description:string|null; defaultPriceCents:number; status:"ACTIVE"|"INACTIVE" };

const money = new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" });
const format = (cents:number) => money.format(cents / 100);
const price = (value:string) => { const parsed = Number(value.trim().replace(/\./g, "").replace(",", ".")); return Number.isFinite(parsed) ? Math.round(parsed * 100) : NaN; };
const priceInput = (cents:number) => (cents / 100).toFixed(2).replace(".", ",");

export default function ServicesPage() {
  const { request } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<string|null>(null);
  const [serviceForm, setServiceForm] = useState({ name:"", description:"", price:"" });
  const [error, setError] = useState("");

  const load = useCallback(async () => setServices(await request<Service[]>("/services")), [request]);
  useEffect(() => { void request<Service[]>("/services").then(setServices).catch(cause => setError(cause instanceof Error ? cause.message : "Falha ao carregar serviços.")); }, [request]);

  function startService(item?:Service) { setError(""); setEditingService(item?.id ?? null); setServiceForm(item ? { name:item.name, description:item.description ?? "", price:priceInput(item.defaultPriceCents) } : { name:"", description:"", price:"" }); setServiceOpen(true); }
  async function saveService(event:FormEvent) { event.preventDefault(); const cents = price(serviceForm.price); if (!Number.isSafeInteger(cents) || cents < 0) return setError("Informe um valor válido em reais."); try { await request(editingService ? `/services/${editingService}` : "/services", { method:editingService ? "PATCH" : "POST", body:JSON.stringify({ name:serviceForm.name, description:serviceForm.description || undefined, defaultPriceCents:cents }) }); setServiceOpen(false); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível salvar o serviço."); } }
  async function toggleService(item:Service) { try { await request(`/services/${item.id}`, { method:"PATCH", body:JSON.stringify({ status:item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }) }); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível alterar o serviço."); } }

  return <>
    <div className="pageHead"><div><small>COMERCIAL</small><h1>Serviços</h1><p>Cadastre e gerencie o catálogo usado na elaboração dos orçamentos.</p></div><button className="primary" onClick={() => startService()}><Icon name="plus"/>Novo serviço</button></div>
    {error && <p className="formError">{error}</p>}
    <section className="panel budgetSection"><div className="panelHead"><div><h2>Catálogo de serviços</h2><p>Alterações no catálogo não modificam orçamentos já criados.</p></div></div><div className="cardsList">{services.map(item => <article key={item.id}><div className="grow"><h3>{item.name}</h3><p>{item.description || "Sem descrição"}</p></div><b>{format(item.defaultPriceCents)}</b><span className={`badge ${item.status === "ACTIVE" ? "green" : "red"}`}>{item.status === "ACTIVE" ? "Ativo" : "Inativo"}</span><span className="rowActions"><button className="secondaryBtn" onClick={() => startService(item)}>Editar</button><button className="secondaryBtn" onClick={() => toggleService(item)}>{item.status === "ACTIVE" ? "Inativar" : "Ativar"}</button></span></article>)}</div></section>
    {serviceOpen && <div className="modal" onMouseDown={() => setServiceOpen(false)}><form className="dialog" onSubmit={saveService} onMouseDown={event => event.stopPropagation()}><div className="panelHead"><h2>{editingService ? "Editar serviço" : "Novo serviço"}</h2><button type="button" className="close" onClick={() => setServiceOpen(false)}>×</button></div><label>Nome<input required minLength={2} maxLength={120} value={serviceForm.name} onChange={event => setServiceForm({ ...serviceForm, name:event.target.value })}/></label><label>Descrição<textarea maxLength={1000} value={serviceForm.description} onChange={event => setServiceForm({ ...serviceForm, description:event.target.value })}/></label><label>Valor padrão (R$)<input required inputMode="decimal" placeholder="0,00" value={serviceForm.price} onChange={event => setServiceForm({ ...serviceForm, price:event.target.value })}/></label><button className="primary">Salvar serviço</button></form></div>}
  </>;
}
