"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Company = { id:string; name:string; cnpj:string; city:string; contact:string };
export type Equipment = { id:string; tag:string; name:string; companyId:string; category:string; status:string; next:string };
export type Inspection = { id:string; equipmentId:string; date:string; type:string; status:string; result?:string };

const initialCompanies: Company[] = [
  {id:"c1",name:"Metalúrgica Horizonte",cnpj:"12.345.678/0001-90",city:"Contagem/MG",contact:"Marcos Silva"},
  {id:"c2",name:"Alimentos Serra Azul",cnpj:"45.987.321/0001-10",city:"Betim/MG",contact:"Ana Costa"},
];
const initialEquipment: Equipment[] = [
  {id:"e1",tag:"VP-001",name:"Vaso Pulmão de Ar",companyId:"c1",category:"Vaso de pressão",status:"Atenção",next:"18/10/2026"},
  {id:"e2",tag:"CL-004",name:"Caldeira Flamotubular",companyId:"c1",category:"Caldeira",status:"Em dia",next:"09/01/2027"},
  {id:"e3",tag:"VP-012",name:"Reservatório de Amônia",companyId:"c2",category:"Vaso de pressão",status:"Vencido",next:"02/09/2026"},
];
const initialInspections: Inspection[] = [
  {id:"i1",equipmentId:"e2",date:"12/09/2026",type:"Periódica externa",status:"Concluída",result:"Aprovado"},
  {id:"i2",equipmentId:"e1",date:"18/10/2026",type:"Periódica interna",status:"Pendente"},
];

type Store = { companies:Company[]; equipment:Equipment[]; inspections:Inspection[]; companyFilter:string; setCompanyFilter:(v:string)=>void; addCompany:(v:Omit<Company,"id">)=>void; addEquipment:(v:Omit<Equipment,"id">)=>void; addInspection:(v:Omit<Inspection,"id">)=>string };
const Context = createContext<Store | null>(null);
export function SystemProvider({children}:{children:React.ReactNode}){
  const saved=()=>{try{if(typeof window!=="undefined"){const s=localStorage.getItem("nexus-mvp");return s?JSON.parse(s):null}}catch{}return null};
  const [companies,setCompanies]=useState<Company[]>(()=>saved()?.companies||initialCompanies); const [equipment,setEquipment]=useState<Equipment[]>(()=>saved()?.equipment||initialEquipment); const [inspections,setInspections]=useState<Inspection[]>(()=>saved()?.inspections||initialInspections); const [companyFilter,setCompanyFilter]=useState("all");
  useEffect(()=>{localStorage.setItem("nexus-mvp",JSON.stringify({companies,equipment,inspections}))},[companies,equipment,inspections]);
  const addCompany=(v:Omit<Company,"id">)=>setCompanies(x=>[...x,{...v,id:`c${Date.now()}`}]);
  const addEquipment=(v:Omit<Equipment,"id">)=>setEquipment(x=>[...x,{...v,id:`e${Date.now()}`}]);
  const addInspection=(v:Omit<Inspection,"id">)=>{const id=`i${Date.now()}`;setInspections(x=>[...x,{...v,id}]);return id};
  return <Context.Provider value={{companies,equipment,inspections,companyFilter,setCompanyFilter,addCompany,addEquipment,addInspection}}>{children}</Context.Provider>;
}
export function useSystem(){const value=useContext(Context);if(!value)throw new Error("SystemProvider ausente");return value}
