import Image from "next/image";
import { Icon } from "./Icon";

export function Header() {
  return <header className="siteHeader"><div className="container navWrap">
    <a href="#top" className="brand" aria-label="NR Nexus, início"><Image src="/nr-nexus-logo.png" width={512} height={512} alt="NR Nexus" priority/><b>NR NEXUS</b><em>NR-13</em></a>
    <nav aria-label="Principal"><a href="#solucao">{"// Solução"}</a><a href="#recursos">{"// Recursos"}</a><a href="#como-funciona">{"// Como funciona"}</a><a href="#faq">{"// FAQ"}</a></nav>
    <div className="headerActions"><span className="status"><i/>SYS.OK</span><a className="button small" href="#comecar">Começar agora</a><span className="iconButton"><Icon name="user"/></span></div>
  </div></header>;
}
