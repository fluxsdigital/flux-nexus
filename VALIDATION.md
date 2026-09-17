# Validação

## Fonte de verdade

- Projeto Stitch: `NR Nexus Landing Page` (`7006831602360508548`).
- A API lista seis registros internos, mas apenas uma tela possui HTML exportável atual: `nr_nexus_variante_a_dark_technical_blueprint`.
- HTML, screenshot e design tokens foram baixados novamente antes da reconstrução.

## Implementação

- Uma única rota pública: `/`.
- `/blueprint` removida e validada com HTTP 404.
- Reconstrução React/Next.js por seção, sem iframe, `srcDoc` ou HTML bruto público.
- Tema dark premium, grid técnico, cockpit do produto, conteúdo e hierarquia fiéis à tela atual.
- Ícones em SVG local; nenhum nome de ligatura aparece como texto.
- Logo local e favicon próprio.
- Layout responsivo validado em 1440×900 e 390×844.

## Resultado

- `npm run lint`: aprovado.
- `npm run build`: aprovado com Next.js 16.3.5.
- `/`: HTTP 200.
- `/blueprint`: HTTP 404.
- Screenshot desktop: `/tmp/nexus-new.png`.
- Screenshot mobile: `/tmp/nexus-mobile.png`.
