// Tipos para a plataforma VIA SOLAR

export interface Lead {
  id: string;
  nomeEmpresa: string;
  nomeResponsavel: string;
  telefone: string;
  email?: string;
  endereco?: string;
  valorContaLuz: number;
  consumoMedio?: number;
  tipoRelogio: 'Monofásico' | 'Bifásico' | 'Trifásico' | 'Agrupado';
  orcamentoApresentado: boolean;
  motivoNaoApresentacao?: string;
  observacoes?: string;
  fotoConta?: string;
  fotoFachada?: string;
  propostaPdf?: string;
  etapa: 'novo-contato' | 'conta-recebida' | 'orcamento-apresentado' | 'em-negociacao' | 'fechado' | 'perdido';
  dataCadastro: Date;
  dataUltimaAtualizacao: Date;
  bairro?: string;
  valorOrcamento?: number;
}

export interface PlanejamentoSemanal {
  id: string;
  semana: string; // YYYY-WW
  segunda: PlanejamentoDia;
  terca: PlanejamentoDia;
  quarta: PlanejamentoDia;
  quinta: PlanejamentoDia;
  sexta: PlanejamentoDia;
}

export interface PlanejamentoDia {
  bairroFoco: string;
  tiposEmpresasAlvo: string;
  metaOrcamentos: number;
  metaVisitas: number;
}

export interface RelatorioVisita {
  id: string;
  data: Date;
  nomeEmpresa: string;
  bairro: string;
  abordagemFeita: boolean;
  orcamentoApresentado: boolean;
  observacoes?: string;
  motivoNaoApresentacao?: string;
  leadId?: string;
}

export interface KPISemanal {
  semana: string;
  visitasFeitas: number;
  empresasCadastradas: number;
  contasRecebidas: number;
  orcamentosApresentados: number;
  propostasEnviadas: number;
  fechamentos: number;
  taxaConversao: number;
  ticketMedio: number;
  valorTotalVendido: number;
}

export interface KPIMensal {
  mes: string;
  evolucaoSemanal: Array<{
    semana: string;
    orcamentos: number;
    vendas: number;
  }>;
  topBairros: Array<{
    bairro: string;
    prospeccoes: number;
    conversoes: number;
  }>;
  motivosPerda: Array<{
    motivo: string;
    quantidade: number;
  }>;
  gargalosFunil: Array<{
    etapa: string;
    quantidade: number;
  }>;
}

export type NavSection = 'kanban' | 'planejamento' | 'dashboard';