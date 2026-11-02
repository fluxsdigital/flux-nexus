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
});

test("laudo inclui a estrutura técnica ampliada do modelo de referência", async()=>{const source=await readFile(new URL("../app/app/laudos/page.tsx",import.meta.url),"utf8");for(const title of ["Dados preliminares","Escopo da inspeção","Identificação e características","Checklist de inspeção","Medições de espessura","Componentes observados","Não conformidades","Inspeção extraordinária","Parecer conclusivo"])assert.match(source,new RegExp(title));for(const field of ["safetyCalibration","volumeDetails","pressureUnit","recommendationPlan","hydrostaticPlan","signatureData","clientSignature","conclusionDetails"])assert.match(source,new RegExp(field))});

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
