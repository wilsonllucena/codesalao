import { AppointmentStatus } from "@prisma/client";
import { addHours, set } from "date-fns";
import {z} from "zod";
import { appointmentSchema } from "~/lib/schemas/appointment.schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { formatDate } from "~/utils/format-date";

export const appointmentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.appointment.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        date_start: true,
        hour: true,
        clientId: true,
        serviceId: true,
        client: { select: { name: true } },
        service: { select: { name: true } },
      },
      where: { user: { id: ctx.session.user.id } },
      orderBy: { createdAt: "desc" },
    });
  }),

  all: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.appointment.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          date_start: true,
          hour: true,
          clientId: true,
          serviceId: true,
          client: { select: { name: true } },
          service: { select: { name: true } },
        },
        where: { user: { id: input.id } },
        orderBy: { createdAt: "desc" },
      });
    }),

  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.appointment.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  create: protectedProcedure
    .input(appointmentSchema)
    .mutation(async ({ ctx, input }) => {
      // convert data para hora

      const { hour, date_start } = input;
      const appointmentDate = formatDate({ date_start, hour });
 

      return ctx.db.appointment.create({
        data: {
          date_start: appointmentDate,
          date_end: addHours(appointmentDate, 1),
          hour: input.hour,
          client: { connect: { id: input.clientId } },
          service: { connect: { id: input.serviceId } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.appointment.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

    getByHour: protectedProcedure
    .input(z.object({ hour: z.string(), date_start: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { hour, date_start } = input;
      const appointmentDate = formatDate({ date_start, hour });

      return await ctx.db.appointment.findFirst({
        where: {
          hour: input.hour,
          date_start: appointmentDate,
          userId: ctx.session.user.id,
          status: "confirmed",
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        date_start: z.string(),
        hour: z.string(),
        clientId: z.string().optional(),
        status: z.string().optional(),
        serviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const formatDate = set(input.date_start, {
        hours: Number(input.hour.split(":")[0]),
        minutes: Number(input.hour.split(":")[1]),
      });
      const appointmentDate = addHours(formatDate, -3);

      return ctx.db.appointment.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name || "",
          description: input.description || "",
          date_start: appointmentDate,
          hour: input.hour,
          client: { connect: { id: input.clientId } },
          service: { connect: { id: input.serviceId } },
          status: input.status as AppointmentStatus,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.appointment.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          status: input.status as any,
        },
      });
    }),
});
