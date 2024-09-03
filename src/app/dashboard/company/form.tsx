"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, queryClient } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { GET_COMPANIES } from "~/app/constants";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CompanyRequest, companySchema } from "~/lib/schemas/company.schema";

type FormProps = {
  company?: CompanyRequest;
  onClose: (open: boolean) => void;
};
export function FormCompany({ company, onClose }: FormProps) {
  const { toast } = useToast();
  const form = useForm<CompanyRequest>({
    resolver: zodResolver(companySchema),
    defaultValues: company,
  });

  const { mutate: create } = api.company.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_COMPANIES],
      });
      onClose(false);
      toast({
        title: "Sucesso",
        description: "Empresa salva com sucesso",
      });
    },
  });
  const { mutate: update } = api.company.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_COMPANIES],
      });
      onClose(false);
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso",
      });
    },
  });

  const handleSave = async (data: CompanyRequest) => {
    if (company?.id) {
      update({ ...data, id: company.id });
    } else {
      create({ ...data });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="flex flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col space-y-3">
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex content-end justify-end pt-4">
            <Button className="pt-2" type="submit" disabled={false}>
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </>
    
  );
}
