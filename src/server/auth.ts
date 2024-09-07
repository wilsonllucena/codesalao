import { PrismaAdapter } from "@auth/prisma-adapter";
import { User } from "@prisma/client";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialProvider  from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

import { env } from "~/env";
import { http } from "~/lib/axios";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      company: {
        id: string;
        name: string;
        slug: string;
      };
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthOptions = {

  callbacks: {
    async jwt({ token, user }) {
      return { ...token , ...user};
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
    newUser: "/dashboard",
  },
  // adapter: PrismaAdapter(db) as Adapter,
  providers: [
    // consigure nodemailer
    // EmailProvider({
    //   server: {
    //     host: env.EMAIL_SERVER_HOST,
    //     port: env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: env.EMAIL_SERVER_USER,
    //       pass: env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: env.EMAIL_FROM,
    // }),
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "******",
        }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials!;

        const response = await http.post("/api/session", {
          email,
          password
        });

        if (response.status === 201) {
             return response.data.user;
        }
        
        return null;        
      },
    }),
  ],

 
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
