/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { z } from "zod";
import { companySchema } from "~/lib/schemas/company.schema";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { createSlug } from "~/utils/create-slug";

export const companyRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(({  ctx }) => {
      return ctx.db.user.findMany({
        select: {
          id: true,
          company: true,
        },
        where: { id:  ctx.session.user.id },
      });
    }),

  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.company.findFirst({
        where: { 
          id: input.id
         },
      });
    }),

  create: protectedProcedure
    .input(companySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.company.create({
        data: {
            name: input.name,
            slug: createSlug(input.name),
            description: input.description || "",
            user: { connect: { id: ctx.session.user.id } ,
          },
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({  id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.company.delete({
        where: { 
          id: input.id,
         },
      });
    }),

  update: protectedProcedure
    .input(z.object({ 
      id: z.string(),
      name: z.string(),
      description: z.string().nullish()
     }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.company.update({
        where: { 
          id: input.id
         },
        data: {
          name: input.name,
          slug: createSlug(input.name),
          description: input.description || "",
        },
      });
    }),
});
