import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";

const port = 4317;
const baseUrl = `http://127.0.0.1:${port}`;
let server;

before(async () => {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next.js encerrou com código ${server.exitCode}`);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("Servidor Next.js não ficou disponível em 15 segundos");
});

after(() => {
  if (server?.exitCode === null) server.kill("SIGTERM");
});

const routes = [
  ["/", "Suas inspeções e laudos técnicos"],
  ["/login", "Acesse seu workspace"],
  ["/criar-conta", "Crie seu workspace"],
  ["/convite", "Carregando convite"],
  ["/app", "Validando sessão"],
  ["/app/empresas", "Validando sessão"],
  ["/app/equipamentos", "Validando sessão"],
  ["/app/inspecao", "Validando sessão"],
  ["/app/laudos", "Validando sessão"],
  ["/app/servicos", "Validando sessão"],
  ["/app/orcamentos", "Validando sessão"],
  ["/app/equipe", "Validando sessão"],
  ["/app/configuracoes", "Validando sessão"],
  ["/app/configuracoes/perfil", "Validando sessão"],
  ["/app/configuracoes/identidade-visual", "Validando sessão"],
];

for (const [route, expectedText] of routes) {
  test(`${route} responde com a interface esperada`, async () => {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expectedText, "i"));
  });
}

test("conclusão atualiza as inspeções antes de abrir a fila de laudos", async () => {
  const source = await readFile(new URL("../app/app/inspecao/page.tsx", import.meta.url), "utf8");
  assert.match(source, /await refreshInspections\(\);router\.push\("\/app\/laudos"\)/);
  assert.match(source, /role="alert"/);
  assert.match(source, /InspectionValidationError/);
  assert.match(source, /if\(step===5\)validateConclusionStep\(\)/);
  assert.match(source, /inspection-finished-at/);
  assert.match(source, /inspection-conclusion/);
  assert.match(source, /scrollIntoView\(\{behavior:"smooth",block:"center"\}\)/);
});

test("rascunhos de inspeção são salvos, retomados e excluídos pela área de laudos", async () => {
  const inspection = await readFile(new URL("../app/app/inspecao/page.tsx", import.meta.url), "utf8");
  const reports = await readFile(new URL("../app/app/laudos/page.tsx", import.meta.url), "utf8");
  const provider = await readFile(new URL("../components/system/SystemProvider.tsx", import.meta.url), "utf8");
  assert.match(inspection, /new URLSearchParams\(window\.location\.search\)\.get\("draft"\)/);
  assert.match(inspection, /router\.push\(`\/app\/laudos\?draft=\$\{id\}`\)/);
  assert.doesNotMatch(inspection, /const pending=inspections\.find/);
  assert.match(reports, /<h2>Rascunhos<\/h2>/);
  assert.match(reports, /href=\{`\/app\/inspecao\?draft=\$\{item\.id\}`\}/);
  assert.match(reports, /method:"DELETE"/);
  assert.match(provider, /IN_PROGRESS:"Rascunho"/);
});

test("configurações separa perfil e identidade visual",async()=>{const hub=await readFile(new URL("../app/app/configuracoes/page.tsx",import.meta.url),"utf8");const editor=await readFile(new URL("../app/app/configuracoes/SettingsEditor.tsx",import.meta.url),"utf8");assert.match(hub,/configuracoes\/perfil/);assert.match(hub,/configuracoes\/identidade-visual/);assert.match(editor,/settings\/profile/);assert.match(editor,/settings\/workspace/);assert.match(editor,/OWNER","ADMIN/)});

test("estilos compartilhados cobrem viewports móveis e orientação horizontal",async()=>{const system=await readFile(new URL("../app/app/corrections.css",import.meta.url),"utf8");const global=await readFile(new URL("../app/globals.css",import.meta.url),"utf8");for(const width of [900,600,430,360])assert.match(system,new RegExp(`max-width:${width}px`));assert.match(system,/orientation:landscape/);assert.match(system,/min-height:44px/);assert.match(system,/overflow-x:auto/);assert.match(system,/max-height:calc\(100dvh/);assert.match(global,/font-size:16px/);assert.match(global,/touch-action:manipulation/)});

test("laudo inclui a estrutura técnica ampliada do modelo de referência", async()=>{const source=await readFile(new URL("../app/app/laudos/page.tsx",import.meta.url),"utf8");for(const title of ["Dados preliminares","Escopo da inspeção","Identificação e características","Checklist de inspeção","Medições de espessura","Componentes observados","Não conformidades","Inspeção extraordinária","Parecer conclusivo"])assert.match(source,new RegExp(title));for(const field of ["safetyCalibration","volumeDetails","pressureUnit","recommendationPlan","hydrostaticPlan","signatureData","clientSignature","conclusionDetails"])assert.match(source,new RegExp(field))});
test("unidade da pressão de projeto usa o campo persistido sem painel separado",async()=>{const source=await readFile(new URL("../app/app/inspecao/page.tsx",import.meta.url),"utf8");assert.match(source,/Pressão de projeto \/ \$\{data\.identification\.pressureUnit/);assert.match(source,/aria-label="Unidade da pressão de projeto"/);assert.match(source,/setId\("pressureUnit",e\.target\.value\)/);assert.doesNotMatch(source,/Unidade das pressões informadas/)});
test("tipo personalizado de dispositivo abre modal, persiste sem duplicar e seleciona o novo valor",async()=>{const source=await readFile(new URL("../app/app/inspecao/page.tsx",import.meta.url),"utf8");assert.match(source,/Tipo de dispositivo/);assert.match(source,/>Adicionar tipo</);assert.match(source,/aria-labelledby="device-type-title"/);assert.match(source,/kind:"DEVICE_TYPE",name/);assert.match(source,/const existing=deviceTypes\.find/);assert.match(source,/selectDeviceType\(deviceTypeIndex,item\.name\)/);assert.doesNotMatch(source,/Tipos de dispositivo do tenant/)});

test("reaproveitamento cria rascunho revisável sem número, evidências ou assinaturas herdadas", async()=>{
  const reports=await readFile(new URL("../app/app/laudos/page.tsx",import.meta.url),"utf8");
  const inspection=await readFile(new URL("../app/app/inspecao/page.tsx",import.meta.url),"utf8");
  assert.match(reports,/Criar novo a partir deste/);
  assert.match(reports,/\/reports\/\$\{selectedReport\.id\}\/reuse/);
  assert.match(reports,/EVIDÊNCIAS E ASSINATURAS/);
  assert.doesNotMatch(reports,/number:`NR-/);
  assert.match(inspection,/RASCUNHO REAPROVEITADO/);
  assert.match(reports,/draft=\$\{encodeURIComponent\(draft\.id\)\}/);
  assert.match(inspection,/sourceReportId/);
});

