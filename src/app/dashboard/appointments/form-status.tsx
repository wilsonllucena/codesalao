"use client";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, queryClient } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

import {
  appointmentSchema,
  AppointmentStatusRequest,
  AppointmentUpdateRequest,
  type AppointmentRequest,
} from "~/lib/schemas/appointment.schema";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { GET_APPOINTMENTS } from "~/app/constants";
type FormProps = {
  appointment?: any;
  onClose: (open: boolean) => void;
};
export function FormModalAppointmentStatus({
  appointment,
  onClose,
}: FormProps) {
  const { toast } = useToast();
  const form = useForm<AppointmentUpdateRequest>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment,
  });

  const { mutate: update } = api.appointment.updateStatus.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_APPOINTMENTS],
      });
      onClose(false);
      console.log(`Email enviado para ${appointment?.email}`);
      toast({
        title: "Agenda atualizada",
        description: "Agenda atualizada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar agenda",
        description: "Erro ao atualizar agenda",
      });
    },
  });

  const situations = [
    { id: "pending", name: "Pendente" },
    { id: "confirmed", name: "Confirmado" },
    { id: "canceled", name: "Cancelado" },
  ];
  const handleSave = async (data: AppointmentStatusRequest) => {
    update({
      id: appointment.id,
      status: data.status,
    });
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
                name="status"
                render={({ field }: any) => (
                  <FormItem>
                    {/* <FormLabel>Situação</FormLabel> */}
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecionar situação"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-ignore  */}
                        {situations?.map((situation) => (
                          <SelectItem key={situation.id} value={situation.id}>
                            {situation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex content-end justify-end pt-4">
            <Button className="pt-2" type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
