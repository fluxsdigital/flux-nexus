# Flux Nexus

Landing page **NR Nexus** reconstruída em Next.js + TypeScript a partir da única tela atualmente exportável do projeto Google Stitch.

## Rotas

- `/` — landing page Dark Technical Blueprint
- `/app` — visão geral do Nexus Simple
- `/app/empresas` — cadastro de empresas
- `/app/equipamentos` — ativos NR-13
- `/app/inspecao` — fluxo guiado de nova inspeção
- `/app/laudos` — revisão e emissão de laudos

O projeto usa componentes React reais organizados por seção (`Header`, `Hero`, `MainSections` e `Footer`). Não há `iframe`, `srcDoc`, HTML bruto em `public` ou dependência de CDN. Os ícones são SVGs acessíveis renderizados pelo componente `Icon`; logo e favicon estão empacotados localmente.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Validação

```bash
npm run lint
npm run build
npm test
```

Requer Node.js 20.9 ou superior. Para Vercel, use a raiz do repositório, framework Next.js e branch `main`.

O material bruto do Stitch é mantido fora do repositório em `../source-stitch`, apenas como referência de auditoria.
