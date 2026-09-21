"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export type Company = { id:string; name:string; cnpj:string; city:string; contact:string };
export type Equipment = { id:string; tag:string; name:string; companyId:string; category:string; status:string; next:string };
export type Inspection = { id:string; equipmentId:string; date:string; type:string; status:string; result?:string };

type ApiCompany = { id:string; name:string; cnpj:string; city:string; state:string; contact:string };
type ApiEquipment = { id:string; tag:string; name:string; companyId:string; category:string; status:string; nextInspectionAt:string };
type ApiInspection = { id:string; equipmentId:string; scheduledAt:string|null; performedAt:string|null; type:string; status:string; result:string|null };

type Store = { companies:Company[]; equipment:Equipment[]; inspections:Inspection[]; companyFilter:string; setCompanyFilter:(v:string)=>void; addCompany:(v:Omit<Company,"id">)=>Promise<void>; addEquipment:(v:Omit<Equipment,"id">)=>Promise<void>; addInspection:(v:Omit<Inspection,"id">)=>Promise<string>; completeInspection:(id:string)=>Promise<void> };
const Context = createContext<Store | null>(null);
const categoryToApi:Record<string,string>={"Vaso de pressão":"PRESSURE_VESSEL",Caldeira:"BOILER",Tubulação:"PIPING"};
const categoryFromApi:Record<string,string>={PRESSURE_VESSEL:"Vaso de pressão",BOILER:"Caldeira",PIPING:"Tubulação",STORAGE_TANK:"Tanque de armazenamento"};
const statusFromApi:Record<string,string>={CURRENT:"Em dia",ATTENTION:"Atenção",OVERDUE:"Vencido",INACTIVE:"Inativo"};
const inspectionStatusFromApi:Record<string,string>={SCHEDULED:"Pendente",IN_PROGRESS:"Em andamento",COMPLETED:"Concluída",AWAITING_REPORT:"Aguardando laudo",REPORT_ISSUED:"Laudo emitido",CANCELLED:"Cancelada"};
const inspectionTypeToApi:Record<string,string>={"Periódica externa":"PERIODIC_EXTERNAL","Periódica interna":"PERIODIC_INTERNAL",Inicial:"INITIAL",Extraordinária:"EXTRAORDINARY"};
const inspectionResultFromApi:Record<string,string>={APPROVED:"Aprovado",APPROVED_WITH_RECOMMENDATIONS:"Aprovado com recomendações",REJECTED:"Reprovado"};
const formatDate=(value:string|null|undefined)=>value?new Date(value).toLocaleDateString("pt-BR"):"-";
const dateInput=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)?`${value}T00:00:00.000Z`:new Date(value.split("/").reverse().join("-")).toISOString();
export function SystemProvider({children}:{children:React.ReactNode}){
  const {user,request}=useAuth();
  const [companies,setCompanies]=useState<Company[]>([]);
  const [equipment,setEquipment]=useState<Equipment[]>([]);
  const [inspections,setInspections]=useState<Inspection[]>([]);
  const [companyFilter,setCompanyFilter]=useState("all");
  useEffect(()=>{if(!user)return;void Promise.all([request<ApiCompany[]>("/companies"),request<ApiEquipment[]>("/equipments"),request<ApiInspection[]>("/inspections")]).then(([cs,es,is])=>{setCompanies(cs.map(c=>({id:c.id,name:c.name,cnpj:c.cnpj,city:`${c.city}/${c.state}`,contact:c.contact})));setEquipment(es.map(e=>({id:e.id,tag:e.tag,name:e.name,companyId:e.companyId,category:categoryFromApi[e.category]??e.category,status:statusFromApi[e.status]??e.status,next:formatDate(e.nextInspectionAt)})));setInspections(is.map(i=>({id:i.id,equipmentId:i.equipmentId,date:formatDate(i.performedAt??i.scheduledAt),type:i.type,status:inspectionStatusFromApi[i.status]??i.status,result:i.result?inspectionResultFromApi[i.result]??i.result:undefined})))}).catch(error=>console.error("Falha ao carregar workspace",error))},[user,request]);
  const addCompany=async(value:Omit<Company,"id">)=>{const [city,state=""] = value.city.split("/").map(part=>part.trim());const c=await request<ApiCompany>("/companies",{method:"POST",body:JSON.stringify({...value,cnpj:value.cnpj.replace(/\D/g,""),city,state})});setCompanies(items=>[...items,{id:c.id,name:c.name,cnpj:c.cnpj,city:`${c.city}/${c.state}`,contact:c.contact}])};
  const addEquipment=async(value:Omit<Equipment,"id">)=>{const e=await request<ApiEquipment>("/equipments",{method:"POST",body:JSON.stringify({companyId:value.companyId,tag:value.tag,name:value.name,category:categoryToApi[value.category]??"PRESSURE_VESSEL",nextInspectionAt:dateInput(value.next)})});setEquipment(items=>[...items,{id:e.id,tag:e.tag,name:e.name,companyId:e.companyId,category:categoryFromApi[e.category]??e.category,status:statusFromApi[e.status]??e.status,next:formatDate(e.nextInspectionAt)}])};
  const addInspection=async(value:Omit<Inspection,"id">)=>{const i=await request<ApiInspection>("/inspections",{method:"POST",body:JSON.stringify({equipmentId:value.equipmentId,type:inspectionTypeToApi[value.type]??"PERIODIC_EXTERNAL",scheduledAt:new Date().toISOString()})});await request(`/inspections/${i.id}/transitions`,{method:"POST",body:JSON.stringify({status:"IN_PROGRESS"})});const completed=await request<ApiInspection>(`/inspections/${i.id}`,{method:"PATCH",body:JSON.stringify({performedAt:new Date().toISOString(),result:"APPROVED_WITH_RECOMMENDATIONS",conclusion:"Equipamento avaliado conforme os critérios da inspeção."})});await request(`/inspections/${i.id}/transitions`,{method:"POST",body:JSON.stringify({status:"COMPLETED"})});setInspections(items=>[...items,{id:completed.id,equipmentId:completed.equipmentId,date:formatDate(completed.performedAt),type:completed.type,status:"Concluída",result:"Aprovado com recomendações"}]);return completed.id};
  const completeInspection=async(id:string)=>{await request(`/inspections/${id}/transitions`,{method:"POST",body:JSON.stringify({status:"IN_PROGRESS"})});const completed=await request<ApiInspection>(`/inspections/${id}`,{method:"PATCH",body:JSON.stringify({performedAt:new Date().toISOString(),result:"APPROVED_WITH_RECOMMENDATIONS",conclusion:"Equipamento avaliado conforme os critérios da inspeção."})});await request(`/inspections/${id}/transitions`,{method:"POST",body:JSON.stringify({status:"COMPLETED"})});setInspections(items=>items.map(item=>item.id===id?{...item,date:formatDate(completed.performedAt),status:"Concluída",result:"Aprovado com recomendações"}:item))};
  return <Context.Provider value={{companies,equipment,inspections,companyFilter,setCompanyFilter,addCompany,addEquipment,addInspection,completeInspection}}>{children}</Context.Provider>;
}
export function useSystem(){const value=useContext(Context);if(!value)throw new Error("SystemProvider ausente");return value}
