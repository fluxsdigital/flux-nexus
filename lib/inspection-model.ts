import { PmtaCalculation } from "./pmta";
import { VolumeCalculation } from "./volume";

export type Answer = "COMPLIANT" | "NON_COMPLIANT" | "NOT_APPLICABLE" | "NOT_VERIFIED";
export type Reading = { key:string; point:string; component:string; region?:string; nominal?:string; value:string; unit:string; minimum?:string; observation?:string };
export type Device = { kind:"PSV"|"PRESSURE_GAUGE"; tag:string; manufacturer:string; model?:string; serialNumber:string; range:string; scale?:string; pressureUnit?:"bar"|"kPa"|"MPa"|"psi"; setPressure:string; openingPressure?:string; sealingPressure?:string; sealed?:boolean; certificateNumber:string; calibrationDate:string; periodicityYears?:number; dueDate:string; result:string };
export type Evidence = { id?:string; type?:"GENERAL"|"IDENTIFICATION_PLATE"|"COMPONENT"|"NON_CONFORMITY"|"DOCUMENT"|"OTHER"; title:string; url?:string; dataUrl?:string; description:string; fileName?:string; mimeType?:string; size?:number; sha256?:string; capturedAt?:string; itemReference?:string; measurementKey?:string|null };
export type ChecklistItem = { key:string; group:string; label:string; answer:Answer; observation:string; enabled:boolean };
export type ObservedComponent = { key:string; component:string; condition:Answer; observation:string };
export type NonConformity = { key:string; description:string; criticality:"LOW"|"MEDIUM"|"HIGH"|"CRITICAL"; correctiveAction:string; dueDate:string; responsible:string; evidenceReference:string; status:"OPEN"|"IN_PROGRESS"|"RESOLVED"|"MONITORING" };
export type PreliminaryData = { ownerName:string; ownerCnpj:string; ownerAddress:string; site:string; factory:string; sector:string; coordinates:string; inspectionCompany:string; professionalQualification:string; professionalRegistry:string; artNumber:string };
export type ClientSignature = { name:string; role:string; registry:string; date:string; signatureData?:string };

export type InspectionTechnicalData = {
  schemaVersion:1|2|3;
  scope:{ equipmentKind:"PRESSURE_VESSEL"|"HEAT_EXCHANGER"; examinations:string[]; inspectionType:string; startedAt:string; finishedAt:string; artNumber:string };
  preliminary?:PreliminaryData;
  identification:{ location:string; manufacturer:string; model:string; equipmentType?:string; serialNumber:string; manufactureYear:string; constructionCode:string; dimensions?:string; volume:string; fluid:string; fluidClass:string; vesselCategory:string; riskGroup:string; nr13Class?:string; designPressure:string; operatingPressure:string; pmta:string; pmtp?:string; designTemperature:string; hydrostaticTestPressure:string; material:string; orientation:string; insulation?:string; hasJacket:boolean; internalCircuitDescription:string };
  volumeDetails?:{unit:"L"|"M3"|"T";densityKgM3?:string;calculation?:VolumeCalculation};
  safetyCalibration?:{calibrated:""|"YES"|"NO";dueDate:string;evidenceIds:string[]};
  pmtaCalculation?:PmtaCalculation;
  documentation:Record<string,Answer>;
  checklistItems?:ChecklistItem[];
  examinations:{ externalResult:Answer; externalNotes:string; internalResult:Answer; internalNotes:string; hydrostaticPerformed:boolean; hydrostaticPressure:string; hydrostaticDuration:string; hydrostaticResult:string; hydrostaticWaiverBasis:string; accumulationPerformed:boolean; accumulationPressure:string; accumulationDuration:string; accumulationResult:string };
  readings:Reading[];
  thicknessOpinion?:string;
  devices:Device[];
  calibration:{ method:string; procedure:string; ambientTemperature:string; atmosphericPressure:string; cycles:string; standardType:string; standardId:string; standardCertificate:string; standardUncertainty:string; ascendingDescending:boolean; conversionFactor:string; result:string };
  observedComponents?:ObservedComponent[];
  nonConformities?:NonConformity[];
  extraordinaryTriggers?:string[];
  recommendations:string;
  recommendationPlan?:{applicable:boolean;dueDate:string};
  hydrostaticPlan?:{applicable:boolean;periodicityYears?:number;nextDate:string};
  conclusion:string;
  conclusionDetails?:{operatingConditions:string;normativeBasis:string;pmtaDisposition:"MAINTAINED"|"REVISED"|"NOT_EVALUATED";revisedPmta:string;restrictions:string};
  result:"APPROVED"|"APPROVED_WITH_RECOMMENDATIONS"|"REJECTED";
  deadlines:{ nextExternal:string; nextInternal:string; nextHydrostatic:string; recommendationDue:string; externalPeriodYears?:number; internalPeriodYears?:number; hydrostaticPeriodYears?:number };
  clientSignature?:ClientSignature;
  evidence:Evidence[];
};

