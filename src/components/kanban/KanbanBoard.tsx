import { useState } from "react";
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
  Filter,
  Search,
  Edit,
  Eye
} from "lucide-react";
import { Lead } from "@/types";
import { cn } from "@/lib/utils";
import { LeadModal } from "@/components/leads/LeadModal";
import { StatsCard } from "@/components/ui/stats-card";
import { toast } from "sonner";

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
                    {lead.fotoConta && (
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
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "view">("edit");

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === draggableId 
          ? { ...lead, etapa: destination.droppableId as Lead['etapa'] }
          : lead
      )
    );
  };

  const filteredLeads = leads.filter(lead => 
    lead.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.nomeResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.telefone.includes(searchTerm)
  );

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
      toast.success("Lead atualizado com sucesso!");
    } else {
      // Criando novo lead
      const newLead: Lead = {
        ...data,
        id: Date.now().toString(),
        dataCadastro: new Date(),
        dataUltimaAtualizacao: new Date(),
      };
      setLeads(prevLeads => [...prevLeads, newLead]);
      toast.success("Novo lead criado com sucesso!");
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
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por empresa, responsável ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
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
        onOpenChange={setModalOpen}
        lead={selectedLead}
        onSubmit={handleSubmitLead}
      />
    </div>
  );
};