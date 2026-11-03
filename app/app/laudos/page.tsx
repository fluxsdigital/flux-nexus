"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../components/auth/AuthProvider";
import { Icon } from "../../../components/Icon";
import { useSystem } from "../../../components/system/SystemProvider";
import { InspectionTechnicalData, normalizeInspectionData } from "../../../lib/inspection-model";

type ApiInspection = {
  id:string; equipmentId:string; status:string; result:string|null; performedAt:string|null;
  signatureData:string|null; recommendations:string|null; conclusion:string|null;
  technicalData:InspectionTechnicalData|null;
  evidence:{id:string;type:string;title:string;description:string;fileName:string;mimeType:string;size:number;sha256:string;capturedAt:string|null;measurementKey?:string|null;dataUrl?:string}[];
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
  safetyRecord:"Registro de Segurança",
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
  const {companies,equipment,inspections,companyFilter,refreshInspections}=useSystem();
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
  const drafts=inspections.filter(item=>ids.has(item.equipmentId)&&item.status==="Rascunho");
  const ready=inspections.filter(item=>ids.has(item.equipmentId)&&(item.status==="Concluída"||item.status==="Aguardando laudo")&&!shown.some(report=>report.inspection.id===item.id));
  const selectedLocal=selectedInspection?inspections.find(item=>item.id===selectedInspection):null;
  const openReport=async(report:Report)=>{setBusy(true);setError("");try{const evidence=await Promise.all((report.inspection.evidence||[]).map(async item=>{const image=await request<{dataUrl:string}>(`/inspections/${report.inspection.id}/evidence/${item.id}`);return {...item,dataUrl:image.dataUrl}}));setSelectedReport({...report,inspection:{...report.inspection,evidence}});setSelectedInspection(null)}catch(e){setError(e instanceof Error?e.message:"Não foi possível carregar as evidências")}finally{setBusy(false)}};
  const deleteDraft=async(id:string)=>{if(!window.confirm("Excluir este rascunho de inspeção? Esta ação não pode ser desfeita."))return;setBusy(true);setError("");try{await request(`/inspections/${id}`,{method:"DELETE",body:"{}"});await refreshInspections()}catch(e){setError(e instanceof Error?e.message:"Não foi possível excluir o rascunho")}finally{setBusy(false)}};

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

  const data=selectedReport?.inspection.technicalData?normalizeInspectionData(selectedReport.inspection.technicalData):null;
  const logo=user?.tenant.logoUrl;
  const document=selectedReport&&<article className="document technicalReport">
    <div className={`docStatus ${selectedReport.status==="ISSUED"?"issuedStatus":""}`}>{selectedReport.status==="ISSUED"?"LAUDO EMITIDO":"EM REVISÃO"}</div>
    <header className="documentTitle"><span className="reportLogo">{logo?<img src={logo} alt="Logo"/>:"N"}</span><div><b>{user?.tenant.name||"NR NEXUS"}</b><small>LAUDO TÉCNICO DE INSPEÇÃO NR-13</small></div><strong>{selectedReport.number} · REV. {data?.revision||"00"}</strong></header>
    <section className="reportCover"><span>LAUDO TÉCNICO NR-13</span><h1>Relatório de inspeção de segurança</h1><strong>{selectedReport.number} · Revisão {data?.revision||"00"}</strong><p>{selectedReport.inspection.equipment.company.name}</p><b>{selectedReport.inspection.equipment.tag} · {selectedReport.inspection.equipment.name}</b><small>{data?.identification.location||"Localização não informada"}</small><em>{selectedReport.inspection.responsible.name}{selectedReport.inspection.responsible.crea?` · CREA ${selectedReport.inspection.responsible.crea}`:""}</em></section>
    {data&&<nav className="reportToc"><h2>Sumário</h2>{["Dados preliminares","Escopo da inspeção","Caracterização técnica","Documentação e checklists","Exames e ensaios","Espessura e engenharia","Instrumentos e dispositivos","Achados e recomendações","Conclusão técnica","Fotos e anexos"].map((item,index)=><p key={item}><span>{index+1}. {item}</span><i/></p>)}</nav>}
    <div className="documentFacts">
      <div><small>EMPRESA</small><strong>{selectedReport.inspection.equipment.company.name}</strong></div>
      <div><small>EQUIPAMENTO</small><strong>{selectedReport.inspection.equipment.tag} · {selectedReport.inspection.equipment.name}</strong></div>
      <div><small>RESPONSÁVEL TÉCNICO</small><strong>{selectedReport.inspection.responsible.name}</strong></div>
      <div><small>REGISTRO PROFISSIONAL</small><strong>{selectedReport.inspection.responsible.crea||"Não informado"}</strong></div>
      <div><small>DATA DA INSPEÇÃO</small><strong>{fmt(selectedReport.inspection.performedAt)}</strong></div>
      <div><small>RESULTADO</small><strong>{resultLabel[selectedReport.inspection.result||""]||selectedReport.inspection.result}</strong></div>
    </div>
    {data?<>
      {data.preliminary&&Object.values(data.preliminary).some(Boolean)&&<ReportSection title="1. Dados preliminares"><Fact label="Proprietário" value={data.preliminary.ownerName}/><Fact label="CNPJ" value={data.preliminary.ownerCnpj}/><Fact label="Endereço" value={data.preliminary.ownerAddress}/><Fact label="Local / fábrica / setor" value={[data.preliminary.site,data.preliminary.factory,data.preliminary.sector].filter(Boolean).join(" · ")}/><Fact label="Coordenadas" value={data.preliminary.coordinates}/><Fact label="Empresa inspetora" value={data.preliminary.inspectionCompany}/><Fact label="Profissional / qualificação" value={data.preliminary.professionalQualification}/><Fact label="CREA / registro" value={data.preliminary.professionalRegistry}/><Fact label="ART / TRT" value={data.preliminary.artNumber}/></ReportSection>}
      <ReportSection title="2. Escopo da inspeção">
        <Fact label="Tipo de equipamento" value={equipmentLabel[data.scope.equipmentKind]||data.scope.equipmentKind}/>
        <Fact label="Exames e ensaios realizados" value={data.scope.examinations.map(item=>examinationLabel[item]||item).join("; ")}/>
        <Fact label="Anotação de Responsabilidade Técnica (ART)" value={data.scope.artNumber}/>
        <Fact label="Período da inspeção" value={`${fmt(data.scope.startedAt)} a ${fmt(data.scope.finishedAt)}`}/>
      </ReportSection>
      <ReportSection title="3. Identificação e características técnicas">{Object.entries(data.identification).filter(([,value])=>value!==""&&value!==false&&value!==undefined).map(([key,value])=><Fact key={key} label={fieldLabel[key]||key} value={fieldValue(value)}/>)}</ReportSection>
      {(data.equipmentCircuits||[]).length>0&&<ReportSection title="3.1. Circuitos independentes"><ReportTable headings={["Circuito","Fluido / classe","Volume","Pressões operação / projeto","PMTA / TH","Categoria"]} rows={data.equipmentCircuits!.map(item=>[item.name,`${item.fluid} · ${item.fluidClass}`,item.volume,`${item.operatingPressure} / ${item.designPressure}`,`${item.pmta} / ${item.hydrostaticTestPressure}`,item.vesselCategory])}/></ReportSection>}
      {data.volumeDetails&&<ReportSection title="2.0. Volume e memória de cálculo"><Fact label="Volume / capacidade" value={`${data.identification.volume} ${data.volumeDetails.unit==="M3"?"m³":data.volumeDetails.unit.toLowerCase()}`}/>{data.volumeDetails.unit==="T"&&<Fact label="Densidade usada para conversão" value={`${data.volumeDetails.densityKgM3||"Não informada"} kg/m³`}/>} {data.volumeDetails.calculation&&<><Fact label="Geometria" value={data.volumeDetails.calculation.geometry}/><Fact label="Dimensões" value={`Diâmetro ${data.volumeDetails.calculation.diameterM} m${data.volumeDetails.calculation.straightLengthM?` · comprimento reto ${data.volumeDetails.calculation.straightLengthM} m`:""}`}/><p className="reportCalculation"><small>MEMÓRIA DE CÁLCULO</small><span>{data.volumeDetails.calculation.memory}</span><strong>Resultado: {data.volumeDetails.calculation.resultM3} m³</strong></p></>}</ReportSection>}
      {data.pmtaCalculation?<ReportSection title="2.1. Memória de cálculo da PMTA">{data.pmtaCalculation.mode==="NOT_CALCULATED"?<><p className="reportWarning">PMTA não calculada nesta inspeção.</p>{data.pmtaCalculation.reason&&<Fact label="Motivo / referência" value={data.pmtaCalculation.reason}/>}</>:<><Fact label="Código / edição" value={`${data.pmtaCalculation.code} · ${data.pmtaCalculation.edition}`}/><Fact label="Método" value={data.pmtaCalculation.method}/><Fact label="Geometria / condição" value="Casco cilíndrico sob pressão interna"/><Fact label="Espessura medida" value={`${data.pmtaCalculation.measuredThicknessMm} mm`}/><Fact label="Margem de corrosão" value={`${data.pmtaCalculation.corrosionAllowanceMm||0} mm`}/><Fact label="Raio interno" value={`${data.pmtaCalculation.insideRadiusMm} mm`}/><Fact label="Tensão admissível" value={`${data.pmtaCalculation.allowableStressMpa} MPa`}/><Fact label="Eficiência de junta" value={String(data.pmtaCalculation.jointEfficiency)}/><p className="reportCalculation"><small>FÓRMULA</small><code>{data.pmtaCalculation.formula}</code><span>{data.pmtaCalculation.memory}</span><strong>PMTA adotada: {data.pmtaCalculation.adoptedResultBar} bar</strong></p></>}</ReportSection>:data.identification.pmta&&<ReportSection title="2.1. Registro legado de PMTA"><p className="reportWarning">PMTA registrada em inspeção anterior sem memória de cálculo estruturada: {data.identification.pmta} bar.</p></ReportSection>}
      <ReportSection title="3. Documentação e registros">{Object.entries(data.documentation).filter(([key])=>key in fieldLabel).map(([key,value])=><Fact key={key} label={fieldLabel[key]} value={answer[value]||value}/>)}</ReportSection>
      {(data.checklistItems||[]).some(item=>item.enabled&&item.label)&&<ReportSection title="4. Checklist de inspeção"><ReportTable headings={["Grupo","Item","Resposta","Observação"]} rows={(data.checklistItems||[]).filter(item=>item.enabled&&item.label).map(item=>[item.group,item.label,answer[item.answer]||item.answer,item.observation||"—"])}/></ReportSection>}
      {data.safetyCalibration&&<ReportSection title="3.1. Itens de segurança calibrados"><Fact label="Itens de segurança calibrados (válvulas e manômetros)?" value={data.safetyCalibration.calibrated==="YES"?"Sim":data.safetyCalibration.calibrated==="NO"?"Não":"Não informado"}/>{data.safetyCalibration.calibrated==="YES"&&<Fact label="Data de vencimento" value={fmt(data.safetyCalibration.dueDate)}/>}</ReportSection>}
      <ReportSection title="4. Exames e ensaios">
        <Fact label="Resultado do exame externo" value={answer[data.examinations.externalResult]}/>
        <Fact label="Observações do exame externo" value={data.examinations.externalNotes}/>
        {data.scope.examinations.includes("INTERNAL")&&<><Fact label="Resultado do exame interno" value={answer[data.examinations.internalResult]}/><Fact label="Observações do exame interno" value={data.examinations.internalNotes}/></>}
        <Fact label="Resultado do teste hidrostático" value={data.examinations.hydrostaticResult||data.examinations.hydrostaticWaiverBasis}/>
      </ReportSection>
      {data.readings.length>0&&<ReportSection title="6. Medições de espessura por ultrassom"><ReportTable headings={["Ponto","Componente / região","Nominal","Mínima","Medida","Observação"]} rows={data.readings.map(reading=>[reading.point,[reading.component,reading.region].filter(Boolean).join(" · "),reading.nominal?`${reading.nominal} ${reading.unit}`:"—",reading.minimum?`${reading.minimum} ${reading.unit}`:"—",`${reading.value} ${reading.unit}`,reading.observation||"—"])}/>{data.thicknessOpinion&&<p className="reportNarrative"><b>Parecer: </b>{data.thicknessOpinion}</p>}</ReportSection>}
      {data.utMethod&&Object.values(data.utMethod).some(Boolean)&&<ReportSection title="6.1. Método, calibração e memória UT">{Object.entries(data.utMethod).filter(([,value])=>value).map(([key,value])=><Fact key={key} label={{instrument:"Instrumento",manufacturer:"Fabricante",model:"Modelo",serialNumber:"Série",procedure:"Procedimento",probe:"Cabeçote",referenceBlock:"Bloco/padrão",calibrationCertificate:"Certificado",calibrationDate:"Data calibração",calibrationDueDate:"Validade",sketchReference:"Croqui",corrosionRate:"Taxa de corrosão",remainingLife:"Vida remanescente",calculationMemory:"Memória de cálculo"}[key]||key} value={String(value)}/>)}</ReportSection>}
      {(data.ndtTests||[]).length>0&&<ReportSection title="6.2. Outros END e ensaios"><ReportTable headings={["Método","Área","Procedimento","Data","Resultado","Relatório / observação"]} rows={data.ndtTests!.map(item=>[item.method,item.area,item.procedure,fmt(item.date),answer[item.result]||item.result,`${item.reportReference} · ${item.observation}`])}/></ReportSection>}
      {(data.observedComponents||[]).some(item=>item.component&&(item.observation||item.condition!=="NOT_VERIFIED"))&&<ReportSection title="7. Componentes observados"><ReportTable headings={["Componente","Condição","Observação"]} rows={(data.observedComponents||[]).filter(item=>item.component&&(item.observation||item.condition!=="NOT_VERIFIED")).map(item=>[item.component,answer[item.condition]||item.condition,item.observation||"—"])}/></ReportSection>}
      {data.devices.length>0&&<ReportSection title="6. Dispositivos de segurança e medição"><ReportTable headings={["Tipo / TAG","Identificação","Faixa / ajuste","Certificado / calibração","Periodicidade / validade","Resultado"]} rows={data.devices.map(device=>[`${deviceLabel[device.kind]||device.kind} · ${device.tag}`,`${device.manufacturer} · Série ${device.serialNumber}`,`${device.range} ${device.pressureUnit||"bar"} · ${device.setPressure} ${device.pressureUnit||"bar"}`,`${device.certificateNumber} · ${fmt(device.calibrationDate)}`,`${device.periodicityYears?`${device.periodicityYears} ano(s)`:"—"} · ${fmt(device.dueDate)}`,device.result])}/></ReportSection>}
      {data.scope.examinations.includes("PRESSURE_CALIBRATION")&&<ReportSection title="7. Calibração do medidor de pressão"><p className="reportGuidance">Dados registrados conforme orientação técnica do DOQ-CGCRE-047. A inclusão desta seção não caracteriza esse documento orientativo como requisito normativo obrigatório.</p>{Object.entries(data.calibration).filter(([,value])=>value!=="").map(([key,value])=><Fact key={key} label={fieldLabel[key]||key} value={fieldValue(value)}/>)}</ReportSection>}
      <ReportSection title="8. Recomendações e prazos"><Fact label="Recomendações" value={data.recommendationPlan?.applicable===false?"Não se aplica":"Aplicável"}/><p className="reportNarrative">{data.recommendationPlan?.applicable===false?"Não aplicável.":data.recommendations||"Sem recomendações registradas."}</p><Fact label="Próximo exame externo" value={fmt(data.deadlines.nextExternal)}/><Fact label="Próximo exame interno" value={fmt(data.deadlines.nextInternal)}/><Fact label="Teste hidrostático" value={data.hydrostaticPlan?.applicable===false?"Não se aplica":"Aplicável"}/><Fact label="Próximo teste hidrostático" value={data.hydrostaticPlan?.applicable===false?"Não aplicável":fmt(data.hydrostaticPlan?.nextDate||data.deadlines.nextHydrostatic)}/><Fact label="Prazo para atendimento das recomendações" value={data.recommendationPlan?.applicable===false?"Não aplicável":fmt(data.recommendationPlan?.dueDate||data.deadlines.recommendationDue)}/></ReportSection>
      {(data.authorizedPressure||data.inspectionIntervalBasis)&&<ReportSection title="8.1. Condições e intervalo"><Fact label="Pressão autorizada" value={data.authorizedPressure}/><Fact label="Justificativa do intervalo" value={data.inspectionIntervalBasis}/></ReportSection>}
      {(data.nonConformities||[]).length>0&&<ReportSection title="9. Não conformidades e plano de ação"><ReportTable headings={["Descrição","Criticidade","Ação corretiva","Prazo / responsável","Evidência","Status"]} rows={(data.nonConformities||[]).map(item=>[item.description,{LOW:"Baixa",MEDIUM:"Média",HIGH:"Alta",CRITICAL:"Crítica"}[item.criticality],item.correctiveAction,`${fmt(item.dueDate)} · ${item.responsible||"—"}`,item.evidenceReference||"—",{OPEN:"Aberta",IN_PROGRESS:"Em andamento",RESOLVED:"Resolvida",MONITORING:"Monitoramento"}[item.status]])}/>{(data.nonConformities||[]).some(item=>item.status!=="RESOLVED")&&<p className="reportWarning">Existem pendências abertas ou em acompanhamento. Consulte o plano de ação acima antes da operação.</p>}</ReportSection>}
      {(data.extraordinaryTriggers||[]).length>0&&<ReportSection title="10. Inspeção extraordinária"><ul className="reportList">{data.extraordinaryTriggers!.map(item=><li key={item}>{item}</li>)}</ul></ReportSection>}
      {selectedReport.inspection.evidence.length>0&&<ReportSection title="12. Fotos e anexos"><div className="reportEvidenceGrid">{selectedReport.inspection.evidence.map((evidence,index)=>{const reading=data.readings.find(item=>item.key===evidence.measurementKey);const isImage=evidence.mimeType?.startsWith("image/");return <figure key={evidence.id||index}>{isImage&&evidence.dataUrl&&<img src={evidence.dataUrl} alt={evidence.title}/>} {!isImage&&<div className="reportDocumentAttachment">PDF · documento anexo</div>}<figcaption>{reading&&<em>Ponto de medição: {reading.point}{reading.component?` · ${reading.component}`:""}</em>}<b>{evidence.title}</b><span>{evidence.description}</span><small>{fmt(evidence.capturedAt)} · {evidence.fileName}{evidence.sha256?` · SHA-256 ${evidence.sha256.slice(0,16)}…`:""}</small></figcaption></figure>})}</div></ReportSection>}
      {selectedReport.inspection.evidence.length>0&&<ReportSection title="12.1. Índice de anexos"><ReportTable headings={["Item","Tipo","Título","Arquivo","Data","Integridade"]} rows={selectedReport.inspection.evidence.map((item,index)=>[String(index+1),item.type||"—",item.title,item.fileName||"—",fmt(item.capturedAt),item.sha256||"—"])}/></ReportSection>}
    </>:<p className="reportWarning">Inspeção legada sem estrutura técnica consolidada.</p>}
    <ReportSection title="11. Parecer conclusivo" className="conclusionSection"><p className="conclusion">{selectedReport.conclusion}</p>{data?.conclusionDetails&&<><Fact label="Condição da PMTA" value={data.conclusionDetails.pmtaDisposition==="MAINTAINED"?"PMTA mantida":data.conclusionDetails.pmtaDisposition==="REVISED"?`PMTA revisada para ${data.conclusionDetails.revisedPmta}`:"Não avaliada"}/><Fact label="Condições para operação" value={data.conclusionDetails.operatingConditions}/><Fact label="Restrições" value={data.conclusionDetails.restrictions}/><Fact label="Fundamentação normativa" value={data.conclusionDetails.normativeBasis}/></>}</ReportSection>
    <div className="reportSignatures">{selectedReport.inspection.signatureData&&<div className="reportSignature"><small>RESPONSÁVEL TÉCNICO</small><img src={selectedReport.inspection.signatureData} alt="Assinatura"/><b>{selectedReport.inspection.responsible.name}</b><span>CREA {selectedReport.inspection.responsible.crea}</span></div>}{data?.clientSignature?.name&&<div className="reportSignature"><small>CLIENTE / RESPONSÁVEL</small><div className="signatureSpace"/><b>{data.clientSignature.name}</b><span>{[data.clientSignature.role,data.clientSignature.registry,fmt(data.clientSignature.date)].filter(Boolean).join(" · ")}</span></div>}</div>
    <footer className="reportFooter">{selectedReport.number} · Rev. {data?.revision||"00"} · Documento gerado a partir do registro único da inspeção · <span className="pageCounter"/></footer>
  </article>;

  return <><div className="pageHead"><div><small>DOCUMENTOS TÉCNICOS</small><h1>Laudos</h1><p>Os laudos são projeções somente leitura dos dados da inspeção.</p></div></div><div className="reportWorkspace"><aside className="reportQueues"><DraftQueue items={drafts.map(item=>({id:item.id,title:equipment.find(e=>e.id===item.equipmentId)?.name||item.id,subtitle:item.date}))} busy={busy} onDelete={id=>void deleteDraft(id)}/><Queue title="Prontos para emitir" items={ready.map(item=>({id:item.id,title:equipment.find(e=>e.id===item.equipmentId)?.name||item.id,subtitle:item.date}))} onPick={id=>{setSelectedInspection(id);setSelectedReport(null)}}/><Queue title="Em revisão" items={shown.filter(report=>report.status!=="ISSUED").map(report=>({id:report.id,title:report.number,subtitle:report.inspection.equipment.tag}))} onPick={id=>{const report=shown.find(item=>item.id===id);if(report)void openReport(report)}}/><Queue title="Laudos emitidos" items={shown.filter(report=>report.status==="ISSUED").map(report=>({id:report.id,title:report.number,subtitle:report.inspection.equipment.tag}))} onPick={id=>{const report=shown.find(item=>item.id===id);if(report)void openReport(report)}}/></aside><section className="panel reportPreview">{document}{selectedLocal&&!selectedReport&&<div className="document documentDraft"><h2>Inspeção pronta para emissão</h2><p>O laudo será gerado integralmente a partir dos dados técnicos registrados na inspeção.</p></div>}{!selectedLocal&&!selectedReport&&<p className="queueEmpty">Selecione uma inspeção ou laudo.</p>}{error&&<p className="formError">{error}</p>}<div className="reportActions">{selectedLocal&&<button className="primary" disabled={busy} onClick={emit}><Icon name="save"/>Criar laudo para revisão</button>}{selectedReport?.status!=="ISSUED"&&selectedReport&&<button className="primary" disabled={busy} onClick={issue}><Icon name="check"/>Validar e emitir</button>}{selectedReport?.status==="ISSUED"&&<button className="primary" onClick={()=>window.print()}><Icon name="download"/>Imprimir / PDF</button>}</div></section></div></>;
}

