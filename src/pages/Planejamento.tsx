import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Target, MapPin, Building2, Plus } from "lucide-react";
import { getWeekKey, loadPlanejamento, savePlanejamento, getVisitsByWeek, addVisit, getWeekRange, loadLeads } from "@/lib/storage";
import { EditPlanoDiaModal } from "@/components/planejamento/EditPlanoDiaModal";
import { VisitaForm } from "@/components/visitas/VisitaForm";
import { useNavigate } from "react-router-dom";

const Planejamento = () => {
  const navigate = useNavigate();

  const [weekKey, setWeekKey] = useState<string>(getWeekKey());
  const [plano, setPlano] = useState(() => loadPlanejamento(weekKey));
  const [visitas, setVisitas] = useState(() => getVisitsByWeek(weekKey));

  // Modais
  const [editOpen, setEditOpen] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<"segunda" | "terca" | "quarta" | "quinta" | "sexta">("segunda");
  const [visitaOpen, setVisitaOpen] = useState(false);

  useEffect(() => {
    setPlano(loadPlanejamento(weekKey));
    setVisitas(getVisitsByWeek(weekKey));
  }, [weekKey]);

  const { start, end } = getWeekRange(weekKey);
  const diasSemana = useMemo(() => {
    const dias = ["segunda", "terca", "quarta", "quinta", "sexta"] as const;
    const labels = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]; 
    return dias.map((k, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dataStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      return { dia: labels[i], data: dataStr, key: k };
    });
  }, [start]);

  // KPIs semanais calculados
  const leads = loadLeads();
  const estatisticasSemana = useMemo(() => {
    const isInWeek = (dt: Date | string | undefined) => {
      if (!dt) return false;
      const d = dt instanceof Date ? dt : new Date(dt);
      return d >= start && d <= end;
    };

    const contasRecebidas = leads.filter((l) => l.etapa === "conta-recebida" && isInWeek(l.dataUltimaAtualizacao)).length;
    const orcamentosApresentados = leads.filter((l) => l.orcamentoApresentado && isInWeek(l.dataUltimaAtualizacao)).length;
    const vendasFechadas = leads.filter((l) => l.etapa === "fechado" && isInWeek(l.dataUltimaAtualizacao)).length;
    const valorOrcado = leads
      .filter((l) => isInWeek(l.dataUltimaAtualizacao))
      .reduce((sum, l) => sum + (l.valorOrcamento || 0), 0);
    const valorVendido = leads
      .filter((l) => l.etapa === "fechado" && isInWeek(l.dataUltimaAtualizacao))
      .reduce((sum, l) => sum + (l.valorOrcamento || 0), 0);

    const totalVisitas = visitas.length;
    const followUps = visitas.filter((v) => v.abordagemFeita).length;

    return {
      totalVisitas,
      contasRecebidas,
      orcamentosApresentados,
      followUps,
      vendasFechadas,
      valorOrcado,
      valorVendido,
    };
  }, [leads, visitas, start, end]);

  const handleSavePlanoDia = (novo: any) => {
    const atualizado = { ...plano, [diaSelecionado]: novo };
    setPlano(atualizado);
    savePlanejamento(weekKey, atualizado);
  };

  const abrirEdicaoDia = (key: typeof diaSelecionado) => {
    setDiaSelecionado(key);
    setEditOpen(true);
  };

  const prevWeek = () => {
    const newStart = new Date(start);
    newStart.setDate(newStart.getDate() - 7);
    setWeekKey(getWeekKey(newStart));
  };

  const nextWeek = () => {
    const newStart = new Date(start);
    newStart.setDate(newStart.getDate() + 7);
    setWeekKey(getWeekKey(newStart));
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
          <Button variant="outline" onClick={prevWeek}>Anterior</Button>
          <Badge variant="outline" className="bg-primary-light text-primary">
            <CalendarDays className="w-4 h-4 mr-2" />
            Semana {weekKey}
          </Badge>
          <Button variant="outline" onClick={nextWeek}>Próxima</Button>
          <Button className="bg-gradient-primary hover:bg-primary-hover" onClick={() => setVisitaOpen(true)}>
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
          const planoDia = (plano as any)[dia.key] as any;
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
                    <span className="text-sm font-medium">{planoDia.bairroFoco || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="text-sm">{planoDia.tiposEmpresasAlvo || "—"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Orçamentos</span>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {planoDia.metaOrcamentos}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Visitas</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {planoDia.metaVisitas}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => abrirEdicaoDia(dia.key as any)}>
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
            {visitas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma visita registrada nesta semana</p>
                <Button className="mt-3 bg-gradient-primary hover:bg-primary-hover" onClick={() => setVisitaOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Visita
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {visitas.map((v) => (
                  <div key={v.id} className="p-3 border rounded-lg flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{v.nomeEmpresa}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(v.data).toLocaleDateString("pt-BR")} • {v.bairro}
                      </div>
                      <div className="text-xs flex gap-2">
                        <Badge variant="outline" className="text-xs">{v.abordagemFeita ? "Abordado" : "Sem abordagem"}</Badge>
                        <Badge variant="outline" className="text-xs">{v.orcamentoApresentado ? "Orçamento" : "Sem orçamento"}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate("/")}>Ver no Kanban</Button>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button variant="outline" onClick={() => setVisitaOpen(true)}>Adicionar Visita</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <EditPlanoDiaModal
        open={editOpen}
        onOpenChange={setEditOpen}
        value={(plano as any)[diaSelecionado]}
        onSave={handleSavePlanoDia}
        diaLabel={diasSemana.find((d) => d.key === diaSelecionado)?.dia || "Dia"}
      />

      <VisitaForm
        open={visitaOpen}
        onOpenChange={setVisitaOpen}
        onSave={(v) => {
          addVisit(v);
          setVisitas(getVisitsByWeek(weekKey));
        }}
      />
    </div>
  );
};

export default Planejamento;