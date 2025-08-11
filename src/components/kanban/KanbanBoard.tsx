import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  MessageCircle,
  Calendar,
  DollarSign,
  Building2,
  User,
  FileImage,
  Plus,
  Search,
  Edit,
} from "lucide-react";
import { Lead } from "@/types";
import { cn } from "@/lib/utils";
import { LeadModal } from "@/components/leads/LeadModal";
import { toast } from "@/hooks/use-toast";
import { loadLeads, saveLeads, seedLeadsIfEmpty } from "@/lib/storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { exportLeadsToCsv } from "@/lib/export-csv";

// Mock data para demonstração
const mockLeads: Lead[] = [
  {
    id: "1",
    nomeEmpresa: "Padaria São João",
    nomeResponsavel: "João Silva",
    telefone: "(11) 99999-1234",
    email: "joao@padariasaojoao.com",
    valorContaLuz: 850,
    tipoRelogio: "Trifásico",
    orcamentoApresentado: false,
    etapa: "novo-contato",
    dataCadastro: new Date("2024-01-08"),
    dataUltimaAtualizacao: new Date("2024-01-08"),
    bairro: "Centro"
  },
  {
    id: "2",
    nomeEmpresa: "Metalúrgica ABC",
    nomeResponsavel: "Maria Santos",
    telefone: "(11) 98888-5678",
    valorContaLuz: 2300,
    tipoRelogio: "Trifásico",
    orcamentoApresentado: true,
    etapa: "conta-recebida",
    dataCadastro: new Date("2024-01-07"),
    dataUltimaAtualizacao: new Date("2024-01-08"),
    bairro: "Industrial"
  },
  {
    id: "3",
    nomeEmpresa: "Restaurante Bella Vista",
    nomeResponsavel: "Carlos Lima",
    telefone: "(11) 97777-9012",
    valorContaLuz: 1200,
    tipoRelogio: "Bifásico",
    orcamentoApresentado: true,
    etapa: "orcamento-apresentado",
    dataCadastro: new Date("2024-01-05"),
    dataUltimaAtualizacao: new Date("2024-01-08"),
    bairro: "Jardim América",
    valorOrcamento: 18000
  },
  {
    id: "4",
    nomeEmpresa: "Auto Peças Rapid",
    nomeResponsavel: "Ana Costa",
    telefone: "(11) 96666-3456",
    valorContaLuz: 950,
    tipoRelogio: "Trifásico",
    orcamentoApresentado: true,
    etapa: "em-negociacao",
    dataCadastro: new Date("2024-01-03"),
    dataUltimaAtualizacao: new Date("2024-01-08"),
    bairro: "Vila Nova",
    valorOrcamento: 15000
  },
  {
    id: "5",
    nomeEmpresa: "Supermercado Econômico",
    nomeResponsavel: "Roberto Oliveira",
    telefone: "(11) 95555-7890",
    valorContaLuz: 3500,
    tipoRelogio: "Trifásico",
    orcamentoApresentado: true,
    etapa: "fechado",
    dataCadastro: new Date("2024-01-01"),
    dataUltimaAtualizacao: new Date("2024-01-07"),
    bairro: "Centro",
    valorOrcamento: 45000
  }
];

const colunas = [
  { 
    id: "novo-contato", 
    titulo: "Novo Contato", 
    cor: "bg-blue-100 border-blue-200",
    badge: "bg-blue-500"
  },
  { 
    id: "conta-recebida", 
    titulo: "Conta Recebida", 
    cor: "bg-amber-100 border-amber-200",
    badge: "bg-amber-500"
  },
  { 
    id: "orcamento-apresentado", 
    titulo: "Orçamento Apresentado", 
    cor: "bg-purple-100 border-purple-200",
    badge: "bg-purple-500"
  },
  { 
    id: "em-negociacao", 
    titulo: "Em Negociação", 
    cor: "bg-orange-100 border-orange-200",
    badge: "bg-orange-500"
  },
  { 
    id: "fechado", 
    titulo: "Fechado", 
    cor: "bg-green-100 border-green-200",
    badge: "bg-green-500"
  },
  { 
    id: "perdido", 
    titulo: "Perdido / Não Apresentado", 
    cor: "bg-red-100 border-red-200",
    badge: "bg-red-500"
  }
];

