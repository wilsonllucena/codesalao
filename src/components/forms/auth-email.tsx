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
type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;
export const metadata: Metadata = {
  title: "Autenticação",
  description: "Authentication forms built using the components.",
};
const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type AuthRequest = z.infer<typeof authSchema>;
export function AuthFormEmail({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
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

      await signIn("email", {
        email: data.email,
        callbackUrl: `${window.location.origin}/dashboard`,
        redirect: false,
      });

      toast({
        title: "Magic link enviado",
        description: "Verifique seu e-mail",
      });
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