test("interface preserva compatibilidade e ignora campos documentais desconhecidos", async()=>{
  const files=["../app/layout.tsx","../app/app/inspecao/page.tsx","../app/app/laudos/page.tsx","../components/MainSections.tsx","../components/PmtaCalculationPanel.tsx","../lib/inspection-model.ts"];
  const source=(await Promise.all(files.map(file=>readFile(new URL(file,import.meta.url),"utf8")))).join("\n");
  assert.match(source,/Prontu[aá]rio/i);
  assert.doesNotMatch(source,new RegExp(`manufacturer${"Record"}`));
  const reportSource=await readFile(new URL("../app/app/laudos/page.tsx",import.meta.url),"utf8");
  assert.match(reportSource,/Object\.entries\(data\.documentation\)\.filter\(\(\[key\]\)=>key in fieldLabel\)/);
});

test("serviços e orçamentos possuem módulos independentes e contratos compatíveis", async()=>{
  const shell=await readFile(new URL("../components/system/SystemShell.tsx",import.meta.url),"utf8");
  const services=await readFile(new URL("../app/app/servicos/page.tsx",import.meta.url),"utf8");
  const budgets=await readFile(new URL("../app/app/orcamentos/page.tsx",import.meta.url),"utf8");
  assert.match(shell,/"\/app\/servicos","settings","Serviços"/);
  assert.match(shell,/"\/app\/orcamentos","file","Orçamentos"/);
  assert.match(services,/request<Service\[]>\("\/services"\)/);
  assert.match(services,/method:editingService \? "PATCH" : "POST"/);
  assert.doesNotMatch(budgets,/saveService|toggleService|Novo serviço/);
  assert.match(budgets,/request<Service\[]>\("\/services"\)/);
  assert.match(budgets,/serviceId:item\.serviceId/);
  assert.match(budgets,/serviceNameSnapshot/);
});

test("alinhamento do cliente aparece nos fluxos de equipamento, inspeção e orçamento",async()=>{
  const equipment=await readFile(new URL("../app/app/equipamentos/page.tsx",import.meta.url),"utf8");
  const inspection=await readFile(new URL("../app/app/inspecao/page.tsx",import.meta.url),"utf8");
  const budgets=await readFile(new URL("../app/app/orcamentos/page.tsx",import.meta.url),"utf8");
  assert.match(equipment,/EQUIPMENT_CATEGORY/);assert.match(equipment,/Adicionar categoria/);assert.doesNotMatch(equipment,/Próxima inspeção/);
  assert.match(inspection,/CONTINUANDO RASCUNHO/);assert.match(inspection,/NOVA INSPEÇÃO/);assert.match(inspection,/bar.*psi.*kPa.*MPa/);assert.match(inspection,/Realizar também a periodicidade interna/);assert.match(inspection,/DEVICE_TYPE/);
  assert.match(budgets,/\/budgets\/dashboard/);assert.match(budgets,/número será gerado automaticamente/i);assert.doesNotMatch(budgets,/budgetForm\.number/);
});
