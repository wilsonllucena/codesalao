"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, queryClient } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import {
  type ServiceRequest,
  serviceSchema,
} from "~/lib/schemas/service.schema";
import { GET_SERVICES } from "~/app/constants";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { formatCurrency } from "~/utils/currency";

type FormProps = {
  service?: ServiceRequest;
  onClose: (open: boolean) => void;
};
export function FormService({ service, onClose }: FormProps) {
  const { toast } = useToast();
  const form = useForm<ServiceRequest>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service,
  });

  const { mutate: create } = api.service.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_SERVICES],
      });
      onClose(false);
      toast({
        title: "Serviço salvo",
        description: "Serviço salvo com sucesso",
      });
    },
  });
  const { mutate: update } = api.service.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_SERVICES],
      });
      onClose(false);
      toast({
        title: "Serviço atualizado",
        description: "Serviço atualizado com sucesso",
      });
    },
  });

  const handleSave = async (data: ServiceRequest) => {
    if (service?.id) {
      update({ ...data, id: service.id });
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="R$ 0,00"
                        {...field}
                        value={formatCurrency(field.value)}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          field.onChange(rawValue);
                        }}
                      />
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
    // <>
    //   <form
    //     onSubmit={handleSubmit(handleSave)}
    //     name="formClient"
    //     className="flex flex-1 flex-col"
    //   >
    //     <div className="flex flex-1 flex-col space-y-3">
    //       <div className="space-y-1">
    //         <Label htmlFor="name" className="text-right">
    //           Nome
    //         </Label>
    //         <Input {...register("name")} className="col-span-3" />
    //         <span className="text-xs text-red-500">
    //           {errors.name ? errors.name.message : ""}
    //         </span>
    //       </div>
    //       <div className="space-y-1">
    //         <Label htmlFor="price" className="text-right">
    //           Preço
    //         </Label>
    //         <Input {...register("price")} className="col-span-3" />
    //         <span className="text-xs text-red-500">
    //           {errors.price ? errors.price.message : ""}
    //         </span>
    //       </div>
    //       <div className="space-y-1">
    //         <Label htmlFor="username" className="text-right">
    //           Descriçao
    //         </Label>
    //         <Input {...register("description")} className="col-span-3" />
    //         <span className="text-xs text-red-500">
    //           {errors.description ? errors.description.message : ""}
    //         </span>
    //       </div>
    //     </div>

    //     <div className="flex content-end justify-end pt-4">
    //       <Button className="pt-2" type="submit">
    //         Salvar
    //       </Button>
    //     </div>
    //   </form>
    // </>
  );
}
