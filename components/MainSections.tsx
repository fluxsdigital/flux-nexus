import { Icon } from "./Icon";

const problems = [
  ["folder","Informações espalhadas","Empresas, equipamentos e inspeções difíceis de acompanhar, dispersos em pastas locais, e-mails e anotações avulsas.","Risco de perda de histórico crítico"],
  ["clipboard","Controle manual","Muito tempo gasto atualizando planilhas e redigindo documentos repetitivos que não se integram entre si.","Horas perdidas em digitação mecânica"],
  ["chart","Laudos pendentes","Dificuldade para saber rapidamente quais inspeções ainda precisam de laudo e prazos de validade quase vencendo.","Insegurança regulatória e atrasos"],
];
const solutions = [
  ["building","Empresas","Cadastre e organize as empresas atendidas com histórico completo de plantas industriais, contatos e vistorias prévias."],
  ["factory","Equipamentos","Mantenha os equipamentos dos seus clientes organizados por categoria, TAG, localização técnica e categoria de risco NR-13."],
  ["clipboard","Inspeções","Registre e acompanhe cada inspeção com checklist estruturado, medição de espessura e registro de evidências."],
  ["file","Laudos Técnicos","Organize a emissão dos laudos após a inspeção com rastreabilidade completa, parecer conclusivo e registro de ART."],
  ["chart","Acompanhamento","Saiba o que está aguardando, em andamento, concluído e pendente de laudo em tempo real."],
];
const steps = [
  ["building","Cadastre","Cadastre as empresas e equipamentos dos seus clientes com todas as especificações técnicas e dados de placa."],
  ["clipboard","Inspecione","Registre as informações da inspeção: dados visuais, ensaios, testes de pressão e medições."],
  ["eye","Acompanhe","Tenha uma visão clara e em tempo real do andamento de cada inspeção e das pendências."],
  ["file","Emita","Organize e agilize a emissão do laudo técnico com parecer, recomendações e próxima inspeção."],
];
const benefits = [
  ["layers","Organização Completa","Todas as informações da sua operação em um único lugar: fichas, prontuários, registros e relatórios."],
  ["chart","Visibilidade Operacional","Saiba exatamente quais inspeções aguardam, estão em andamento ou concluídas, sem pontos cegos."],
  ["gauge","Produtividade Aumentada","Reduza tarefas manuais e o tempo procurando informações em computadores, mensagens e drives."],
  ["shield","Padronização Profissional","Mantenha documentos, registros e processos técnicos consistentes em toda a operação."],
];
const personas = [
  ["wrench","Engenheiros","Organize sua carteira de clientes, equipamentos e inspeções com autonomia, agilidade e precisão normativa."],
  ["clipboard","Profissionais de Inspeção","Registre e acompanhe atividades de campo sem retrabalho, inconsistências ou planilhas perdidas."],
  ["building","Empresas de Engenharia","Centralize operações de múltiplos inspetores com visão gerencial, escala e governança técnica."],
];
const faq = [
  ["O que é o NR Nexus?","Um software SaaS da Flux Soluções Digitais para centralizar empresas, equipamentos, inspeções e laudos técnicos."],
  ["Para quem o NR Nexus foi desenvolvido?","Para engenheiros autônomos, peritos, profissionais de inspeção e empresas de engenharia mecânica e industrial."],
  ["O sistema permite cadastrar empresas e equipamentos?","Sim. Empresas clientes e equipamentos ficam vinculados com TAGs, especificações e histórico de inspeções."],
  ["Consigo acompanhar minhas inspeções e laudos?","Sim. O painel mostra atividades aguardando, em andamento, concluídas e laudos pendentes de emissão."],
  ["O NR Nexus atende à rotina relacionada à NR-13?","Sim. O sistema apoia as rotinas e exigências documentais da NR-13 e organiza informações técnicas essenciais."],
];

function Intro({tag,title,text,center=false}:{tag:string,title:string,text:string,center?:boolean}) { return <div className={`sectionIntro ${center?"center":""}`}><span className="sectionTag">{tag}</span><h2>{title}</h2><p>{text}</p></div>; }

