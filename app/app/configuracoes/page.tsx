"use client";
import Link from "next/link";
import { Icon } from "../../../components/Icon";
import styles from "./settings.module.css";

export default function SettingsPage(){return <><div className="pageHead"><div><small>CONTA E WORKSPACE</small><h1>Configurações</h1><p>Escolha a área que deseja gerenciar.</p></div></div><div className={styles.settingsHub}><Link className={`panel ${styles.settingsCard}`} href="/app/configuracoes/perfil"><span className={styles.cardIcon}><Icon name="user"/></span><div><small>CONTA PESSOAL</small><h2>Seu perfil</h2><p>Atualize sua foto, nome, telefone e registro profissional.</p></div><Icon name="arrow"/></Link><Link className={`panel ${styles.settingsCard}`} href="/app/configuracoes/identidade-visual"><span className={styles.cardIcon}><Icon name="building"/></span><div><small>EMPRESA</small><h2>Identidade visual da empresa</h2><p>Gerencie logotipo, nome e preferências corporativas existentes.</p></div><Icon name="arrow"/></Link></div></>}
