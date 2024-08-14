import { Decimal } from '@prisma/client/runtime/library';

import { z } from "zod";
import { serviceSchema } from "~/lib/schemas/service.schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const serviceRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.service.findMany({
      where: { user: { id: ctx.session.user.id } },
      orderBy: { createdAt: "desc" },
    });
  }),

  all: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.service.findMany({
        orderBy: { createdAt: "desc" },
        where: { user: { id: input.id } },
      });
    }),

  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.service.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  create: protectedProcedure
    .input(serviceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.create({
        data: {
          name: input.name,
          price: input.price,
          description: input.description || "",
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.service.delete({
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
        price: z.coerce.number(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
          price: input.price,
          description: input.description || "",
        },
      });
    }),
});
