export type PmtaCalculation = {
  mode:"CALCULATED"|"NOT_CALCULATED";
  code?:string; edition?:string; method?:string; geometry?:string;
  measuredThicknessMm?:number; corrosionAllowanceMm?:number; insideRadiusMm?:number;
  allowableStressMpa?:number; jointEfficiency?:number;
  circumferentialResultBar?:number; longitudinalResultBar?:number; adoptedResultBar?:number;
  formula?:string; memory?:string; reason?:string;
};
export const PMTA_CODE="ASME VIII DIV. 1";
export const PMTA_METHOD="UG-27 — casco cilíndrico sob pressão interna";
export const PMTA_GEOMETRY="CYLINDRICAL_SHELL_INTERNAL_PRESSURE";
export const PMTA_FORMULA="P₁ = S·E·t/(R + 0,6·t); P₂ = 2·S·E·t/(R − 0,4·t); PMTA = menor(P₁, P₂)";
export function calculatePmta(input:PmtaCalculation){
 const measured=Number(input.measuredThicknessMm),allowance=Number(input.corrosionAllowanceMm??0),radius=Number(input.insideRadiusMm),stress=Number(input.allowableStressMpa),efficiency=Number(input.jointEfficiency);
 if(!Number.isFinite(measured)||measured<=0)throw new Error("Espessura medida deve ser maior que zero.");
 if(!Number.isFinite(allowance)||allowance<0||allowance>=measured)throw new Error("Margem de corrosão deve ser maior ou igual a zero e menor que a espessura medida.");
 if(!Number.isFinite(radius)||radius<=0)throw new Error("Raio interno deve ser maior que zero.");
 if(!Number.isFinite(stress)||stress<=0)throw new Error("Tensão admissível deve ser maior que zero.");
 if(!Number.isFinite(efficiency)||efficiency<=0||efficiency>1)throw new Error("Eficiência de junta deve estar entre 0 (exclusivo) e 1.");
 const thickness=measured-allowance;if(thickness>radius/2)throw new Error("UG-27 exige espessura efetiva não superior a metade do raio interno neste método.");
 const denominator=radius-.4*thickness;if(denominator<=0)throw new Error("As dimensões informadas tornam a fórmula longitudinal inválida.");
 const p1=stress*efficiency*thickness/(radius+.6*thickness),p2=2*stress*efficiency*thickness/denominator,round=(value:number)=>Math.round(value*1000)/1000;
 if(p1>.385*stress*efficiency)throw new Error("O resultado excede o limite de aplicabilidade de 0,385·S·E do critério circunferencial UG-27.");
 if(p2>1.25*stress*efficiency)throw new Error("O resultado excede o limite de aplicabilidade de 1,25·S·E do critério longitudinal UG-27.");
 return {effectiveThicknessMm:round(thickness),circumferentialResultBar:round(p1*10),longitudinalResultBar:round(p2*10),adoptedResultBar:round(Math.min(p1,p2)*10)};
}
