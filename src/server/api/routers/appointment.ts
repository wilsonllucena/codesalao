/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { addHours, parseISO, set, startOfHour } from "date-fns";
import { date, z } from "zod";
import { appointmentSchema } from "~/lib/schemas/appointment.schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const appointmentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.appointment.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        date: true,
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
          date: true,
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
      const formatDate = set(input.date, {
        hours: Number(input.hour.split(":")[0]),
        minutes: Number(input.hour.split(":")[1]),
      });
      const appointmentDate = addHours(formatDate, -3);

      return ctx.db.appointment.create({
        data: {
          date: appointmentDate,
          hour: input.hour,
          client: { connect: { id: input.clientId } },
          service: { connect: { id: input.serviceId } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // createAppointment: publicProcedure
  //   .input(appointmentSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.appointment.create({
  //       data: {
  //         name: input.name || "",
  //         description: input.description || "",
  //         date: input.date,
  //         hour: input.hour,
  //         client: { connect: { id: input.clientId } },
  //         service: { connect: { id: input.serviceId } },
  //         user: {
  //           connect: { id: input.userId },
  //         },
  //       },
  //     });
  //   }),

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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
        date: z.string(),
        hour: z.string(),
        clientId: z.string().optional(),
        serviceId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const formatDate = set(input.date, {
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
          date: appointmentDate,
          hour: input.hour,
          client: { connect: { id: input.clientId } },
          service: { connect: { id: input.serviceId } },
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
