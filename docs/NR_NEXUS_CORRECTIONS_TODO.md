# Correções NR Nexus — acompanhamento

Atualizado em: 2026-10-07

Legenda: `[ ]` pendente · `[~]` em andamento · `[x]` concluído · `[!]` bloqueado

## Preparação e integridade

- [~] Auditar schema, migrations, API, UI, testes, isolamento por tenant e ambiente persistente.
- [x] Confirmar repositórios e branches corretos; preservar o Flux Pet sem alterações.
- [ ] Definir migrations aditivas e compatíveis, preservando dados existentes.
- [ ] Confirmar armazenamento e limites padronizados para anexos.
- [ ] Executar testes unitários, integração, E2E, validação manual no navegador e verificação direta de API/banco.
- [ ] Rebuild/restart apenas do ambiente NR Nexus, healthchecks e teste pós-reinício.
- [ ] Commit e push somente após validação; não executar deploy/VPS sem autorização.

## Bloco 1 — itens 1 a 3

- [x] 1. Reposicionar a política “exigir fotos dos pontos de medição” no fluxo mais coerente, preservando a regra e documentando a decisão de UX.
- [x] 2. Normalizar, mascarar e validar CNPJ no frontend e backend; rejeitar dígitos inválidos; cobrir casos válidos e inválidos.
- [x] 3. Calcular próxima inspeção por periodicidade e data-base, em anos-calendário, incluindo 29/02 e revisão manual quando permitida.

## Bloco 2 — itens 4 a 7

- [x] 4. Adicionado “Itens de segurança calibrados (válvulas e manômetros)?”, com Sim/Não, vencimento obrigatório para Sim, fotos pelo armazenamento padrão, persistência e laudo.
- [x] 5. Cálculo de volume por cilindro com tampos planos, cilindro com dois tampos hemisféricos e esfera, com dimensões em metros, limites e memória de cálculo.
- [x] 6. Valor numérico separado da unidade (L, m³, t); tonelada explicitada como massa e densidade positiva exigida no backend.
- [!] 7. Calcular Grupo Potencial de Risco somente conforme regra normativa já adotada no produto, com parâmetros e memória de cálculo; bloqueado: código, documentação e PDF de referência só contêm o campo/valor, sem fórmula, tabela, edição da NR-13 ou definição da pressão usada no produto P×V.

## Bloco 3 — itens 8 a 11

- [x] 8. Indicadores persistentes de preenchimento dos documentos de segurança e resumo de progresso.
- [x] 9. Dispositivos múltiplos com CRUD, unidade de pressão, periodicidade, validade calculada, validação, persistência e laudo.
- [x] 10. Finalização com conteúdo, pendências acionáveis, bloqueios necessários, status/datas/resultado persistidos e retomada.
- [x] 11. Consistência de datas finais, recomendações e teste hidrostático (aplicabilidade, periodicidade e próxima data) entre UI, banco, API e laudo.

## Bloco 4 — item 12 e regressão

- [x] 12. Modelo localizado em `artifacts/laudo-demonstracao-revisado.pdf`; ordem e campos mapeados em `docs/REPORT_FIELD_MAP.md`, refletidos na visualização/PDF do navegador.
- [x] Regressão automatizada, healthchecks e verificação direta do banco/API executados; relatório de evidências registrado abaixo.

## Bloqueios e decisões

- Nenhum bloqueio confirmado até o momento.
- Os repositórios são separados (`front` e `api`); mudanças e commits deverão ser rastreados em ambos quando aplicável.
- Há arquivos locais não rastreados preexistentes no frontend (`AGENTS.md`, `CLAUDE.md`, `artifacts/`); não serão incluídos nos commits.
- O E2E de convites falha com HTTP 503 ao chamar o provedor de e-mail configurado; os outros dois cenários E2E passam. A falha é externa ao bloco 1–3 e será isolada na regressão.
- Item 7 bloqueado isoladamente até confirmação da tabela/faixas de P×V, edição normativa, unidade de referência e qual pressão deve alimentar o cálculo (PMTA, projeto ou operação).

## Evidências do bloco 4–6

- Item 4 — UI/persistência: `app/app/inspecao/page.tsx`, tipos compatíveis em `lib/inspection-model.ts`; validação backend em `api/src/inspections/technical-data.ts`; exibição no laudo em `app/app/laudos/page.tsx`. Fotos usam `/inspections/:id/evidence`, já isolado por tenant, com MIME/tamanho/SHA-256.
- Item 5 — fórmulas e memória: `lib/volume.ts`; UI e gravação no `technicalData` em `app/app/inspecao/page.tsx`; laudo em `app/app/laudos/page.tsx`; testes em `tests/volume.test.ts`.
- Item 6 — unidade/densidade: `lib/inspection-model.ts`, `app/app/inspecao/page.tsx`, validação API `api/src/inspections/technical-data.ts` e testes `api/tests/technical-data.test.ts`.
- Validação: frontend build aprovado e 15/15 testes; API build aprovado e 17/17 testes. Persistência utiliza o campo JSONB `Inspection.technicalData`, mantendo leitura compatível de registros antigos sem os novos campos.

## Evidências do bloco 8–11

- Item 8 — `app/app/inspecao/page.tsx`: contador e percentual derivados do mapa `documentation`, persistido integralmente em `Inspection.technicalData` e restaurado pelo `GET /inspections/:id`.
- Item 9 — `lib/inspection-model.ts` e `app/app/inspecao/page.tsx`: múltiplos dispositivos, unidade (`bar`, `kPa`, `MPa`, `psi`), periodicidade e validade calculada/revisável; API valida em `api/src/inspections/technical-data.ts`; laudo apresenta todos os campos em `app/app/laudos/page.tsx`.
- Item 10 — resumo de pendências na responsabilidade técnica, validação por etapa, salvamento de rascunho e retomada já conectados às rotas `PATCH /inspections/:id`, `PUT /field-data` e transições; conclusão persiste `performedAt`, `result`, `conclusion`, assinatura e status.
- Item 11 — aplicabilidade de recomendações e teste hidrostático, datas/periodicidades e representação “Não aplicável” persistidas no JSONB e refletidas no laudo.
- Validação: frontend build aprovado e 15/15 testes; API build aprovado e 18/18 testes, incluindo unidade/periodicidade/validade de dispositivos. O schema JSON aditivo preserva registros antigos e o serviço continua filtrando inspeções por `tenantId`.

## Evidências do item 12 e regressão

- Modelo: `artifacts/laudo-demonstracao-revisado.pdf`; extração textual confirmou a ordem das dez seções. Mapa: `docs/REPORT_FIELD_MAP.md`.
- Visualização/PDF: `app/app/laudos/page.tsx`, `app/app/report-print.css` e `app/app/report-logo.css`; teste de ordem/campos em `tests/routes.test.mjs`.
- Ambiente local pós-build: API `http://127.0.0.1:3333/v1/health` retornou `status=ok`; Swagger `/docs` respondeu; frontend `http://127.0.0.1:3334/app/laudos` retornou HTTP 200.
- Banco persistente: container `api-postgres-1` saudável; consulta direta confirmou banco `flux_nexus`, zero inspeções atuais e zero registros de inspeção sem `tenantId`.
- O Flux Pet permaneceu nos containers/portas próprios e não foi reiniciado nem alterado.
