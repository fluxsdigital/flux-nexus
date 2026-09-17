import { Icon } from "./Icon";

function Dashboard() {
  return <div className="dashboard"><div className="windowbar"><span className="dots">● ● ●</span><small>NR NEXUS — Painel Operacional v2.4</small><span>•••</span></div>
    <div className="dashBody"><div className="dashTitle"><div><small>VISÃO GERAL</small><b>Painel Operacional</b></div><button>+ Nova inspeção</button></div>
      <div className="stats"><div><small>Aguardando</small><b>08</b></div><div><small>Em andamento</small><b>05</b></div><div><small>Concluídas</small><b>24</b></div><div><small>Laudos pendentes</small><b>03</b></div></div>
      <div className="inspection"><div className="tableHead"><b>Inspeções recentes</b><span>Ver todas →</span></div>{[["VP-12-C","Indústria Alpha","Em andamento"],["CAL-04","Metalúrgica Sul","Concluída"],["TQ-08","Petroquímica BR","Aguardando"]].map((r,i)=><div className="tableRow" key={r[0]}><span className="tag">{r[0]}</span><span>{r[1]}</span><span className={`pill p${i}`}>{r[2]}</span></div>)}</div>
    </div><div className="telemetry"><span><i/> SISTEMA OPERACIONAL</span><span>SYNC 99.9%</span></div></div>;
}

export function Hero() {
  return <section className="hero blueprint" id="top"><div className="scan"/><div className="container heroGrid"><div className="heroCopy">
    <span className="eyebrow cyan"><i/> Gestão de Inspeções e Laudos NR-13 <b>Conforme MTE</b></span>
    <h1>Suas inspeções e laudos técnicos, <span>em um só lugar.</span></h1>
    <p>Gerencie empresas, equipamentos, inspeções e emissão de laudos técnicos com muito mais organização, governança e controle operacional.</p>
    <div className="actions"><a className="button" href="#comecar">Começar agora <Icon name="arrow"/></a><a className="button secondary" href="#como-funciona"><Icon name="play"/> Ver demonstração interativa</a></div>
    <div className="assurance"><Icon name="check"/> Feito para a rotina de engenheiros mecânicos e inspetores NR-13.</div>
    <div className="heroMetrics"><div><b>+1.200</b><span>Laudos organizados</span></div><div><b className="cyanText">100%</b><span>Conformidade NR-13</span></div><div><b>Zero</b><span>Planilhas soltas</span></div></div>
  </div><div className="dashWrap"><div className="floatBadge top"><i/>14 Concluídas este mês <b>+18%</b></div><Dashboard/><div className="floatBadge bottom"><Icon name="factory"/><span><b>Inspeção In Loco</b><small>TAG: VP-12-C • Caldeiras e Vasos</small></span></div></div></div></section>;
}
