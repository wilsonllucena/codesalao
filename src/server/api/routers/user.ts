import { hash } from 'bcryptjs';
import { userSchema } from '~/lib/schemas/user.schema';
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({

  create: publicProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: await hash(input.password, 10),
        },
      });
    }),

  
});
