# Flux Nexus

O Flux Nexus é uma plataforma para organizar inspeções técnicas de equipamentos sujeitos à NR-13, reunindo empresas, equipamentos, inspeções e laudos em um fluxo único e rastreável.

## O problema que resolvemos

Engenheiros mecânicos e equipes de inspeção costumam lidar com informações espalhadas entre planilhas, documentos, mensagens e pastas. Isso dificulta acompanhar vencimentos, consultar o histórico de um equipamento e transformar os dados coletados em um laudo técnico organizado.

O Flux Nexus centraliza essa rotina. Cada organização possui seu próprio ambiente, sua equipe e seus registros separados dos demais clientes.

## Para quem é

O produto foi pensado inicialmente para:

- engenheiros mecânicos responsáveis por inspeções NR-13;
- profissionais e empresas de inspeção técnica;
- equipes que administram vasos de pressão, caldeiras, tubulações e outros equipamentos industriais;
- organizações que precisam manter histórico técnico e documentação acessíveis.

## Proposta de valor

O Flux Nexus ajuda o profissional a sair de um processo fragmentado para uma operação simples e estruturada. O sistema acompanha o trabalho desde o cadastro do cliente até a emissão do laudo, preservando o vínculo entre todas as informações.

### Fluxo principal

**Empresas → Equipamentos → Inspeções → Laudos**

1. **Empresas:** registre os clientes e seus dados de contato.
2. **Equipamentos:** associe cada ativo à empresa responsável e mantenha seus dados técnicos.
3. **Inspeções:** conduza o trabalho de campo com identificação, checklist, medições, anomalias, observações e conclusão.
4. **Laudos:** reúna os dados da inspeção em um registro técnico vinculado ao equipamento e à empresa de origem.

## Benefícios

- visão centralizada da operação e das prioridades;
- histórico cronológico de inspeções por equipamento;
- menos risco de perder o vínculo entre cliente, ativo, inspeção e laudo;
- acesso por equipe com papéis e permissões;
- ambientes isolados por organização;
- experiência responsiva para computador, tablet e celular;
- interface escura, direta e adequada à rotina técnica.

## Principais recursos

- landing page comercial;
- criação de organização e conta proprietária;
- login, sessão e logout;
- convite e gestão básica de usuários e papéis;
- visão geral da operação;
- cadastro de empresas e equipamentos;
- fluxo guiado de nova inspeção;
- checklist, medições, evidências, anomalias e conclusão;
- consulta do histórico de inspeções;
- revisão e emissão de laudos no fluxo do sistema;
- navegação responsiva e estados essenciais do MVP.

## Status atual

O Flux Nexus está em fase de MVP.

- A landing page e as telas do Nexus Simple estão publicadas.
- Autenticação, criação de workspace, aceite de convite e gestão de equipe estão implementados no frontend.
- A API multi-tenant está implementada em repositório separado e validada localmente com PostgreSQL.
- Os dados operacionais exibidos nas telas principais ainda utilizam o armazenamento local e os mocks do MVP.
- A conexão da aplicação publicada com a API depende da disponibilização autorizada do backend e da configuração de ambiente.
- Pagamentos, checkout e bloqueios por plano ainda não fazem parte desta versão.
- Recuperação de senha por e-mail ainda não está disponível.

Aplicação: [flux-nexus.vercel.app](https://flux-nexus.vercel.app)

## Desenvolvimento

Frontend construído com Next.js, React e TypeScript. Requer Node.js 20.9 ou superior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_API_URL` define a URL da API. Nenhum segredo deve ser colocado em variáveis públicas do frontend.

Na Vercel, configure a variável de ambiente de produção:

```text
NEXT_PUBLIC_API_URL=https://api.nrnexus.com.br
```

Após alterar essa variável, faça um novo deploy para que o valor seja incorporado ao bundle do Next.js.

### Validação

```bash
npm run lint
npm run build
npm test
```

O deploy da Vercel usa a raiz do repositório e a branch `main`. O material original do Google Stitch permanece fora do repositório e é utilizado somente como referência visual de auditoria.
