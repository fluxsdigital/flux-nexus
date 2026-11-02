import type { InspectionTechnicalData } from "./inspection-model";

export type InspectionIssue={code:string;message:string;blocking:boolean};
const number=(value?:string)=>Number(String(value||"").replace(",","."));

export function validateInspectionConsistency(data:InspectionTechnicalData):InspectionIssue[]{
  const issues:InspectionIssue[]=[];
  const pmta=number(data.identification.pmta);
  const authorized=number(data.authorizedPressure);
  if(authorized>0&&pmta>0&&authorized>pmta)issues.push({code:"AUTHORIZED_ABOVE_PMTA",message:"A pressão autorizada não pode superar a PMTA.",blocking:true});
  for(const device of data.devices){
    if(device.kind==="PSV"&&number(device.setPressure)>0&&pmta>0&&number(device.setPressure)>pmta)issues.push({code:"PSV_ABOVE_PMTA",message:`A pressão de ajuste da PSV ${device.tag||"sem TAG"} supera a PMTA.`,blocking:true});
    if(data.safetyCalibration?.calibrated==="YES"&&!device.certificateNumber.trim())issues.push({code:"MISSING_DEVICE_CERTIFICATE",message:`Informe o certificado do dispositivo ${device.tag||"sem TAG"}.`,blocking:true});
    if(device.calibrationDate&&device.dueDate&&device.dueDate<device.calibrationDate)issues.push({code:"INVALID_DEVICE_DATES",message:`A validade do dispositivo ${device.tag||"sem TAG"} é anterior à calibração.`,blocking:true});
  }
  if(data.examinations.hydrostaticPerformed&&!data.examinations.hydrostaticResult.trim())issues.push({code:"MISSING_HYDRO_RESULT",message:"Informe o resultado do teste hidrostático realizado.",blocking:true});
  if(data.scope.examinations.includes("HYDROSTATIC")&&!data.examinations.hydrostaticPerformed&&!data.examinations.hydrostaticWaiverBasis.trim())issues.push({code:"MISSING_HYDRO_BASIS",message:"A não realização do teste hidrostático exige justificativa técnica e fundamento aplicável.",blocking:true});
  const critical=(data.nonConformities||[]).filter(item=>item.criticality==="CRITICAL"&&item.status!=="RESOLVED");
  if(critical.length&&data.result!=="REJECTED")issues.push({code:"CRITICAL_FINDING_CONCLUSION",message:"Há não conformidade crítica aberta; o parecer deve ser inapto até sua resolução.",blocking:true});
  const noEvidence=(data.checklistItems||[]).filter(item=>item.enabled&&["NON_COMPLIANT","NOT_VERIFIED"].includes(item.answer)&&!item.observation.trim());
  if(noEvidence.length)issues.push({code:"CHECKLIST_OBSERVATION",message:`${noEvidence.length} item(ns) “Não/NO” precisam de observação ou evidência.`,blocking:true});
  if(data.utMethod?.calibrationDate&&data.utMethod.calibrationDueDate&&data.utMethod.calibrationDueDate<data.utMethod.calibrationDate)issues.push({code:"INVALID_UT_CALIBRATION",message:"A validade do instrumento UT é anterior à calibração.",blocking:true});
  return issues;
}
