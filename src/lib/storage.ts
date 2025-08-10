import { Lead, RelatorioVisita } from "@/types";

// Storage keys
const LEADS_KEY = "vs:leads";

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
