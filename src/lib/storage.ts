import { Lead, RelatorioVisita, PlanejamentoSemanal, PlanejamentoDia } from "@/types";

// Storage keys
const LEADS_KEY = "vs:leads";
const VISITS_KEY = "vs:visitas";

// Generic helpers
const reviveDates = <T extends Record<string, any>>(obj: T, keys: string[] = []): T => {
  const cloned: any = { ...obj };
  for (const k of keys) {
    if (cloned[k]) cloned[k] = new Date(cloned[k]);
  }
  return cloned;
};

export function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map((l) =>
      reviveDates<Lead>(l, ["dataCadastro", "dataUltimaAtualizacao"]) as Lead
    );
  } catch {
    return [];
  }
}

export function saveLeads(leads: Lead[]) {
  const serializable = leads.map((l) => ({
    ...l,
    dataCadastro: l.dataCadastro instanceof Date ? l.dataCadastro.toISOString() : l.dataCadastro,
    dataUltimaAtualizacao:
      l.dataUltimaAtualizacao instanceof Date
        ? l.dataUltimaAtualizacao.toISOString()
        : l.dataUltimaAtualizacao,
  }));
  localStorage.setItem(LEADS_KEY, JSON.stringify(serializable));
}

export function seedLeadsIfEmpty(seed: Lead[]) {
  const existing = loadLeads();
  if (existing.length === 0) {
    saveLeads(seed);
  }
}

export function upsertLead(leads: Lead[], updated: Lead): Lead[] {
  const idx = leads.findIndex((l) => l.id === updated.id);
  if (idx === -1) return [...leads, updated];
  const copy = [...leads];
  copy[idx] = updated;
  return copy;
}

export function deleteLead(leads: Lead[], id: string): Lead[] {
  return leads.filter((l) => l.id !== id);
}

// Week helpers (ISO week starting Monday)
export function getWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday in current week decides the year.
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}

export function getWeekRange(weekKey: string): { start: Date; end: Date } {
  const [yearStr, wStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(wStr, 10);
  // Find Monday of week 1
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay();
  const monday = new Date(simple);
  const diff = (dow <= 1 ? 1 - dow : 8 - dow); // adjust to Monday
  monday.setUTCDate(simple.getUTCDate() + diff);
  const start = new Date(monday);
  const end = new Date(monday);
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
}

// Visits storage
export function loadVisits(): RelatorioVisita[] {
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map((v) => reviveDates<RelatorioVisita>(v, ["data"]) as RelatorioVisita);
  } catch {
    return [];
  }
}

export function saveVisits(visits: RelatorioVisita[]) {
  const serializable = visits.map((v) => ({
    ...v,
    data: v.data instanceof Date ? v.data.toISOString() : v.data,
  }));
  localStorage.setItem(VISITS_KEY, JSON.stringify(serializable));
}

export function addVisit(visit: Omit<RelatorioVisita, "id">): RelatorioVisita {
  const visits = loadVisits();
  const full: RelatorioVisita = { ...visit, id: Date.now().toString() } as RelatorioVisita;
  visits.push(full);
  saveVisits(visits);
  return full;
}

export function getVisitsByWeek(weekKey: string): RelatorioVisita[] {
  const { start, end } = getWeekRange(weekKey);
  return loadVisits().filter((v) => v.data >= start && v.data <= end);
}

// Planejamento storage (per week)
export function loadPlanejamento(weekKey: string): PlanejamentoSemanal {
  const key = `vs:planejamento:${weekKey}`;
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw) as PlanejamentoSemanal;
  const vazio: PlanejamentoSemanal = {
    id: weekKey,
    semana: weekKey,
    segunda: { bairroFoco: "", tiposEmpresasAlvo: "", metaOrcamentos: 0, metaVisitas: 0 },
    terca: { bairroFoco: "", tiposEmpresasAlvo: "", metaOrcamentos: 0, metaVisitas: 0 },
    quarta: { bairroFoco: "", tiposEmpresasAlvo: "", metaOrcamentos: 0, metaVisitas: 0 },
    quinta: { bairroFoco: "", tiposEmpresasAlvo: "", metaOrcamentos: 0, metaVisitas: 0 },
    sexta: { bairroFoco: "", tiposEmpresasAlvo: "", metaOrcamentos: 0, metaVisitas: 0 },
  };
  return vazio;
}

export function savePlanejamento(weekKey: string, data: PlanejamentoSemanal) {
  const key = `vs:planejamento:${weekKey}`;
  localStorage.setItem(key, JSON.stringify(data));
}

