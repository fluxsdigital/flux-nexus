"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../components/auth/AuthProvider";
import { Icon } from "../../../components/Icon";
import { useSystem } from "../../../components/system/SystemProvider";
import { InspectionTechnicalData } from "../../../lib/inspection-model";

type ApiInspection = {
  id:string; equipmentId:string; status:string; result:string|null; performedAt:string|null;
  signatureData:string|null; recommendations:string|null; conclusion:string|null;
  technicalData:InspectionTechnicalData|null;
  evidence:{id:string;type:string;title:string;description:string;fileName:string;mimeType:string;size:number;sha256:string;capturedAt:string|null;dataUrl?:string}[];
  equipment:{tag:string;name:string;company:{name:string}};
  responsible:{name:string;crea:string|null};
};
type Report = {id:string;number:string;status:string;conclusion:string;recommendations:string|null;inspection:ApiInspection};

const answer:Record<string,string>={COMPLIANT:"Conforme",NON_COMPLIANT:"Não conforme",NOT_APPLICABLE:"Não aplicável",NOT_VERIFIED:"Não verificado"};
const resultLabel:Record<string,string>={APPROVED:"Aprovado",APPROVED_WITH_RECOMMENDATIONS:"Aprovado com recomendações",REJECTED:"Reprovado"};
const examinationLabel:Record<string,string>={EXTERNAL:"Exame externo",INTERNAL:"Exame interno",ULTRASOUND:"Medição de espessura por ultrassom",HYDROSTATIC:"Teste hidrostático",ACCUMULATION:"Ensaio de acumulação",PRESSURE_CALIBRATION:"Calibração de medidor de pressão"};
const equipmentLabel:Record<string,string>={PRESSURE_VESSEL:"Vaso de pressão",HEAT_EXCHANGER:"Trocador de calor"};
const deviceLabel:Record<string,string>={PSV:"Válvula de segurança/alívio (PSV)",PRESSURE_GAUGE:"Manômetro/medidor de pressão"};
const fieldLabel:Record<string,string>={
  location:"Localização / setor",manufacturer:"Fabricante",model:"Modelo / tipo",serialNumber:"Número de série",
  manufactureYear:"Ano de fabricação",constructionCode:"Código de construção / edição",volume:"Volume / capacidade",
  fluid:"Fluido de trabalho",fluidClass:"Classe do fluido",vesselCategory:"Categoria do vaso",
  riskGroup:"Grupo potencial de risco",designPressure:"Pressão de projeto",operatingPressure:"Pressão de operação",
  pmta:"Pressão Máxima de Trabalho Admissível (PMTA)",designTemperature:"Temperatura de projeto",
  hydrostaticTestPressure:"Pressão de prova hidrostática",material:"Material de fabricação",
  orientation:"Orientação / formato",hasJacket:"Possui camisa",internalCircuitDescription:"Descrição do circuito interno / feixe",
  identificationPlate:"Placa de identificação",categoryMarking:"Identificação da categoria e TAG",
  manufacturerRecord:"Prontuário do fabricante ou reconstituído",safetyRecord:"Registro de Segurança",
  installationProject:"Projeto de instalação",operationManual:"Manual / instruções de operação",
  previousReports:"Relatórios e recomendações anteriores",alterationRepairProject:"Projeto de Alteração ou Reparo (PAR)",
  operatorTraining:"Capacitação dos operadores",method:"Método de calibração",procedure:"Procedimento aplicado",
  ambientTemperature:"Temperatura ambiente",atmosphericPressure:"Pressão atmosférica",cycles:"Ciclos de calibração",
  standardType:"Tipo de padrão",standardId:"Identificação do padrão",standardCertificate:"Certificado do padrão",
  standardUncertainty:"Incerteza do padrão",ascendingDescending:"Indicações crescentes e decrescentes",
  conversionFactor:"Fator de conversão",result:"Resultado da calibração",
};
const fmt=(value?:string|null)=>value?new Date(value.length===10?`${value}T12:00:00`:value).toLocaleDateString("pt-BR"):"—";
const fieldValue=(value:unknown)=>typeof value==="boolean"?(value?"Sim":"Não"):String(value);

