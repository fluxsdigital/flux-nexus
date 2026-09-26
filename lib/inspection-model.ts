export type Answer = "COMPLIANT" | "NON_COMPLIANT" | "NOT_APPLICABLE" | "NOT_VERIFIED";
export type Reading = { key:string; point:string; component:string; value:string; unit:string; minimum?:string; observation?:string };
export type Device = { kind:"PSV"|"PRESSURE_GAUGE"; tag:string; manufacturer:string; serialNumber:string; range:string; setPressure:string; certificateNumber:string; calibrationDate:string; dueDate:string; result:string };
export type Evidence = { id?:string; type?:"GENERAL"|"IDENTIFICATION_PLATE"|"COMPONENT"|"NON_CONFORMITY"|"DOCUMENT"|"OTHER"; title:string; url?:string; dataUrl?:string; description:string; fileName?:string; mimeType?:string; size?:number; sha256?:string; capturedAt?:string; measurementKey?:string|null };
export type InspectionTechnicalData = {
  schemaVersion:1;
  scope:{ equipmentKind:"PRESSURE_VESSEL"|"HEAT_EXCHANGER"; examinations:string[]; inspectionType:string; startedAt:string; finishedAt:string; artNumber:string };
  identification:{ location:string; manufacturer:string; model:string; serialNumber:string; manufactureYear:string; constructionCode:string; volume:string; fluid:string; fluidClass:string; vesselCategory:string; riskGroup:string; designPressure:string; operatingPressure:string; pmta:string; designTemperature:string; hydrostaticTestPressure:string; material:string; orientation:string; hasJacket:boolean; internalCircuitDescription:string };
  documentation:Record<string,Answer>;
  examinations:{ externalResult:Answer; externalNotes:string; internalResult:Answer; internalNotes:string; hydrostaticPerformed:boolean; hydrostaticPressure:string; hydrostaticDuration:string; hydrostaticResult:string; hydrostaticWaiverBasis:string; accumulationPerformed:boolean; accumulationPressure:string; accumulationDuration:string; accumulationResult:string };
  readings:Reading[];
  devices:Device[];
  calibration:{ method:string; procedure:string; ambientTemperature:string; atmosphericPressure:string; cycles:string; standardType:string; standardId:string; standardCertificate:string; standardUncertainty:string; ascendingDescending:boolean; conversionFactor:string; result:string };
  recommendations:string;
  conclusion:string;
  result:"APPROVED"|"APPROVED_WITH_RECOMMENDATIONS"|"REJECTED";
  deadlines:{ nextExternal:string; nextInternal:string; nextHydrostatic:string; recommendationDue:string };
  evidence:Evidence[];
};

export const emptyInspectionData=():InspectionTechnicalData=>({schemaVersion:1,scope:{equipmentKind:"PRESSURE_VESSEL",examinations:["EXTERNAL"],inspectionType:"PERIODIC_EXTERNAL",startedAt:new Date().toISOString().slice(0,10),finishedAt:"",artNumber:""},identification:{location:"",manufacturer:"",model:"",serialNumber:"",manufactureYear:"",constructionCode:"",volume:"",fluid:"",fluidClass:"",vesselCategory:"",riskGroup:"",designPressure:"",operatingPressure:"",pmta:"",designTemperature:"",hydrostaticTestPressure:"",material:"",orientation:"",hasJacket:false,internalCircuitDescription:""},documentation:{identificationPlate:"NOT_VERIFIED",categoryMarking:"NOT_VERIFIED",manufacturerRecord:"NOT_VERIFIED",safetyRecord:"NOT_VERIFIED",installationProject:"NOT_VERIFIED",operationManual:"NOT_VERIFIED",previousReports:"NOT_VERIFIED",alterationRepairProject:"NOT_APPLICABLE",operatorTraining:"NOT_VERIFIED"},examinations:{externalResult:"NOT_VERIFIED",externalNotes:"",internalResult:"NOT_APPLICABLE",internalNotes:"",hydrostaticPerformed:false,hydrostaticPressure:"",hydrostaticDuration:"",hydrostaticResult:"",hydrostaticWaiverBasis:"",accumulationPerformed:false,accumulationPressure:"",accumulationDuration:"",accumulationResult:""},readings:[],devices:[],calibration:{method:"",procedure:"",ambientTemperature:"",atmosphericPressure:"",cycles:"",standardType:"",standardId:"",standardCertificate:"",standardUncertainty:"",ascendingDescending:true,conversionFactor:"",result:""},recommendations:"",conclusion:"",result:"APPROVED_WITH_RECOMMENDATIONS",deadlines:{nextExternal:"",nextInternal:"",nextHydrostatic:"",recommendationDue:""},evidence:[]});
