"use client";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ClientRequest, clientSchema } from "~/lib/schemas/client-schema";
import { api, queryClient } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { GET_CLIENTS } from "~/app/constants";

type FormClientProps = {
  client?: ClientRequest;
  onClose: (open: boolean) => void;
};
export function FormClient({ client, onClose }: FormClientProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientRequest>({
    resolver: zodResolver(clientSchema),
    defaultValues: client,
  });

  const { mutate: create } = api.client.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_CLIENTS],
      });
    },
  });

  const { mutate: update } = api.client.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_CLIENTS],
      });
    },
  });

  const handleSave = async (data: ClientRequest) => {
    try {
      if (client?.id) {
        update({ ...data, id: client.id });
        onClose(false);
        toast({
          title: "Cliente atualizado",
          description: "Cliente atualizado com sucesso",
        });
      } else {
        create({ ...data });
        onClose(false);
        toast({
          title: "Cliente salvo",
          description: "Cliente salvo com sucesso",
        });
      }
    } catch (error) {}
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
              E-mail
            </Label>
            <Input {...register("email")} className="col-span-3" />
            <span className="text-xs text-red-500">
              {errors.email ? errors.email.message : ""}
            </span>
          </div>
          <div className="space-y-1">
            <Label htmlFor="username" className="text-right">
              Telefone
            </Label>
            <Input {...register("phone")} className="col-span-3" />
            <span className="text-xs text-red-500">
              {errors.phone ? errors.phone.message : ""}
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
