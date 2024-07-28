"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, queryClient } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

import {
  appointmentSchema,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { addDays, format } from "date-fns";
import { GET_APPOINTMENTS } from "~/app/constants";
import MaskedDateInput from "~/components/input-mask";
type FormProps = {
  appointment?: AppointmentRequest;
  onClose: (open: boolean) => void;
};
export function FormAppointment({ appointment }: FormProps) {
  const { toast } = useToast();

  // convert date to DD/MM/YYYY with Date

  const form = useForm<AppointmentRequest>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment,
  });

  const { mutate } = api.appointment.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_APPOINTMENTS],
      });
    },
  });
  const { mutate: update } = api.appointment.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_APPOINTMENTS],
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar agenda",
        description: "Erro ao atualizar agenda",
      });
    },
  });
  const { data: clients } = api.client.getAll.useQuery();
  const { data: services } = api.service.getAll.useQuery();

  const handleSave = async (data: AppointmentRequest) => {
    try {
      const formattedDate = data.date.split("/").reverse().join("-");
      if (appointment?.id) {
        update({
          ...data,
          id: appointment.id,
          name: appointment.name ?? "",
          date: formattedDate,
        });
        toast({
          title: "Agenda atualizada",
          description: "Agenda atualizada com sucesso",
        });
      } else {
        mutate({ ...data });
        toast({
          title: "Agenda criada",
          description: "Agenda salva com sucesso",
        });
      }
    } catch (error) {}
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
                name="clientId"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecionar cliente"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-ignore  */}
                        {clients?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Serviço</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Selecionar cliente"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-ignore  */}
                        {services?.map((data) => (
                          <SelectItem key={data.id} value={data.id}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <MaskedDateInput
                        {...field}
                        mask="date"
                        placeholder="99/99/9999"
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
                name="hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <MaskedDateInput
                        {...field}
                        mask="time"
                        placeholder="09:00"
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
                      <Textarea placeholder="descrição" {...field} />
                    </FormControl>
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
