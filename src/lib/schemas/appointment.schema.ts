import { z } from "zod";

 export const appointmentSchema = z.object({
    id: z.string().nullish(),
    date: z.coerce.string(),
    hour: z.string(),
    clientId: z.string().min(3, { message: "Cliente é obrigatório" }),
    serviceId: z.string().min(3, { message: "Serviço é obrigatório" }),
    name: z.string().optional(),
    description: z.string().optional(),
    email: z.string().optional(),
    service: z.string().optional(),
  });
  
  export type AppointmentRequest = z.infer<typeof appointmentSchema>;