function DraftQueue({items,busy,onDelete}:{items:{id:string;title:string;subtitle:string}[];busy:boolean;onDelete:(id:string)=>void}){return <section className="panel reportQueue"><div className="queueHeader"><div><small>INSPEÇÕES NÃO CONCLUÍDAS</small><h2>Rascunhos</h2></div><strong>{items.length}</strong></div>{items.length?items.map(item=><article className="reportItem draftReportItem" key={item.id}><Icon name="file"/><span><b>{item.title}</b><small>{item.subtitle}</small></span><div><Link className="secondaryBtn" href={`/app/inspecao?draft=${item.id}`}>Continuar</Link><button type="button" className="removeBtn" disabled={busy} onClick={()=>onDelete(item.id)}>Excluir</button></div></article>):<p className="queueEmpty">Nenhum rascunho.</p>}</section>}

function Queue({title,items,onPick}:{title:string;items:{id:string;title:string;subtitle:string}[];onPick:(id:string)=>void}){return <section className="panel reportQueue"><div className="queueHeader"><div><small>FLUXO DO LAUDO</small><h2>{title}</h2></div><strong>{items.length}</strong></div>{items.length?items.map(item=><button type="button" className="reportItem" key={item.id} onClick={()=>onPick(item.id)}><Icon name="file"/><span><b>{item.title}</b><small>{item.subtitle}</small></span><em>Abrir</em></button>):<p className="queueEmpty">Nenhum item.</p>}</section>}
function ReportSection({title,children,className=""}:{title:string;children:React.ReactNode;className?:string}){return <section className={`reportSection ${className}`}><h2>{title}</h2><div>{children}</div></section>}
function Fact({label,value}:{label:string;value?:string}){return value?<p className="reportFact"><small>{label}</small><b>{value}</b></p>:null}
function ReportTable({headings,rows}:{headings:string[];rows:string[][]}){return <div className="reportTableWrap"><table><thead><tr>{headings.map(heading=><th key={heading}>{heading}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr key={index}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>}
