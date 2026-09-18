import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  user: <><circle cx="12" cy="8" r="3"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
  play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  factory: <><path d="M3 21V10l6 3V8l6 3V4h6v17Z"/><path d="M7 17h2m3 0h2m3 0h2"/></>,
  file: <><path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v5h5M9 13h6m-6 4h6"/></>,
  chart: <><path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6Z"/><path d="m8 12 3 3 5-6"/></>,
  folder: <path d="M3 6h7l2 2h9v11H3Z"/>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6m-6 4h6"/></>,
  gauge: <><path d="M4 19a9 9 0 1 1 16 0"/><path d="m12 16 4-6"/></>,
  wrench: <><path d="M14 6a4 4 0 0 0-5-3l3 3-3 3-3-3a4 4 0 0 0 5 5l8 8 2-2-8-8"/></>,
  building: <><path d="M4 21V5h10v16M14 9h6v12"/><path d="M8 9h2m-2 4h2m-2 4h2m9 0h-2"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5m-18 4 9 5 9-5"/></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  rocket: <><path d="M14 4c3-2 6-1 6-1s1 3-1 6l-6 6-4-4Z"/><path d="m9 11-4 1-2 3 6 0m4 0v6l3-2 1-4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-6h6v6"/></>,
  equipment: <><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="3"/><path d="M8 17h8m-4-5v5"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  logout: <><path d="M10 5H4v14h6M14 8l4 4-4 4m4-4H8"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  camera: <><path d="M4 7h4l2-3h4l2 3h4v13H4Z"/><circle cx="12" cy="13" r="4"/></>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4"/><path d="M5 21h14"/></>,
  edit: <><path d="m4 20 4-1 11-11-3-3L5 16Z"/><path d="m14 6 3 3"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7"/><path d="M10 11v6m4-6v6"/></>,
  save: <><path d="M5 3h12l2 2v16H5Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></>,
  alert: <><path d="M12 3 2 21h20Z"/><path d="M12 9v5m0 3h.01"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
};

export function Icon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.check}</svg>;
}
