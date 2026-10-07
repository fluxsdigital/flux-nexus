# Mapa do laudo técnico

Referência visual: `artifacts/laudo-demonstracao-revisado.pdf` (arquivo local preexistente).

| Ordem | Seção | Fonte persistida |
| --- | --- | --- |
| Cabeçalho | empresa, equipamento, responsável, CREA, data e resultado | `Inspection`, `Equipment`, `Company`, `User` |
| 1 | Escopo, exames, ART e período | `technicalData.scope` |
| 2 | Identificação, características, volume e PMTA | `technicalData.identification`, `volumeDetails`, `pmtaCalculation` |
| 3 | Documentação e itens de segurança calibrados | `technicalData.documentation`, `safetyCalibration` |
| 4 | Exames e ensaios | `technicalData.examinations` |
| 5 | Medições de espessura | `technicalData.readings` e `Measurement` |
| 6 | Dispositivos de segurança e medição | `technicalData.devices` |
| 7 | Calibração do medidor | `technicalData.calibration` |
| 8 | Recomendações, aplicabilidade e prazos | `recommendations`, `recommendationPlan`, `hydrostaticPlan`, `deadlines` |
| 9 | Evidências e vínculo ao ponto de medição | `InspectionEvidence`, `measurementKey` |
| 10 | Parecer, assinatura e identificação profissional | `conclusion`, `signatureData`, responsável |

Campos vazios opcionais são omitidos; “Não aplicável” e “Não verificado” nunca são convertidos em conformidade. Laudos emitidos preservam snapshots imutáveis na API.
