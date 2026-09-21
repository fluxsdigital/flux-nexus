"use client";
import { useEffect, useState } from "react";
import { Icon } from "../../../components/Icon";
import { useAuth } from "../../../components/auth/AuthProvider";
import { Inspection, useSystem } from "../../../components/system/SystemProvider";

type Report = { id:string; number:string; status:string; conclusion:string; inspection:{ id:string; equipment:{ tag:string; name:string; company:{ name:string } }; responsible:{ name:string; crea:string|null }; result:string|null } };

export default function Reports(){
  const { companies, equipment, inspections, companyFilter } = useSystem();
  const { user, request } = useAuth();
  const [reports,setReports]=useState<Report[]>([]);
  const [selected,setSelected]=useState<Inspection|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const completed=inspections.filter(i=>i.status==="Concluída"||i.status==="Aguardando laudo").filter(i=>{const item=equipment.find(e=>e.id===i.equipmentId);return companyFilter==="all"||item?.companyId===companyFilter});
  const selectedEquipment=selected?equipment.find(e=>e.id===selected.equipmentId):undefined;
  const selectedCompany=selectedEquipment?companies.find(c=>c.id===selectedEquipment.companyId):undefined;
  useEffect(()=>{void request<Report[]>("/reports").then(setReports).catch(()=>setReports([]))},[request]);
  const emit=async()=>{if(!selected)return;setBusy(true);setError("");try{await request(`/inspections/${selected.id}/transitions`,{method:"POST",body:JSON.stringify({status:"AWAITING_REPORT"})});const report=await request<Report>("/reports",{method:"POST",body:JSON.stringify({inspectionId:selected.id,number:`NR-${new Date().getFullYear()}-${String(reports.length+1).padStart(3,"0")}`,conclusion:"O equipamento foi avaliado conforme os critérios da inspeção e encontra-se apto para operação nas condições avaliadas."})});setReports(items=>[report,...items]);setSelected(null)}catch(x){setError(x instanceof Error?x.message:"Não foi possível criar o laudo")}finally{setBusy(false)}};
  const activeReport=reports.find(r=>r.inspection.id===selected?.id)||reports[0];
  const print=()=>window.print();
  return <><div className="pageHead"><div><small>DOCUMENTOS TÉCNICOS</small><h1>Laudos</h1><p>Conclua a inspeção e emita o laudo com os dados técnicos reais.</p></div></div><div className="reportLayout"><section className="panel reportList"><div className="panelHead"><div><h2>Inspeções concluídas</h2><p>{completed.length} pronta(s) para laudo</p></div></div>{completed.map(i=>{const e=equipment.find(x=>x.id===i.equipmentId);const c=companies.find(x=>x.id===e?.companyId);const hasReport=reports.some(r=>r.inspection.id===i.id);return <button type="button" key={i.id} className={`reportItem ${selected?.id===i.id?"selected":""}`} onClick={()=>setSelected(i)}><Icon name="file"/><span><b>{e?.tag} · {e?.name}</b><small>{c?.name} · {i.date}</small></span><span className="badge green">{hasReport?"Laudo criado":"Emitir laudo"}</span></button>})}</section><section className="panel reportPreview">{selected&&!activeReport&&<><div className="document"><div className="docHeader"><span>N</span><div><b>NR NEXUS</b><small>LAUDO DE INSPEÇÃO NR-13</small></div><strong>RASCUNHO</strong></div><h2>RELATÓRIO DE INSPEÇÃO</h2><div className="docGrid"><p><small>EMPRESA</small>{selectedCompany?.name}</p><p><small>EQUIPAMENTO</small>{selectedEquipment?.tag} · {selectedEquipment?.name}</p><p><small>ENGENHEIRO</small>{user?.name}</p><p><small>CREA</small>{user?.crea||"Não informado"}</p></div></div><div className="reportActions"><button className="primary" disabled={busy} onClick={emit}><Icon name="save"/>{busy?"Emitindo…":"Emitir laudo"}</button></div>{error&&<p className="formError">{error}</p>}</>}{activeReport&&<><div className="document"><div className="docHeader"><span>N</span><div><b>NR NEXUS</b><small>LAUDO DE INSPEÇÃO NR-13</small></div><strong>Nº {activeReport.number}</strong></div><h2>RELATÓRIO DE INSPEÇÃO</h2><div className="docGrid"><p><small>EMPRESA</small>{activeReport.inspection.equipment.company.name}</p><p><small>EQUIPAMENTO</small>{activeReport.inspection.equipment.tag} · {activeReport.inspection.equipment.name}</p><p><small>ENGENHEIRO</small>{activeReport.inspection.responsible.name}</p><p><small>CREA</small>{activeReport.inspection.responsible.crea||"Não informado"}</p><p><small>RESULTADO</small>{activeReport.inspection.result||"Aprovado"}</p></div><h3>Conclusão técnica</h3><p>{activeReport.conclusion}</p></div><div className="reportActions"><button className="primary" onClick={print}><Icon name="download"/>Imprimir / PDF</button></div></>}</section></div></>;
}
