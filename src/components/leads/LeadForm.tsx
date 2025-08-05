import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, FileText, Building2, User, Phone, Mail, MapPin, Zap, DollarSign } from "lucide-react";
import { Lead } from "@/types";

const leadSchema = z.object({
  nomeEmpresa: z.string().min(2, "Nome da empresa é obrigatório"),
  nomeResponsavel: z.string().min(2, "Nome do responsável é obrigatório"),
  telefone: z.string().min(10, "Telefone é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  endereco: z.string().optional(),
  valorContaLuz: z.number().min(1, "Valor da conta é obrigatório"),
  consumoMedio: z.number().optional(),
  tipoRelogio: z.enum(["Monofásico", "Bifásico", "Trifásico", "Agrupado"]),
  orcamentoApresentado: z.boolean(),
  motivoNaoApresentacao: z.string().optional(),
  observacoes: z.string().optional(),
  etapa: z.enum(["novo-contato", "conta-recebida", "orcamento-apresentado", "em-negociacao", "fechado", "perdido"]),
  bairro: z.string().optional(),
  valorOrcamento: z.number().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Partial<Lead>;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
}

export const LeadForm = ({ lead, onSubmit, onCancel }: LeadFormProps) => {
  const [fotoConta, setFotoConta] = useState<File | null>(null);
  const [fotoFachada, setFotoFachada] = useState<File | null>(null);
  const [propostaPdf, setPropostaPdf] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nomeEmpresa: lead?.nomeEmpresa || "",
      nomeResponsavel: lead?.nomeResponsavel || "",
      telefone: lead?.telefone || "",
      email: lead?.email || "",
      endereco: lead?.endereco || "",
      valorContaLuz: lead?.valorContaLuz || 0,
      consumoMedio: lead?.consumoMedio || 0,
      tipoRelogio: lead?.tipoRelogio || "Monofásico",
      orcamentoApresentado: lead?.orcamentoApresentado || false,
      motivoNaoApresentacao: lead?.motivoNaoApresentacao || "",
      observacoes: lead?.observacoes || "",
      etapa: lead?.etapa || "novo-contato",
      bairro: lead?.bairro || "",
      valorOrcamento: lead?.valorOrcamento || 0,
    }
  });

  const orcamentoApresentado = watch("orcamentoApresentado");

  // Dropzone para foto da conta
  const { getRootProps: getRootPropsConta, getInputProps: getInputPropsConta } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFotoConta(acceptedFiles[0]);
    }
  });

  // Dropzone para foto da fachada
  const { getRootProps: getRootPropsFachada, getInputProps: getInputPropsFachada } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFotoFachada(acceptedFiles[0]);
    }
  });

  // Dropzone para proposta PDF
  const { getRootProps: getRootPropsPdf, getInputProps: getInputPropsPdf } = useDropzone({
    accept: { 'application/pdf': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setPropostaPdf(acceptedFiles[0]);
    }
  });

  const onFormSubmit = (data: LeadFormData) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">
          {lead?.id ? "Editar Lead" : "Novo Lead"}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
              <Input 
                id="nomeEmpresa"
                {...register("nomeEmpresa")}
                placeholder="Ex: Padaria São João"
              />
              {errors.nomeEmpresa && (
                <p className="text-sm text-destructive">{errors.nomeEmpresa.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input 
                id="bairro"
                {...register("bairro")}
                placeholder="Ex: Centro"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input 
                id="endereco"
                {...register("endereco")}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informações do Responsável */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Responsável
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeResponsavel">Nome do Responsável *</Label>
              <Input 
                id="nomeResponsavel"
                {...register("nomeResponsavel")}
                placeholder="Ex: João Silva"
              />
              {errors.nomeResponsavel && (
                <p className="text-sm text-destructive">{errors.nomeResponsavel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input 
                id="telefone"
                {...register("telefone")}
                placeholder="(11) 99999-9999"
              />
              {errors.telefone && (
                <p className="text-sm text-destructive">{errors.telefone.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email"
                type="email"
                {...register("email")}
                placeholder="contato@empresa.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Informações Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorContaLuz">Valor da Conta (R$) *</Label>
              <Input 
                id="valorContaLuz"
                type="number"
                step="0.01"
                {...register("valorContaLuz", { valueAsNumber: true })}
                placeholder="850.00"
              />
              {errors.valorContaLuz && (
                <p className="text-sm text-destructive">{errors.valorContaLuz.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="consumoMedio">Consumo Médio (kWh)</Label>
              <Input 
                id="consumoMedio"
                type="number"
                {...register("consumoMedio", { valueAsNumber: true })}
                placeholder="1200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoRelogio">Tipo de Relógio *</Label>
              <Select value={getValues("tipoRelogio")} onValueChange={(value) => setValue("tipoRelogio", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monofásico">Monofásico</SelectItem>
                  <SelectItem value="Bifásico">Bifásico</SelectItem>
                  <SelectItem value="Trifásico">Trifásico</SelectItem>
                  <SelectItem value="Agrupado">Agrupado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Status do Orçamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Status do Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="orcamentoApresentado"
                checked={orcamentoApresentado}
                onCheckedChange={(checked) => setValue("orcamentoApresentado", !!checked)}
              />
              <Label htmlFor="orcamentoApresentado">Orçamento já foi apresentado</Label>
            </div>

            {!orcamentoApresentado && (
              <div className="space-y-2">
                <Label htmlFor="motivoNaoApresentacao">Motivo da não apresentação</Label>
                <Textarea 
                  id="motivoNaoApresentacao"
                  {...register("motivoNaoApresentacao")}
                  placeholder="Descreva o motivo pelo qual o orçamento ainda não foi apresentado"
                />
              </div>
            )}

            {orcamentoApresentado && (
              <div className="space-y-2">
                <Label htmlFor="valorOrcamento">Valor do Orçamento (R$)</Label>
                <Input 
                  id="valorOrcamento"
                  type="number"
                  step="0.01"
                  {...register("valorOrcamento", { valueAsNumber: true })}
                  placeholder="15000.00"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="w-5 h-5 text-primary" />
              Documentos e Fotos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Foto da Conta */}
            <div className="space-y-2">
              <Label>Foto da Conta de Luz</Label>
              <div {...getRootPropsConta()} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <input {...getInputPropsConta()} />
                {fotoConta ? (
                  <div className="space-y-2">
                    <FileImage className="w-8 h-8 mx-auto text-primary" />
                    <p className="text-sm">{fotoConta.name}</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFotoConta(null);
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Clique para upload</p>
                  </div>
                )}
              </div>
            </div>

            {/* Foto da Fachada */}
            <div className="space-y-2">
              <Label>Foto da Fachada/Telhado</Label>
              <div {...getRootPropsFachada()} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <input {...getInputPropsFachada()} />
                {fotoFachada ? (
                  <div className="space-y-2">
                    <FileImage className="w-8 h-8 mx-auto text-primary" />
                    <p className="text-sm">{fotoFachada.name}</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFotoFachada(null);
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Clique para upload</p>
                  </div>
                )}
              </div>
            </div>

            {/* Proposta PDF */}
            <div className="space-y-2">
              <Label>Proposta em PDF</Label>
              <div {...getRootPropsPdf()} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <input {...getInputPropsPdf()} />
                {propostaPdf ? (
                  <div className="space-y-2">
                    <FileText className="w-8 h-8 mx-auto text-primary" />
                    <p className="text-sm">{propostaPdf.name}</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPropostaPdf(null);
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Clique para upload</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes"
                {...register("observacoes")}
                placeholder="Informações adicionais sobre o lead..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover">
            {lead?.id ? "Atualizar" : "Criar"} Lead
          </Button>
        </div>
      </form>
    </div>
  );
};