export function MainSections() { return <>
  <section className="section alt microgrid"><div className="container"><Intro center tag="Desafios da Operação Técnica" title="Pare de controlar suas inspeções de forma espalhada." text="Planilhas, documentos, informações de equipamentos e acompanhamento de laudos podem transformar uma rotina técnica em uma operação difícil de controlar."/><div className="grid three">{problems.map(([icon,title,text,foot])=><article className="card problem" key={title}><div className="cardIcon danger"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p><small>× &nbsp;{foot}</small></article>)}</div></div></section>
  <section className="section" id="solucao"><div className="container"><Intro tag="Solução Integrada" title="Tudo o que você precisa para organizar sua operação técnica." text="Do cadastro da empresa à emissão do laudo, o NR Nexus centraliza sua operação em um único sistema feito sob medida."/><div className="solutionGrid">{solutions.map(([icon,title,text],i)=><article className={`card solution s${i}`} key={title}><div className="cardIcon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p><small><Icon name="check"/> Fluxo técnico integrado</small></article>)}</div></div></section>
  <section className="section alt blueprint" id="como-funciona"><div className="container"><Intro center tag="Fluxo Simplificado" title="Da inspeção ao laudo, sem complicação." text="Um roteiro linear e estruturado para você não se perder em burocracias e focar na engenharia."/><div className="grid four steps">{steps.map(([icon,title,text],i)=><article className="card step" key={title}><div className="stepTop"><b>0{i+1}</b><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p><small>Passo {i+1} de 4 <Icon name={i===3?"check":"arrow"}/></small></article>)}</div></div></section>
  <section className="section microgrid" id="recursos"><div className="container"><Intro tag="Ganhos Imediatos" title="Mais controle. Menos trabalho operacional." text="Substitua o estresse de prazos incertos pela tranquilidade de uma gestão técnica centralizada e automatizada."/><div className="grid two">{benefits.map(([icon,title,text])=><article className="card benefit" key={title}><div className="cardIcon"><Icon name={icon}/></div><div><h3>{title}</h3><p>{text}</p><span className="miniTag">Painel unificado</span><span className="miniTag">Acesso rápido</span></div></article>)}</div></div></section>
  <section className="section alt"><div className="container"><Intro center tag="Dashboard Técnico" title="Uma visão completa da sua operação." text="Acompanhe os indicadores que importam para manter inspeções, documentação e prazos sob controle."/><div className="terminal"><div className="terminalBar"><span>● ● ●</span><b>NR NEXUS / OPERATIONS</b><small>ONLINE</small></div><div className="grid four">{[["clipboard","Inspeções em andamento"],["file","Laudos aguardando emissão"],["factory","Gestão completa por TAG"],["building","Módulo de empresas e dados"]].map(([i,t])=><div className="terminalItem" key={t}><Icon name={i}/><h4>{t}</h4><p>Dados técnicos organizados e prontos para sua tomada de decisão.</p></div>)}</div></div></div></section>
  <section className="section blueprint"><div className="container"><Intro center tag="Público-Alvo Especializado" title="Feito para quem vive a rotina de inspeções técnicas." text="Transforme uma rotina técnica complexa em uma operação organizada e controlável."/><div className="grid three">{personas.map(([icon,title,text])=><article className="card persona" key={title}><div className="cardIcon"><Icon name={icon}/></div><h3>{title}</h3><p>{text}</p><small><Icon name="check"/> Histórico técnico seguro</small><small><Icon name="check"/> Processos padronizados</small></article>)}</div></div></section>
  <section className="section alt"><div className="container"><div className="compliance card"><div><span className="sectionTag"><Icon name="shield"/> Alinhamento Normativo Estrito</span><h2>Sua operação organizada dentro de uma rotina alinhada à NR-13.</h2><p>Uma plataforma pensada para inspeções, histórico documental e estruturação técnica da emissão de laudos.</p><div className="checkGrid">{["Rastreabilidade de prontuários","Categorização de fluidos e risco","Controle de periodicidade","Validação das recomendações do PH"].map(x=><span key={x}><Icon name="check"/>{x}</span>)}</div></div><aside><Icon name="shield"/><b>Rigor Regulatório</b><p>Projetado para caldeiras, vasos, tubulações e tanques.</p><small>Padrão NR-13 Atualizado</small></aside></div></div></section>
  <section className="section cta blueprint" id="comecar"><div className="container"><Icon name="rocket"/><h2>Organize suas inspeções.<br/>Simplifique seus laudos.</h2><p>Transforme sua rotina técnica em uma operação organizada, ágil e protegida contra falhas documentais.</p><a href="#top" className="button">Começar agora <Icon name="arrow"/></a><small>Leve sua operação para o próximo nível com o NR Nexus.</small></div></section>
  <section className="section alt microgrid" id="faq"><div className="container"><Intro center tag="Dúvidas Frequentes" title="Perguntas Frequentes" text="Tire suas dúvidas técnicas sobre o funcionamento do NR Nexus."/><div className="faq">{faq.map(([q,a])=><details className="card" key={q}><summary>{q}<Icon name="plus"/></summary><p>{a}</p></details>)}</div></div></section>
  </>; }