export default function Reports(){
  const {companies,equipment,inspections,companyFilter}=useSystem();
  const {user,request}=useAuth();
  const [reports,setReports]=useState<Report[]>([]);
  const [selectedInspection,setSelectedInspection]=useState<string|null>(null);
  const [selectedReport,setSelectedReport]=useState<Report|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{void request<Report[]>("/reports").then(setReports).catch(e=>setError(e instanceof Error?e.message:"Falha ao carregar laudos"))},[request]);
  const ids=new Set(equipment.filter(item=>companyFilter==="all"||item.companyId===companyFilter).map(item=>item.id));
  const companyName=companies.find(item=>item.id===companyFilter)?.name;
  const shown=reports.filter(report=>companyFilter==="all"||report.inspection.equipment.company.name===companyName);
  const ready=inspections.filter(item=>ids.has(item.equipmentId)&&(item.status==="Concluída"||item.status==="Aguardando laudo")&&!shown.some(report=>report.inspection.id===item.id));
  const selectedLocal=selectedInspection?inspections.find(item=>item.id===selectedInspection):null;
  const openReport=async(report:Report)=>{setBusy(true);setError("");try{const evidence=await Promise.all((report.inspection.evidence||[]).map(async item=>{const image=await request<{dataUrl:string}>(`/inspections/${report.inspection.id}/evidence/${item.id}`);return {...item,dataUrl:image.dataUrl}}));setSelectedReport({...report,inspection:{...report.inspection,evidence}});setSelectedInspection(null)}catch(e){setError(e instanceof Error?e.message:"Não foi possível carregar as evidências")}finally{setBusy(false)}};

  const emit=async()=>{
    if(!selectedLocal)return;
    setBusy(true);setError("");
    try{
      if(selectedLocal.status==="Concluída")await request(`/inspections/${selectedLocal.id}/transitions`,{method:"POST",body:JSON.stringify({status:"AWAITING_REPORT"})});
      const detail=await request<ApiInspection>(`/inspections/${selectedLocal.id}`);
      const report=await request<Report>("/reports",{method:"POST",body:JSON.stringify({inspectionId:detail.id,number:`NR-${new Date().getFullYear()}-${String(reports.length+1).padStart(4,"0")}`,conclusion:detail.conclusion,recommendations:detail.recommendations})});
      setReports(items=>[report,...items]);await openReport(report);
    }catch(e){setError(e instanceof Error?e.message:"Não foi possível criar o laudo")}finally{setBusy(false)}
  };
  const issue=async()=>{
    if(!selectedReport)return;
    setBusy(true);setError("");
    try{
      let report=selectedReport;
      if(report.status==="DRAFT")report=await request<Report>(`/reports/${report.id}/transitions`,{method:"POST",body:JSON.stringify({status:"IN_REVIEW"})});
      if(report.status==="IN_REVIEW")report=await request<Report>(`/reports/${report.id}/transitions`,{method:"POST",body:JSON.stringify({status:"ISSUED"})});
      setReports(items=>items.map(item=>item.id===report.id?report:item));setSelectedReport(report);
    }catch(e){setError(e instanceof Error?e.message:"Não foi possível emitir o laudo")}finally{setBusy(false)}
  };

  const data=selectedReport?.inspection.technicalData;
  const logo=user?.tenant.logoUrl;
  const document=selectedReport&&<article className="document technicalReport">
    <div className={`docStatus ${selectedReport.status==="ISSUED"?"issuedStatus":""}`}>{selectedReport.status==="ISSUED"?"LAUDO EMITIDO":"EM REVISÃO"}</div>
    <header className="documentTitle"><span className="reportLogo">{logo?<img src={logo} alt="Logo"/>:"N"}</span><div><b>{user?.tenant.name||"NR NEXUS"}</b><small>LAUDO TÉCNICO DE INSPEÇÃO NR-13</small></div><strong>{selectedReport.number}</strong></header>
    <h1 className="reportMainTitle">Relatório de inspeção de segurança</h1>
    <div className="documentFacts">
      <div><small>EMPRESA</small><strong>{selectedReport.inspection.equipment.company.name}</strong></div>
      <div><small>EQUIPAMENTO</small><strong>{selectedReport.inspection.equipment.tag} · {selectedReport.inspection.equipment.name}</strong></div>
      <div><small>RESPONSÁVEL TÉCNICO</small><strong>{selectedReport.inspection.responsible.name}</strong></div>
      <div><small>REGISTRO PROFISSIONAL</small><strong>{selectedReport.inspection.responsible.crea||"Não informado"}</strong></div>
      <div><small>DATA DA INSPEÇÃO</small><strong>{fmt(selectedReport.inspection.performedAt)}</strong></div>
      <div><small>RESULTADO</small><strong>{resultLabel[selectedReport.inspection.result||""]||selectedReport.inspection.result}</strong></div>
    </div>
    {data?<>
      <ReportSection title="1. Escopo da inspeção">
        <Fact label="Tipo de equipamento" value={equipmentLabel[data.scope.equipmentKind]||data.scope.equipmentKind}/>
        <Fact label="Exames e ensaios realizados" value={data.scope.examinations.map(item=>examinationLabel[item]||item).join("; ")}/>
        <Fact label="Anotação de Responsabilidade Técnica (ART)" value={data.scope.artNumber}/>
        <Fact label="Período da inspeção" value={`${fmt(data.scope.startedAt)} a ${fmt(data.scope.finishedAt)}`}/>
      </ReportSection>
      <ReportSection title="2. Identificação e características técnicas">{Object.entries(data.identification).filter(([,value])=>value!==""&&value!==false).map(([key,value])=><Fact key={key} label={fieldLabel[key]||key} value={fieldValue(value)}/>)}</ReportSection>
      <ReportSection title="3. Documentação e registros">{Object.entries(data.documentation).map(([key,value])=><Fact key={key} label={fieldLabel[key]||key} value={answer[value]||value}/>)}</ReportSection>
      <ReportSection title="4. Exames e ensaios">
        <Fact label="Resultado do exame externo" value={answer[data.examinations.externalResult]}/>
        <Fact label="Observações do exame externo" value={data.examinations.externalNotes}/>
        {data.scope.examinations.includes("INTERNAL")&&<><Fact label="Resultado do exame interno" value={answer[data.examinations.internalResult]}/><Fact label="Observações do exame interno" value={data.examinations.internalNotes}/></>}
        <Fact label="Resultado do teste hidrostático" value={data.examinations.hydrostaticResult||data.examinations.hydrostaticWaiverBasis}/>
      </ReportSection>
      {data.readings.length>0&&<ReportSection title="5. Medições de espessura"><ReportTable headings={["Ponto","Componente","Valor medido","Referência mínima","Observação"]} rows={data.readings.map(reading=>[reading.point,reading.component,`${reading.value} ${reading.unit}`,reading.minimum||"—",reading.observation||"—"])}/></ReportSection>}
      {data.devices.length>0&&<ReportSection title="6. Dispositivos de segurança e medição"><ReportTable headings={["Tipo / TAG","Identificação","Faixa / ajuste","Certificado / data","Resultado"]} rows={data.devices.map(device=>[`${deviceLabel[device.kind]||device.kind} · ${device.tag}`,`${device.manufacturer} · Série ${device.serialNumber}`,`${device.range} · ${device.setPressure}`,`${device.certificateNumber} · ${fmt(device.calibrationDate)}`,device.result])}/></ReportSection>}
      {data.scope.examinations.includes("PRESSURE_CALIBRATION")&&<ReportSection title="7. Calibração do medidor de pressão"><p className="reportGuidance">Dados registrados conforme orientação técnica do DOQ-CGCRE-047. A inclusão desta seção não caracteriza esse documento orientativo como requisito normativo obrigatório.</p>{Object.entries(data.calibration).filter(([,value])=>value!=="").map(([key,value])=><Fact key={key} label={fieldLabel[key]||key} value={fieldValue(value)}/>)}</ReportSection>}
      <ReportSection title="8. Recomendações e prazos"><p className="reportNarrative">{data.recommendations||"Sem recomendações registradas."}</p><Fact label="Próximo exame externo" value={fmt(data.deadlines.nextExternal)}/><Fact label="Próximo exame interno" value={fmt(data.deadlines.nextInternal)}/><Fact label="Próximo teste hidrostático" value={fmt(data.deadlines.nextHydrostatic)}/><Fact label="Prazo para atendimento das recomendações" value={fmt(data.deadlines.recommendationDue)}/></ReportSection>
      {selectedReport.inspection.evidence.length>0&&<ReportSection title="9. Evidências fotográficas"><div className="reportEvidenceGrid">{selectedReport.inspection.evidence.map((evidence,index)=><figure key={evidence.id||index}>{evidence.dataUrl&&<img src={evidence.dataUrl} alt={evidence.title}/>}<figcaption><b>{evidence.title}</b><span>{evidence.description}</span><small>{evidence.fileName}{evidence.sha256?` · SHA-256 ${evidence.sha256.slice(0,16)}…`:""}</small></figcaption></figure>)}</div></ReportSection>}
    </>:<p className="reportWarning">Inspeção legada sem estrutura técnica consolidada.</p>}
    <ReportSection title="10. Parecer conclusivo" className="conclusionSection"><p className="conclusion">{selectedReport.conclusion}</p></ReportSection>
    {selectedReport.inspection.signatureData&&<div className="reportSignature"><small>ASSINATURA DO RESPONSÁVEL TÉCNICO</small><img src={selectedReport.inspection.signatureData} alt="Assinatura"/><b>{selectedReport.inspection.responsible.name}</b><span>CREA {selectedReport.inspection.responsible.crea}</span></div>}
    <footer className="reportFooter">Documento gerado a partir do registro único da inspeção · {selectedReport.number}</footer>
  </article>;

  return <><div className="pageHead"><div><small>DOCUMENTOS TÉCNICOS</small><h1>Laudos</h1><p>Os laudos são projeções somente leitura dos dados da inspeção.</p></div></div><div className="reportWorkspace"><aside className="reportQueues"><Queue title="Prontos para emitir" items={ready.map(item=>({id:item.id,title:equipment.find(e=>e.id===item.equipmentId)?.name||item.id,subtitle:item.date}))} onPick={id=>{setSelectedInspection(id);setSelectedReport(null)}}/><Queue title="Em revisão" items={shown.filter(report=>report.status!=="ISSUED").map(report=>({id:report.id,title:report.number,subtitle:report.inspection.equipment.tag}))} onPick={id=>{const report=shown.find(item=>item.id===id);if(report)void openReport(report)}}/><Queue title="Laudos emitidos" items={shown.filter(report=>report.status==="ISSUED").map(report=>({id:report.id,title:report.number,subtitle:report.inspection.equipment.tag}))} onPick={id=>{const report=shown.find(item=>item.id===id);if(report)void openReport(report)}}/></aside><section className="panel reportPreview">{document}{selectedLocal&&!selectedReport&&<div className="document documentDraft"><h2>Inspeção pronta para emissão</h2><p>O laudo será gerado integralmente a partir dos dados técnicos registrados na inspeção.</p></div>}{!selectedLocal&&!selectedReport&&<p className="queueEmpty">Selecione uma inspeção ou laudo.</p>}{error&&<p className="formError">{error}</p>}<div className="reportActions">{selectedLocal&&<button className="primary" disabled={busy} onClick={emit}><Icon name="save"/>Criar laudo para revisão</button>}{selectedReport?.status!=="ISSUED"&&selectedReport&&<button className="primary" disabled={busy} onClick={issue}><Icon name="check"/>Validar e emitir</button>}{selectedReport?.status==="ISSUED"&&<button className="primary" onClick={()=>window.print()}><Icon name="download"/>Imprimir / PDF</button>}</div></section></div></>;
}

function Queue({title,items,onPick}:{title:string;items:{id:string;title:string;subtitle:string}[];onPick:(id:string)=>void}){return <section className="panel reportQueue"><div className="queueHeader"><div><small>FLUXO DO LAUDO</small><h2>{title}</h2></div><strong>{items.length}</strong></div>{items.length?items.map(item=><button type="button" className="reportItem" key={item.id} onClick={()=>onPick(item.id)}><Icon name="file"/><span><b>{item.title}</b><small>{item.subtitle}</small></span><em>Abrir</em></button>):<p className="queueEmpty">Nenhum item.</p>}</section>}
function ReportSection({title,children,className=""}:{title:string;children:React.ReactNode;className?:string}){return <section className={`reportSection ${className}`}><h2>{title}</h2><div>{children}</div></section>}
function Fact({label,value}:{label:string;value?:string}){return value?<p className="reportFact"><small>{label}</small><b>{value}</b></p>:null}
function ReportTable({headings,rows}:{headings:string[];rows:string[][]}){return <div className="reportTableWrap"><table><thead><tr>{headings.map(heading=><th key={heading}>{heading}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr key={index}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>}
