/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import {
  type CompanyRequest,
  companySchema,
} from "~/lib/schemas/company.schema";

type FormProps = {
  company?: CompanyRequest;
  onClose: (open: boolean) => void;
};
export function FormCompany({ company }: FormProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyRequest>({
    resolver: zodResolver(companySchema),
    defaultValues: company,
  });

  const { mutate } = api.company.create.useMutation();
  const { mutate: update } = api.company.update.useMutation();

  const handleSave = async (data: CompanyRequest) => {
    try {
      if (company?.id) {
        update({ ...data, id: company.id });
        toast({
          title: "Unidade atualizada",
          description: "Unidade atualizada com sucesso",
        });
        return;
      }
      mutate({ ...data });
      toast({
        title: "Unidade criada",
        description: "Unidade criada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a unidade",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSave)}
        name="formClient"
        className="flex flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input {...register("name")} className="col-span-3" />
            <span className="text-xs text-red-500">
              {errors.name ? errors.name.message : ""}
            </span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="username" className="text-right">
              Descriçao
            </Label>
            <Input {...register("description")} className="col-span-3" />
            <span className="text-xs text-red-500">
              {errors.description ? errors.description.message : ""}
            </span>
          </div>
        </div>

        <div className="flex content-end justify-end pt-4">
          <Button className="pt-2" type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </>
  );
}
