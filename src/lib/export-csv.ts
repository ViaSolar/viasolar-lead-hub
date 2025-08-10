import { Lead } from "@/types";

function escapeCsv(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value).replace(/"/g, '""');
  if (/[",\n]/.test(str)) return `"${str}"`;
  return str;
}

export function exportLeadsToCsv(leads: Lead[], filename = "leads.csv") {
  const headers = [
    "id",
    "nomeEmpresa",
    "nomeResponsavel",
    "telefone",
    "email",
    "endereco",
    "bairro",
    "valorContaLuz",
    "consumoMedio",
    "tipoRelogio",
    "orcamentoApresentado",
    "motivoNaoApresentacao",
    "valorOrcamento",
    "etapa",
    "dataCadastro",
    "dataUltimaAtualizacao",
  ];

  const rows = leads.map((l) => [
    l.id,
    l.nomeEmpresa,
    l.nomeResponsavel,
    l.telefone,
    l.email ?? "",
    l.endereco ?? "",
    l.bairro ?? "",
    l.valorContaLuz,
    l.consumoMedio ?? "",
    l.tipoRelogio,
    l.orcamentoApresentado,
    l.motivoNaoApresentacao ?? "",
    l.valorOrcamento ?? "",
    l.etapa,
    l.dataCadastro instanceof Date ? l.dataCadastro.toISOString() : l.dataCadastro,
    l.dataUltimaAtualizacao instanceof Date ? l.dataUltimaAtualizacao.toISOString() : l.dataUltimaAtualizacao,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
