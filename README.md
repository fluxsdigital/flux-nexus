# Flux Nexus

Conversão do projeto **NR Nexus Landing Page**, criado no Google Stitch, para Next.js + TypeScript e preparado para deploy automático na Vercel.

## Rotas

- `/` — direção visual principal
- `/blueprint` — variação Dark Technical Blueprint

Na sincronização mais recente, a API do Stitch disponibilizou HTML exportável para duas telas atuais. As duas entregas foram preservadas integralmente e expostas como rotas; variantes removidas no Stitch também foram retiradas deste projeto.

## Desenvolvimento

```bash
npm install
npm run dev
```

Node.js 20.9 ou superior. A Vercel deve usar o diretório raiz do repositório, reconhecer Next.js automaticamente e executar `npm run build`.

Os documentos exportados estão em `public/stitch`. Eles são renderizados por `components/StitchScreen.tsx` em contexto isolado, preservando o CSS, o Tailwind e o comportamento original sem interferência entre variantes. A fonte dos Material Symbols está empacotada em `public/fonts`, evitando que as ligaturas dos ícones apareçam como texto quando a fonte externa não estiver disponível.
