import test from "node:test";
import assert from "node:assert/strict";
import { validateInspectionConsistency } from "../lib/inspection-validation.ts";

const base=()=>({identification:{pmta:""},authorizedPressure:"",devices:[],nonConformities:[],checklistItems:[],scope:{examinations:[]},examinations:{hydrostaticPerformed:false,hydrostaticResult:"",hydrostaticWaiverBasis:""},result:"APPROVED_WITH_RECOMMENDATIONS"});

test("blocks pressure, certificate and critical conclusion contradictions",()=>{const data=base();data.identification.pmta="10";data.authorizedPressure="11";data.safetyCalibration={calibrated:"YES",dueDate:"",evidenceIds:[]};data.devices=[{kind:"PSV",tag:"PSV-01",manufacturer:"",serialNumber:"",range:"",setPressure:"12",certificateNumber:"",calibrationDate:"2026-02-01",dueDate:"2026-01-01",result:""}];data.nonConformities=[{key:"nc",description:"",criticality:"CRITICAL",correctiveAction:"",dueDate:"",responsible:"",evidenceReference:"",status:"OPEN"}];const codes=validateInspectionConsistency(data).map(item=>item.code);assert.deepEqual(codes.slice(0,4),["AUTHORIZED_ABOVE_PMTA","PSV_ABOVE_PMTA","MISSING_DEVICE_CERTIFICATE","INVALID_DEVICE_DATES"]);assert.ok(codes.includes("CRITICAL_FINDING_CONCLUSION"))});

test("requires hydrostatic basis and checklist observations",()=>{const data=base();data.scope.examinations.push("HYDROSTATIC");data.checklistItems=[{key:"item",group:"",label:"",enabled:true,answer:"NOT_VERIFIED",observation:""}];const codes=validateInspectionConsistency(data).map(item=>item.code);assert.ok(codes.includes("MISSING_HYDRO_BASIS"));assert.ok(codes.includes("CHECKLIST_OBSERVATION"))});
