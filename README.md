# Flux Nexus

Conversão do projeto **NR Nexus Landing Page**, criado no Google Stitch, para Next.js + TypeScript e preparado para deploy automático na Vercel.

## Rotas

- `/` — direção visual principal
- `/premium-saas` — variação Premium SaaS
- `/blueprint` — variação Dark Technical Blueprint
- `/editorial` — variação Clean Editorial Precision

O Stitch reporta 9 telas no projeto, mas sua API disponibilizou HTML exportável para 4 delas. As quatro entregas HTML foram preservadas integralmente e expostas como rotas.

## Desenvolvimento

```bash
npm install
npm run dev
```

Node.js 20.9 ou superior. A Vercel deve usar o diretório raiz do repositório, reconhecer Next.js automaticamente e executar `npm run build`.

Os documentos exportados estão em `public/stitch`. Eles são renderizados por `components/StitchScreen.tsx` em contexto isolado, preservando o CSS, o Tailwind e o comportamento original sem interferência entre variantes.
