import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Target, MapPin, Building2, Plus } from "lucide-react";

const Planejamento = () => {
  const [semanaAtual] = useState("2024-W1");

  const diasSemana = [
    { dia: "Segunda", data: "08/01", key: "segunda" },
    { dia: "Terça", data: "09/01", key: "terca" },
    { dia: "Quarta", data: "10/01", key: "quarta" },
    { dia: "Quinta", data: "11/01", key: "quinta" },
    { dia: "Sexta", data: "12/01", key: "sexta" },
  ];

  const planejamento = {
    segunda: { bairroFoco: "Centro", tiposEmpresasAlvo: "Comércio", metaOrcamentos: 5, metaVisitas: 15 },
    terca: { bairroFoco: "Jardim América", tiposEmpresasAlvo: "Indústria", metaOrcamentos: 3, metaVisitas: 12 },
    quarta: { bairroFoco: "Vila Nova", tiposEmpresasAlvo: "Serviços", metaOrcamentos: 4, metaVisitas: 10 },
    quinta: { bairroFoco: "Centro", tiposEmpresasAlvo: "Comércio", metaOrcamentos: 6, metaVisitas: 18 },
    sexta: { bairroFoco: "Industrial", tiposEmpresasAlvo: "Indústria", metaOrcamentos: 4, metaVisitas: 14 },
  };

  const estatisticasSemana = {
    totalVisitas: 45,
    contasRecebidas: 12,
    orcamentosApresentados: 8,
    followUps: 6,
    vendasFechadas: 2,
    valorOrcado: 125000,
    valorVendido: 45000,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planejamento Semanal</h1>
          <p className="text-muted-foreground">Organize sua semana e acompanhe resultados</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary-light text-primary">
            <CalendarDays className="w-4 h-4 mr-2" />
            Semana {semanaAtual}
          </Badge>
          <Button className="bg-gradient-primary hover:bg-primary-hover">
            <Plus className="w-4 h-4 mr-2" />
            Nova Visita
          </Button>
        </div>
      </div>

      {/* Resumo da Semana */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="bg-gradient-to-br from-primary-light/20 to-primary-light/10 border-primary-light">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{estatisticasSemana.totalVisitas}</div>
            <div className="text-xs text-muted-foreground">Visitas Feitas</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent-light/20 to-accent-light/10 border-accent-light">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{estatisticasSemana.contasRecebidas}</div>
            <div className="text-xs text-muted-foreground">Contas Recebidas</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{estatisticasSemana.orcamentosApresentados}</div>
            <div className="text-xs text-muted-foreground">Orçamentos</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{estatisticasSemana.followUps}</div>
            <div className="text-xs text-muted-foreground">Follow-ups</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{estatisticasSemana.vendasFechadas}</div>
            <div className="text-xs text-muted-foreground">Vendas</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary-light/20 to-primary-light/10 border-primary-light">
          <CardContent className="p-4">
            <div className="text-lg font-bold text-primary">R$ {(estatisticasSemana.valorOrcado / 1000).toFixed(0)}K</div>
            <div className="text-xs text-muted-foreground">Valor Orçado</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent-light/20 to-accent-light/10 border-accent-light">
          <CardContent className="p-4">
            <div className="text-lg font-bold text-accent">R$ {(estatisticasSemana.valorVendido / 1000).toFixed(0)}K</div>
            <div className="text-xs text-muted-foreground">Valor Vendido</div>
          </CardContent>
        </Card>
      </div>

      {/* Planejamento por Dia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {diasSemana.map((dia) => {
          const plano = planejamento[dia.key as keyof typeof planejamento];
          return (
            <Card key={dia.key} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-primary">{dia.dia}</CardTitle>
                <p className="text-sm text-muted-foreground">{dia.data}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{plano.bairroFoco}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="text-sm">{plano.tiposEmpresasAlvo}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Orçamentos</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {plano.metaOrcamentos}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Visitas</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {plano.metaVisitas}
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4">
                  Editar Plano
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Relatório de Visitas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary">Relatório de Visitas</CardTitle>
          <p className="text-muted-foreground">Registre suas visitas realizadas</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Lista de visitas seria aqui */}
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma visita registrada hoje</p>
              <Button className="mt-3 bg-gradient-primary hover:bg-primary-hover">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Visita
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Planejamento;