/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import * as React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { type Metadata } from "next";
import { useToast } from "../ui/use-toast";

import {
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { useRouter } from "next/navigation";
type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;
export const metadata: Metadata = {
  title: "Autenticação",
  description: "Authentication forms built using the components.",
};
const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

type AuthRequest = z.infer<typeof authSchema>;
export function AuthFormCredential({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthRequest>({
    resolver: zodResolver(authSchema),
  });

  const handleAuthenticate: SubmitHandler<AuthRequest> = async (
    data: AuthRequest,
  ) => {
    try {
      setIsLoading(true);

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: `${window.location.origin}/dashboard`,
      });

      router.replace("/dashboard");
      setIsLoading(false);
    } catch (error) {
      console.log("Erro no login");
    }
  };

  return (
      <form onSubmit={handleSubmit(handleAuthenticate)}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Input
              {...register("email")}
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              {...register("password")}
              type="password"
              placeholder="Senha"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Autenticando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
  );
}
