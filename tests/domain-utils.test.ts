import assert from "node:assert/strict"; import test from "node:test";
// @ts-expect-error Node's type-stripping test runner requires the source extension.
import { addCalendarYears } from "../lib/calendar.ts";
// @ts-expect-error Node's type-stripping test runner requires the source extension.
import { formatCnpj, isValidCnpj, normalizeCnpj } from "../lib/cnpj.ts";
test("CNPJ is normalized, formatted and validated",()=>{assert.equal(normalizeCnpj("11.222.333/0001-81"),"11222333000181");assert.equal(formatCnpj("11222333000181"),"11.222.333/0001-81");assert.equal(isValidCnpj("11.222.333/0001-81"),true);assert.equal(isValidCnpj("11.222.333/0001-80"),false)});
test("calendar-year periodicity clamps leap day",()=>{assert.equal(addCalendarYears("2024-02-29",1),"2025-02-28");assert.equal(addCalendarYears("2024-02-29",4),"2028-02-29");assert.equal(addCalendarYears("2026-10-07",3),"2029-10-07")});
