"use client";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, queryClient } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import ptBR from "date-fns/locale/pt-BR";

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
import MaskedDateInput from "~/components/input-mask";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import {
  addDays,
  addHours,
  format,
  Locale,
  parseISO,
  set,
  startOfHour,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { PopoverClose } from "@radix-ui/react-popover";
import { z } from "zod";
import { AppointmentRequest } from "~/lib/schemas/appointment.schema";
import { http } from "~/lib/axios";

const appointmentSchema = z.object({
  id: z.string().nullish(),
  date: z.date(),
  hour: z.string(),
  clientId: z.string().min(3, { message: "Cliente é obrigatório" }),
  serviceId: z.string().min(3, { message: "Serviço é obrigatório" }),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  email: z.string().optional(),
  service: z.string().optional(),
});

type FormProps = {
  appointment?: any;
  onClose: (open: boolean) => void;
};
export function FormAppointment({ appointment, onClose }: FormProps) {
  const { toast } = useToast();
  if (appointment) {
    // convert dd/MM/yyyy to yyyy-MM-dd
    const [day, month, year] = appointment.date.split("/");
    const date = new Date(`${year}-${month}-${day}`);

    // add day to date-fns
    const formatedDate = addDays(date, 1);

    appointment = {
      ...appointment,
      date: formatedDate,
    };
  }
  const form = useForm<AppointmentRequest>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: appointment,
  });

  const { mutate: create } = api.appointment.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_APPOINTMENTS],
      });
      onClose(false);
      toast({
        title: "Agenda criada",
        description: "Agenda salva com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar agenda",
        description: "Erro ao criar agenda",
      });
    },
  });
  const { mutate: update } = api.appointment.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_APPOINTMENTS],
      });
      onClose(false);
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

  const { data: clients } = api.client.getAll.useQuery();
  const { data: services } = api.service.getAll.useQuery();
  type AppointmentRequest2 = {
    date: Date;
    hour: String;
    clientId: String;
    serviceId: String;
    id: String;
    name: String;
    description: String;
    status: String;
    email: String;
    service: String;
  };
  const handleSave = async (data: any) => {
    //convertendo para datetimezone
    let date = parseISO(data.date.toISOString()).toString();
    date = addDays(new Date(date), -1).toISOString();

    try {
      if (appointment?.id) {
        // return;
        update({
          ...data,
          id: appointment.id,
          name: appointment.name ?? "",
          date: date,
        });
      } else {
        await http.post("/api/appointments", {
          ...data,
          date: date,
        });

        queryClient.invalidateQueries({
          queryKey: [GET_APPOINTMENTS],
        });
        onClose(false);
        toast({
          title: "Agenda atualizada",
          description: "Agenda atualizada com sucesso",
        });
      }
    } catch (error) {
      console.error(error);
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
              {/* <FormField
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
              /> */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }: any) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Escolha um dia</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <PopoverClose>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                            }}
                            locale={ptBR as any}
                          />
                        </PopoverClose>
                      </PopoverContent>
                    </Popover>
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