const defaultChecklist=():ChecklistItem[]=>[
  ["records","Prontuário e registros"],["external","Exame externo"],["internal","Exame interno"],["operation","Funcionamento"],["plate","Placa de identificação"],["safety","Dispositivos de segurança"],["gauges","Manômetros e pressostatos"],["valves","Válvulas"],["installation","Condições de instalação"],["training","Treinamento dos operadores"],["anomalies","Anomalias aparentes"],
].map(([key,label])=>({key,group:"Inspeção NR-13",label,answer:"NOT_VERIFIED",observation:"",enabled:true}));

const defaultComponents=():ObservedComponent[]=>["Isolamento","Fundações","Aterramento","Iluminação","Placa de identificação","Válvulas de operação","Válvulas de segurança","Instrumentos"].map(component=>({key:component.toLowerCase().replace(/\W/g,"-"),component,condition:"NOT_VERIFIED",observation:""}));

export const emptyInspectionData=():InspectionTechnicalData=>({schemaVersion:3,scope:{equipmentKind:"PRESSURE_VESSEL",examinations:["EXTERNAL"],inspectionType:"PERIODIC_EXTERNAL",startedAt:new Date().toISOString().slice(0,10),finishedAt:"",artNumber:""},preliminary:{ownerName:"",ownerCnpj:"",ownerAddress:"",site:"",factory:"",sector:"",coordinates:"",inspectionCompany:"",professionalQualification:"",professionalRegistry:"",artNumber:""},identification:{location:"",manufacturer:"",model:"",equipmentType:"",serialNumber:"",manufactureYear:"",constructionCode:"",dimensions:"",volume:"",fluid:"",fluidClass:"",vesselCategory:"",riskGroup:"",nr13Class:"",designPressure:"",operatingPressure:"",pmta:"",pmtp:"",designTemperature:"",hydrostaticTestPressure:"",material:"",orientation:"",insulation:"",hasJacket:false,internalCircuitDescription:""},pmtaCalculation:{mode:"NOT_CALCULATED",reason:""},documentation:{identificationPlate:"NOT_VERIFIED",categoryMarking:"NOT_VERIFIED",safetyRecord:"NOT_VERIFIED",installationProject:"NOT_VERIFIED",operationManual:"NOT_VERIFIED",previousReports:"NOT_VERIFIED",alterationRepairProject:"NOT_APPLICABLE",operatorTraining:"NOT_VERIFIED"},checklistItems:defaultChecklist(),examinations:{externalResult:"NOT_VERIFIED",externalNotes:"",internalResult:"NOT_APPLICABLE",internalNotes:"",hydrostaticPerformed:false,hydrostaticPressure:"",hydrostaticDuration:"",hydrostaticResult:"",hydrostaticWaiverBasis:"",accumulationPerformed:false,accumulationPressure:"",accumulationDuration:"",accumulationResult:""},readings:[],thicknessOpinion:"",devices:[],calibration:{method:"",procedure:"",ambientTemperature:"",atmosphericPressure:"",cycles:"",standardType:"",standardId:"",standardCertificate:"",standardUncertainty:"",ascendingDescending:true,conversionFactor:"",result:""},observedComponents:defaultComponents(),nonConformities:[],extraordinaryTriggers:[],recommendations:"",conclusion:"",conclusionDetails:{operatingConditions:"",normativeBasis:"NR-13 e normas/códigos aplicáveis ao equipamento",pmtaDisposition:"NOT_EVALUATED",revisedPmta:"",restrictions:""},result:"APPROVED_WITH_RECOMMENDATIONS",deadlines:{nextExternal:"",nextInternal:"",nextHydrostatic:"",recommendationDue:""},clientSignature:{name:"",role:"",registry:"",date:""},evidence:[]});

export function normalizeInspectionData(raw:InspectionTechnicalData):InspectionTechnicalData{
  const base=emptyInspectionData();
  const preliminary={...base.preliminary!,...raw.preliminary,artNumber:raw.preliminary?.artNumber||raw.scope.artNumber||""};
  const conclusionDetails={...base.conclusionDetails!,...raw.conclusionDetails};
  const clientSignature={...base.clientSignature!,...raw.clientSignature};
  return {...base,...raw,schemaVersion:3,scope:{...base.scope,...raw.scope},preliminary,identification:{...base.identification,...raw.identification},documentation:{...base.documentation,...raw.documentation},checklistItems:raw.checklistItems?.length?raw.checklistItems:base.checklistItems,examinations:{...base.examinations,...raw.examinations},readings:(raw.readings||[]).map(reading=>({...reading,key:reading.key||crypto.randomUUID()})),devices:raw.devices||[],calibration:{...base.calibration,...raw.calibration},observedComponents:raw.observedComponents?.length?raw.observedComponents:base.observedComponents,nonConformities:raw.nonConformities||[],extraordinaryTriggers:raw.extraordinaryTriggers||[],conclusionDetails,deadlines:{...base.deadlines,...raw.deadlines},clientSignature,evidence:raw.evidence||[]};
}
