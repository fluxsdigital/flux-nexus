import assert from "node:assert/strict";
import { spawn } from "node:child_process";
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
  ["/app", "Visão Geral"],
  ["/app/empresas", "Empresas"],
  ["/app/equipamentos", "Equipamentos"],
  ["/app/inspecao", "Nova inspeção"],
  ["/app/laudos", "Laudos"],
];

for (const [route, expectedText] of routes) {
  test(`${route} responde com a interface esperada`, async () => {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200);
    assert.match(await response.text(), new RegExp(expectedText, "i"));
  });
}
