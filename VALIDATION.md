# Validação

## Escopo

- 2 documentos HTML atuais disponibilizados pela API do Stitch preservados localmente.
- 2 rotas Next.js com componente reutilizável.
- Assets referenciados localmente, sem caminhos do workspace.
- Metadados e favicon configurados pelo App Router.
- Configuração padrão Next.js compatível com Vercel.

## Comandos

- `npm run lint`
- `npm run build`

## Resultado

- `npm run lint`: aprovado, sem avisos ou erros.
- `npm run build`: aprovado com Next.js 16.3.5.
- Rotas atuais `/`, `/blueprint` e `/icon.svg` pré-renderizadas estaticamente.
- Material Symbols servido por fonte local, sem dependência de CDN para os ícones.
- Auditoria do npm: 0 vulnerabilidades.
