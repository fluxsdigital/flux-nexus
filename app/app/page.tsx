"use client";
import Link from "next/link";
import { Icon } from "../../components/Icon";
import { useSystem } from "../../components/system/SystemProvider";

export default function Dashboard(){
  const {companies,equipment,inspections,companyFilter}=useSystem();
  const ids=new Set(equipment.filter(e=>companyFilter==="all"||e.companyId===companyFilter).map(e=>e.id));
  const eq=equipment.filter(e=>ids.has(e.id)); const ins=inspections.filter(i=>ids.has(i.equipmentId));
  const cards=[["clipboard",ins.filter(i=>i.status==="Pendente").length,"Inspeções pendentes","orange"],["check",ins.filter(i=>i.status==="Concluída").length,"Concluídas","cyan"],["equipment",eq.length,"Equipamentos",""] ,["file",ins.filter(i=>i.status==="Concluída").length,"Laudos emitidos",""]] as const;
  return <><div className="pageHead"><div><small>VISÃO GERAL</small><h1>Olá, João.</h1><p>Veja rapidamente o que precisa da sua atenção.</p></div><Link className="primary" href="/app/inspecao"><Icon name="plus"/>Nova inspeção</Link></div><div className="metricGrid">{cards.map(([icon,n,label,color])=><div className={`metric ${color}`} key={label}><Icon name={icon}/><strong>{n}</strong><span>{label}</span></div>)}</div><section className="panel"><div className="panelHead"><div><h2>Próximas inspeções</h2><p>Prioridades do período</p></div><Link href="/app/inspecao">Iniciar inspeção <Icon name="arrow"/></Link></div><div className="simpleList">{eq.filter(e=>e.status!=="Em dia").map(e=><div key={e.id}><span className={e.status==="Vencido"?"dot danger":"dot"}/><div><b>{e.tag} · {e.name}</b><small>{companies.find(c=>c.id===e.companyId)?.name}</small></div><span className="date">{e.next}</span><span className={`badge ${e.status==="Vencido"?"red":"amber"}`}>{e.status}</span></div>)}</div></section></>;
}
