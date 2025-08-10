import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RelatorioVisita } from "@/types";

interface VisitaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (value: Omit<RelatorioVisita, "id">) => void;
}

export const VisitaForm = ({ open, onOpenChange, onSave }: VisitaFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const abordagemFeita = (data.get("abordagemFeita") as string) === "on";
    const orcamentoApresentado = (data.get("orcamentoApresentado") as string) === "on";

    const novo: Omit<RelatorioVisita, "id"> = {
      data: new Date(String(data.get("data")) || new Date().toISOString()),
      nomeEmpresa: String(data.get("nomeEmpresa") || ""),
      bairro: String(data.get("bairro") || ""),
      abordagemFeita,
      orcamentoApresentado,
      observacoes: String(data.get("observacoes") || "") || undefined,
      motivoNaoApresentacao: !orcamentoApresentado ? String(data.get("motivoNaoApresentacao") || "") || undefined : undefined,
      leadId: String(data.get("leadId") || "") || undefined,
    };

    onSave(novo);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Registrar Visita</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input id="data" name="data" type="date" defaultValue={new Date().toISOString().slice(0,10)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" name="bairro" placeholder="Ex: Centro" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
            <Input id="nomeEmpresa" name="nomeEmpresa" placeholder="Ex: Padaria São João" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="abordagemFeita" name="abordagemFeita" />
              <Label htmlFor="abordagemFeita">Abordagem feita</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="orcamentoApresentado" name="orcamentoApresentado" />
              <Label htmlFor="orcamentoApresentado">Orçamento apresentado</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" name="observacoes" rows={3} placeholder="Anotações sobre a visita" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivoNaoApresentacao">Motivo da não apresentação (se aplicável)</Label>
            <Input id="motivoNaoApresentacao" name="motivoNaoApresentacao" placeholder="Ex: Sem decisão, preço, etc." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadId">Vincular ao Lead (ID opcional)</Label>
            <Input id="leadId" name="leadId" placeholder="Cole o ID do Lead (opcional)" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
