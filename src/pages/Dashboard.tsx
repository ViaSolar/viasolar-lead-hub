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

const Dashboard = () => {
  // Dados mockados para demonstração
  const kpisSemanais = {
    visitasFeitas: 47,
    empresasCadastradas: 23,
    contasRecebidas: 15,
    orcamentosApresentados: 12,
    propostasWhatsApp: 8,
    fechamentos: 3,
    taxaConversao: 6.4,
    ticketMedio: 15000,
    valorTotalVendido: 45000
  };

  const evolucaoSemanal = [
    { semana: "S1", orcamentos: 8, vendas: 2 },
    { semana: "S2", orcamentos: 12, vendas: 3 },
    { semana: "S3", orcamentos: 10, vendas: 1 },
    { semana: "S4", orcamentos: 15, vendas: 4 },
  ];

  const topBairros = [
    { bairro: "Centro", prospeccoes: 25, conversoes: 8 },
    { bairro: "Jardim América", prospeccoes: 18, conversoes: 5 },
    { bairro: "Vila Nova", prospeccoes: 15, conversoes: 3 },
    { bairro: "Industrial", prospeccoes: 12, conversoes: 4 },
    { bairro: "São José", prospeccoes: 10, conversoes: 2 },
  ];

  const motivosPerda = [
    { motivo: "Preço alto", quantidade: 12, cor: "#ef4444" },
    { motivo: "Não tem interesse", quantidade: 8, cor: "#f97316" },
    { motivo: "Vai pensar", quantidade: 6, cor: "#eab308" },
    { motivo: "Já tem fornecedor", quantidade: 4, cor: "#22c55e" },
  ];

  const gargalosFunil = [
    { etapa: "Novo Contato", quantidade: 25 },
    { etapa: "Conta Recebida", quantidade: 15 },
    { etapa: "Orçamento Apresentado", quantidade: 12 },
    { etapa: "Em Negociação", quantidade: 8 },
    { etapa: "Fechado", quantidade: 3 },
  ];

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