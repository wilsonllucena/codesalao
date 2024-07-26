/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { z } from "zod";
import { clientSchema } from "~/lib/schemas/client-schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const clientRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(({  ctx }) => {
      return ctx.db.client.findMany({
        where: { user: { id: ctx.session.user.id } },
        orderBy: { createdAt : "desc" },
      });
    }),

    all: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.client.findMany({
        orderBy: { createdAt : "desc" },
        where: { user: { id: input.id } }
      });
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.client.findFirst({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
         },
      });
    }),

  create: protectedProcedure
    .input(clientSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.create({
        data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            user: { connect: { id: ctx.session.user.id } ,
          },
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({  id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("deleteCliente", ctx.session.user.id);
      return await ctx.db.client.delete({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
         },
      });
    }),

  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string(),
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
         },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
        },
      });
    }),
});
