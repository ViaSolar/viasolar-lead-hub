import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadForm } from "./LeadForm";
import { Lead } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, Mail, MapPin, DollarSign } from "lucide-react";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Partial<Lead>;
  onSubmit: (data: any) => void;
  mode?: "edit" | "view";
  onEditClick?: () => void;
}

export const LeadModal = ({ open, onOpenChange, lead, onSubmit, mode = "edit", onEditClick }: LeadModalProps) => {
  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const formatCurrency = (value?: number) =>
    typeof value === "number"
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
      : "-";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold text-primary">
            {mode === "view" ? "Detalhes do Lead" : lead?.id ? "Editar Lead" : "Novo Lead"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {mode === "view" && lead ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{lead.nomeEmpresa}</h2>
                    <div className="text-sm text-muted-foreground">{lead.nomeResponsavel}</div>
                    {lead.bairro && (
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{lead.bairro}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{lead.tipoRelogio}</Badge>
                    <Badge variant="secondary">{lead.etapa?.replace(/-/g, " ")}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Telefone</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{lead.telefone}</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/55${(lead.telefone || '').replace(/\D/g, '')}`, '_blank')}>
                        <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">E-mail</div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{lead.email || '-'}</span>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Conta de Luz</div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">{formatCurrency(lead.valorContaLuz)}</span>
                    </div>
                  </div>
                </div>

                {lead.endereco && (
                  <div className="p-4 border rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Endereço</div>
                    <div className="text-sm">{lead.endereco}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {lead.fotoConta && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Foto da Conta</div>
                      <img src={lead.fotoConta} alt="Foto da conta" className="rounded-lg border max-h-56 object-cover" />
                    </div>
                  )}
                  {lead.fotoFachada && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Foto da Fachada</div>
                      <img src={lead.fotoFachada} alt="Foto da fachada" className="rounded-lg border max-h-56 object-cover" />
                    </div>
                  )}
                  {lead.propostaPdf && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Proposta</div>
                      <Button variant="outline" onClick={() => window.open(lead.propostaPdf, "_blank")}>Baixar Proposta</Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  {onEditClick && (
                    <Button onClick={onEditClick} className="bg-gradient-primary hover:bg-primary-hover">Editar</Button>
                  )}
                  <Button variant="outline" onClick={handleCancel}>Fechar</Button>
                </div>
              </div>
            ) : (
              <LeadForm 
                lead={lead} 
                onSubmit={handleSubmit} 
                onCancel={handleCancel} 
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};