interface LeadCardProps {
  lead: Lead;
  index: number;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

const LeadCard = ({ lead, index, onEdit, onView }: LeadCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "mb-3 transition-all duration-200",
            snapshot.isDragging && "rotate-2 scale-105"
          )}
        >
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onView(lead)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(lead.nomeResponsavel)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{lead.nomeEmpresa}</h4>
                      <p className="text-xs text-muted-foreground truncate">{lead.nomeResponsavel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {lead.fotoConta ? (
                      <img
                        src={lead.fotoConta}
                        alt={`Foto da conta - ${lead.nomeEmpresa}`}
                        className="w-6 h-6 rounded object-cover"
                      />
                    ) : (
                      <FileImage className="w-4 h-4 text-accent" />
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-6 h-6 p-0 hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(lead);
                      }}
                    >
                      <Edit className="w-3 h-3 text-primary" />
                    </Button>
                  </div>
                </div>

                {/* Informações principais */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">{formatPhone(lead.telefone)}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-6 h-6 p-0 hover:bg-green-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`, '_blank');
                      }}
                    >
                      <MessageCircle className="w-3 h-3 text-green-600" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-medium">{formatCurrency(lead.valorContaLuz)}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {lead.tipoRelogio}
                    </Badge>
                  </div>

                  {lead.bairro && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">{lead.bairro}</span>
                    </div>
                  )}

                  {lead.valorOrcamento && (
                    <div className="bg-accent-light/20 rounded p-2">
                      <div className="text-xs text-accent font-medium">
                        Orçamento: {formatCurrency(lead.valorOrcamento)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {lead.dataUltimaAtualizacao.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {lead.orcamentoApresentado && (
                      <Badge variant="secondary" className="text-xs">
                        Orçado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export const KanbanBoard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "view">("edit");

  // Filtros
  const [bairroFilter, setBairroFilter] = useState("");
  const [etapaFilter, setEtapaFilter] = useState<Lead["etapa"] | "">("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Seed/load
  useEffect(() => {
    seedLeadsIfEmpty(mockLeads);
    const loaded = loadLeads();
    setLeads(loaded.length ? loaded : mockLeads);
  }, []);
  useEffect(() => {
    if (leads.length) saveLeads(leads);
  }, [leads]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === draggableId
          ? {
              ...lead,
              etapa: destination.droppableId as Lead["etapa"],
              dataUltimaAtualizacao: new Date(),
            }
          : lead
      )
    );
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.nomeResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm);

    const matchesBairro = bairroFilter
      ? (lead.bairro || "").toLowerCase().includes(bairroFilter.toLowerCase())
      : true;

    const matchesEtapa = etapaFilter ? lead.etapa === etapaFilter : true;

    const updatedAt = lead.dataUltimaAtualizacao instanceof Date
      ? lead.dataUltimaAtualizacao
      : new Date(lead.dataUltimaAtualizacao);

    const matchesStart = startDate ? updatedAt >= new Date(startDate) : true;
    const matchesEnd = endDate ? updatedAt <= new Date(endDate + "T23:59:59") : true;

    return matchesSearch && matchesBairro && matchesEtapa && matchesStart && matchesEnd;
  });

  const getLeadsByColumn = (columnId: string) => {
    return filteredLeads.filter(lead => lead.etapa === columnId);
  };

  const getTotalValue = (columnId: string) => {
    const columnLeads = getLeadsByColumn(columnId);
    return columnLeads.reduce((total, lead) => total + (lead.valorOrcamento || lead.valorContaLuz), 0);
  };

  const handleNewLead = () => {
    setSelectedLead(null);
    setViewMode("edit");
    setModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewMode("edit");
    setModalOpen(true);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewMode("view");
    setModalOpen(true);
  };

  const handleSubmitLead = (data: any) => {
    if (selectedLead) {
      // Editando lead existente
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === selectedLead.id 
            ? { ...lead, ...data, dataUltimaAtualizacao: new Date() }
            : lead
        )
      );
      toast({ title: "Lead atualizado com sucesso!" });
    } else {
      // Criando novo lead
      const newLead: Lead = {
        ...data,
        id: Date.now().toString(),
        dataCadastro: new Date(),
        dataUltimaAtualizacao: new Date(),
      };
      setLeads(prevLeads => [...prevLeads, newLead]);
      toast({ title: "Novo lead criado com sucesso!" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Leads</h1>
          <p className="text-muted-foreground">Kanban de vendas VIA SOLAR</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por empresa, responsável ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Input
            placeholder="Bairro"
            value={bairroFilter}
            onChange={(e) => setBairroFilter(e.target.value)}
            className="sm:w-40"
          />

          <Select value={etapaFilter} onValueChange={(v) => setEtapaFilter(v as any)}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Etapa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as Etapas</SelectItem>
              <SelectItem value="novo-contato">Novo Contato</SelectItem>
              <SelectItem value="conta-recebida">Conta Recebida</SelectItem>
              <SelectItem value="orcamento-apresentado">Orçamento Apresentado</SelectItem>
              <SelectItem value="em-negociacao">Em Negociação</SelectItem>
              <SelectItem value="fechado">Fechado</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <Button variant="outline" onClick={() => exportLeadsToCsv(filteredLeads)}>
            Exportar CSV
          </Button>

          <Button
            className="bg-gradient-primary hover:bg-primary-hover"
            onClick={handleNewLead}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
          {colunas.map((coluna) => {
            const columnLeads = getLeadsByColumn(coluna.id);
            const totalValue = getTotalValue(coluna.id);
            
            return (
              <div key={coluna.id} className="min-w-80 md:min-w-0">
                <Card className={cn("h-full", coluna.cor)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">
                        {coluna.titulo}
                      </CardTitle>
                      <Badge className={cn("text-white", coluna.badge)}>
                        {columnLeads.length}
                      </Badge>
                    </div>
                    {totalValue > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Total: R$ {(totalValue / 1000).toFixed(0)}K
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Droppable droppableId={coluna.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "min-h-32 rounded-lg p-2 transition-colors",
                            snapshot.isDraggingOver && "bg-primary-light/20"
                          )}
                        >
                          {columnLeads.map((lead, index) => (
                            <LeadCard 
                              key={lead.id} 
                              lead={lead} 
                              index={index}
                              onEdit={handleEditLead}
                              onView={handleViewLead}
                            />
                          ))}
                          {provided.placeholder}
                          
                          {columnLeads.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Nenhum lead</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal para criar/editar leads */}
      <LeadModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setViewMode("edit");
        }}
        lead={selectedLead}
        onSubmit={handleSubmitLead}
        mode={viewMode}
        onEditClick={() => setViewMode("edit")}
      />
    </div>
  );
};