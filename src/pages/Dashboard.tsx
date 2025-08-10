import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign, 
  Target, 
  MapPin,
  AlertTriangle,
  Crown
} from "lucide-react";
import { getWeekKey, getWeekRange, loadLeads, loadVisits } from "@/lib/storage";

const Dashboard = () => {
  const leads = useMemo(() => loadLeads(), []);
  const visits = useMemo(() => loadVisits(), []);

  const weekKey = getWeekKey();
  const { start, end } = getWeekRange(weekKey);
  const inRange = (d?: Date | string) => {
    if (!d) return false;
    const dt = d instanceof Date ? d : new Date(d);
    return dt >= start && dt <= end;
  };

  const kpisSemanais = useMemo(() => {
    const visitasSemanais = visits.filter((v) => v.data >= start && v.data <= end);
    const empresasCadastradas = leads.filter((l) => inRange(l.dataCadastro)).length;
    const contasRecebidas = leads.filter((l) => l.etapa === "conta-recebida" && inRange(l.dataUltimaAtualizacao)).length;
    const orcamentosApresentados = leads.filter((l) => l.orcamentoApresentado && inRange(l.dataUltimaAtualizacao)).length;
    const propostasWhatsApp = visitasSemanais.filter((v) => v.orcamentoApresentado).length;
    const fechamentos = leads.filter((l) => l.etapa === "fechado" && inRange(l.dataUltimaAtualizacao)).length;
    const valorTotalVendido = leads
      .filter((l) => l.etapa === "fechado" && inRange(l.dataUltimaAtualizacao))
      .reduce((sum, l) => sum + (l.valorOrcamento || 0), 0);
    const ticketMedio = fechamentos > 0 ? Math.round(valorTotalVendido / fechamentos) : 0;
    const taxaConversao = visitasSemanais.length > 0 ? Number(((fechamentos / visitasSemanais.length) * 100).toFixed(1)) : 0;

    return {
      visitasFeitas: visitasSemanais.length,
      empresasCadastradas,
      contasRecebidas,
      orcamentosApresentados,
      propostasWhatsApp,
      fechamentos,
      taxaConversao,
      ticketMedio,
      valorTotalVendido,
    };
  }, [leads, visits, start, end]);

  const evolucaoSemanal = useMemo(() => {
    const arr: { semana: string; orcamentos: number; vendas: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 7);
      const wk = getWeekKey(d);
      const { start: s, end: e } = getWeekRange(wk);
      const orc = leads.filter((l) => l.orcamentoApresentado && ((l.dataUltimaAtualizacao instanceof Date ? l.dataUltimaAtualizacao : new Date(l.dataUltimaAtualizacao)) >= s) && ((l.dataUltimaAtualizacao instanceof Date ? l.dataUltimaAtualizacao : new Date(l.dataUltimaAtualizacao)) <= e)).length;
      const ven = leads.filter((l) => l.etapa === "fechado" && ((l.dataUltimaAtualizacao instanceof Date ? l.dataUltimaAtualizacao : new Date(l.dataUltimaAtualizacao)) >= s) && ((l.dataUltimaAtualizacao instanceof Date ? l.dataUltimaAtualizacao : new Date(l.dataUltimaAtualizacao)) <= e)).length;
      arr.push({ semana: `S${4 - i}`, orcamentos: orc, vendas: ven });
    }
    return arr;
  }, [leads]);

  const topBairros = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 60);
    const prospeccoes = new Map<string, number>();
    const conversoes = new Map<string, number>();

    visits.filter((v) => v.data >= cutoff).forEach((v) => {
      if (!v.bairro) return;
      prospeccoes.set(v.bairro, (prospeccoes.get(v.bairro) || 0) + 1);
    });
    leads.filter((l) => l.etapa === "fechado").forEach((l) => {
      if (!l.bairro) return;
      conversoes.set(l.bairro, (conversoes.get(l.bairro) || 0) + 1);
    });

    const bairros = Array.from(prospeccoes.keys()).map((b) => ({
      bairro: b,
      prospeccoes: prospeccoes.get(b) || 0,
      conversoes: conversoes.get(b) || 0,
    }));

    return bairros.sort((a, b) => b.prospeccoes - a.prospeccoes).slice(0, 5);
  }, [visits, leads]);

  const motivosPerda = useMemo(() => {
    const cores = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#8b5cf6"];
    const map = new Map<string, number>();
    leads.filter((l) => l.etapa === "perdido").forEach((l) => {
      const k = l.motivoNaoApresentacao?.trim() || "Outro";
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).map(([motivo, quantidade], idx) => ({ motivo, quantidade, cor: cores[idx % cores.length] }));
  }, [leads]);

  const gargalosFunil = useMemo(() => {
    const etapas = [
      "novo-contato",
      "conta-recebida",
      "orcamento-apresentado",
      "em-negociacao",
      "fechado",
      "perdido",
    ] as const;
    const map = new Map<string, number>();
    etapas.forEach((e) => map.set(e, 0));
    leads.forEach((l) => map.set(l.etapa, (map.get(l.etapa) || 0) + 1));
    const label = (e: string) => {
      switch (e) {
        case "novo-contato": return "Novo Contato";
        case "conta-recebida": return "Conta Recebida";
        case "orcamento-apresentado": return "Orçamento Apresentado";
        case "em-negociacao": return "Em Negociação";
        case "fechado": return "Fechado";
        case "perdido": return "Perdido";
        default: return e;
      }
    };
    return Array.from(map.entries()).map(([etapa, quantidade]) => ({ etapa: label(etapa), quantidade }));
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de KPIs</h1>
          <p className="text-muted-foreground">Acompanhe sua performance e resultados</p>
        </div>
        <Badge variant="outline" className="bg-accent-light text-accent font-medium">
          <Crown className="w-4 h-4 mr-2" />
          Semana Atual
        </Badge>
      </div>

      {/* KPIs Semanais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">VISITAS</span>
            </div>
            <div className="text-2xl font-bold text-blue-800">{kpisSemanais.visitasFeitas}</div>
            <div className="text-xs text-blue-600">+12% vs semana anterior</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-700">EMPRESAS</span>
            </div>
            <div className="text-2xl font-bold text-green-800">{kpisSemanais.empresasCadastradas}</div>
            <div className="text-xs text-green-600">+5% vs semana anterior</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent-light/40 to-accent-light/20 border-accent-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-accent" />
              <span className="text-xs font-medium text-accent">ORÇAMENTOS</span>
            </div>
            <div className="text-2xl font-bold text-accent">{kpisSemanais.orcamentosApresentados}</div>
            <div className="text-xs text-accent">+25% vs semana anterior</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary-light/40 to-primary-light/20 border-primary-light">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-primary">CONVERSÃO</span>
            </div>
            <div className="text-2xl font-bold text-primary">{kpisSemanais.taxaConversao}%</div>
            <div className="text-xs text-primary">Meta: 8%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">VENDIDO</span>
            </div>
            <div className="text-xl font-bold text-emerald-800">R$ {(kpisSemanais.valorTotalVendido / 1000).toFixed(0)}K</div>
            <div className="text-xs text-emerald-600">Meta: R$ 60K</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Evolução Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={evolucaoSemanal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="orcamentos" stackId="1" stroke="#2563eb" fill="#3b82f6" />
                <Area type="monotone" dataKey="vendas" stackId="1" stroke="#16a34a" fill="#22c55e" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Motivos de Perda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Motivos de Perda</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={motivosPerda}
                  dataKey="quantidade"
                  nameKey="motivo"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ motivo, percent }) => `${motivo}: ${(percent * 100).toFixed(0)}%`}
                >
                  {motivosPerda.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Bairros e Gargalos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Bairros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <MapPin className="w-5 h-5" />
              Top 5 Bairros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBairros.map((bairro, index) => (
                <div key={bairro.bairro} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{bairro.bairro}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {bairro.prospeccoes} prospecções
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {bairro.conversoes} conversões
                    </div>
                    <Progress 
                      value={(bairro.conversoes / bairro.prospeccoes) * 100} 
                      className="w-16"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gargalos do Funil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <AlertTriangle className="w-5 h-5" />
              Gargalos do Funil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gargalosFunil} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="etapa" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;