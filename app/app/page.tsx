"use client";
import Link from "next/link";
import { Icon } from "../../components/Icon";
import { useAuth } from "../../components/auth/AuthProvider";
import { useSystem } from "../../components/system/SystemProvider";

export default function Dashboard(){
  const {companies,equipment,inspections,reports,companyFilter}=useSystem();
  const ids=new Set(equipment.filter(e=>companyFilter==="all"||e.companyId===companyFilter).map(e=>e.id));
  const eq=equipment.filter(e=>ids.has(e.id)); const ins=inspections.filter(i=>ids.has(i.equipmentId));
  const pending=ins.filter(i=>i.status==="Pendente"||i.status==="Em andamento");
  const readyReports=reports.filter(r=>r.status==="DRAFT"||r.status==="IN_REVIEW");
  const issuedReports=reports;
  const cards=[["clipboard",pending.length,"Inspeções pendentes","orange"],["check",ins.filter(i=>i.status==="Concluída").length,"Concluídas","cyan"],["equipment",eq.length,"Equipamentos",""] ,["file",issuedReports.length,"Laudos emitidos",""]] as const;
  const {user}=useAuth();
  return <><div className="pageHead"><div><small>VISÃO GERAL</small><h1>Olá, {user?.name?.split(" ")[0]??""}.</h1><p>Veja rapidamente o que precisa da sua atenção.</p></div><Link className="primary" href="/app/inspecao"><Icon name="plus"/>Nova inspeção</Link></div><div className="metricGrid">{cards.map(([icon,n,label,color])=><div className={`metric ${color}`} key={label}><Icon name={icon}/><strong>{n}</strong><span>{label}</span></div>)}</div><section className="panel review"><div className="panelHead"><div><h2>Revisões necessárias</h2><p>Inspeções e documentos aguardando ação</p></div></div><div className="simpleList">{pending.slice(0,5).map(item=><Link href="/app/inspecao" key={item.id}><span className="dot amber"/><div><b>Inspeção pendente</b><small>{equipment.find(e=>e.id===item.equipmentId)?.name??"Equipamento"}</small></div><span className="badge amber">Revisar</span></Link>)}{readyReports.slice(0,5).map(report=><Link href="/app/laudos" key={report.id}><span className="dot"/><div><b>Laudo pronto para emissão</b><small>{report.inspection.equipment.tag} · {report.inspection.equipment.company.name}</small></div><span className="badge green">Revisar</span></Link>)}{pending.length===0&&readyReports.length===0&&<p className="queueEmpty">Nenhuma revisão pendente.</p>}</div></section><section className="panel"><div className="panelHead"><div><h2>Próximas inspeções</h2><p>Prioridades do período</p></div><Link href="/app/inspecao">Iniciar inspeção <Icon name="arrow"/></Link></div><div className="simpleList">{eq.filter(e=>e.status!=="Em dia").map(e=><div key={e.id}><span className={e.status==="Vencido"?"dot danger":"dot"}/><div><b>{e.tag} · {e.name}</b><small>{companies.find(c=>c.id===e.companyId)?.name}</small></div><span className="date">{e.next}</span><span className={`badge ${e.status==="Vencido"?"red":"amber"}`}>{e.status}</span></div>)}</div></section></>;
}
