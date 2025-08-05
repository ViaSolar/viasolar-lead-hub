import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadForm } from "./LeadForm";
import { Lead } from "@/types";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Partial<Lead>;
  onSubmit: (data: any) => void;
}

export const LeadModal = ({ open, onOpenChange, lead, onSubmit }: LeadModalProps) => {
  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold text-primary">
            {lead?.id ? "Editar Lead" : "Novo Lead"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6">
            <LeadForm 
              lead={lead} 
              onSubmit={handleSubmit} 
              onCancel={handleCancel} 
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};