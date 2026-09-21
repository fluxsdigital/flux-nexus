"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icon";
import { useSystem } from "../../../components/system/SystemProvider";

const steps=["Identificação","Checklist","Medições","Evidências","Conclusão"];

export default function Inspection(){
  const {companies,equipment,inspections,companyFilter,addInspection,completeInspection}=useSystem();
  const router=useRouter();
  const available=equipment.filter(e=>companyFilter==="all"||e.companyId===companyFilter);
  const [step,setStep]=useState(0);
  const [selected,setSelected]=useState(available[0]?.id||"");
  const [checks,setChecks]=useState([true,true,false,true]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const pending=inspections.find(i=>i.equipmentId===selected&&i.status==="Pendente");
  const finish=async(e:FormEvent)=>{
    e.preventDefault();
    if(!selected)return;
    setBusy(true);setError("");
    try{
      if(pending) await completeInspection(pending.id);
      else await addInspection({equipmentId:selected,date:new Date().toLocaleDateString("pt-BR"),type:"Periódica externa",status:"Concluída",result:"Aprovado com recomendações"});
      router.push("/app/laudos");
    }catch(x){setError(x instanceof Error?x.message:"Não foi possível concluir a inspeção");}finally{setBusy(false)}
  };
  return <>
    <div className="pageHead"><div><small>{pending?"INSPEÇÃO PENDENTE":"NOVA INSPEÇÃO"}</small><h1>Inspeção NR-13</h1><p>{pending?"Continue a inspeção pendente deste equipamento.":"Fluxo guiado, simples e seguro."}</p></div><span className="draft">{pending?"PENDENTE":"RASCUNHO"}</span></div>
    <div className="stepper">{steps.map((label,index)=><div className={index===step?"current":index<step?"done":""} key={label}><span>{index<step?<Icon name="check"/>:index+1}</span><small>{label}</small></div>)}</div>
    <form className="panel inspectForm" onSubmit={finish}>
      {step===0&&<><div className="formTitle"><Icon name="equipment"/><div><h2>Qual equipamento será inspecionado?</h2><p>Inspeções pendentes aparecem identificadas para continuidade.</p></div></div><div className="equipmentChoice">{available.map(item=>{const itemPending=inspections.some(i=>i.equipmentId===item.id&&i.status==="Pendente");return <label className={selected===item.id?"chosen":""} key={item.id}><input type="radio" name="eq" value={item.id} checked={selected===item.id} onChange={()=>setSelected(item.id)}/><Icon name="equipment"/><span><b>{item.tag} · {item.name}</b><small>{companies.find(c=>c.id===item.companyId)?.name}</small></span>{itemPending&&<span className="badge amber">Pendente</span>}<Icon name="check"/></label>})}</div></>}
      {step===1&&<><div className="formTitle"><Icon name="clipboard"/><div><h2>Checklist visual</h2><p>Marque os itens verificados em campo.</p></div></div><div className="checkList">{["Identificação e placa legíveis","Acessórios de segurança íntegros","Ausência de corrosão aparente","Prontuário disponível"].map((label,index)=><label key={label}><input type="checkbox" checked={checks[index]} onChange={()=>setChecks(items=>items.map((value,itemIndex)=>itemIndex===index?!value:value))}/>{label}</label>)}</div></>}
      {step>1&&<div className="formTitle"><Icon name="clipboard"/><div><h2>{steps[step]}</h2><p>Dados preparados para a conclusão técnica.</p></div></div>}
      {error&&<p className="formError">{error}</p>}
      <div className="formActions"><button type="button" className="secondaryBtn" disabled={step===0||busy} onClick={()=>setStep(value=>value-1)}>Voltar</button>{step<steps.length-1?<button type="button" className="primary" disabled={!selected} onClick={()=>setStep(value=>value+1)}>Continuar <Icon name="arrow"/></button>:<button type="submit" className="primary" disabled={busy||!selected}>{busy?"Salvando…":"Concluir inspeção"}</button>}</div>
    </form>
  </>;
}
