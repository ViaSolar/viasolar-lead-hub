import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlanejamentoDia } from "@/types";

interface EditPlanoDiaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: PlanejamentoDia;
  onSave: (value: PlanejamentoDia) => void;
  diaLabel: string;
}

export const EditPlanoDiaModal = ({ open, onOpenChange, value, onSave, diaLabel }: EditPlanoDiaModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const novo: PlanejamentoDia = {
      bairroFoco: String(data.get("bairroFoco") || ""),
      tiposEmpresasAlvo: String(data.get("tiposEmpresasAlvo") || ""),
      metaOrcamentos: Number(data.get("metaOrcamentos") || 0),
      metaVisitas: Number(data.get("metaVisitas") || 0),
    };
    onSave(novo);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Editar Plano - {diaLabel}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bairroFoco">Bairro/Região foco</Label>
            <Input id="bairroFoco" name="bairroFoco" defaultValue={value.bairroFoco} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiposEmpresasAlvo">Tipos de empresas alvo</Label>
            <Input id="tiposEmpresasAlvo" name="tiposEmpresasAlvo" defaultValue={value.tiposEmpresasAlvo} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metaOrcamentos">Meta de orçamentos</Label>
              <Input id="metaOrcamentos" name="metaOrcamentos" type="number" min={0} defaultValue={value.metaOrcamentos} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaVisitas">Meta de visitas</Label>
              <Input id="metaVisitas" name="metaVisitas" type="number" min={0} defaultValue={value.metaVisitas} />
            </div>
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
