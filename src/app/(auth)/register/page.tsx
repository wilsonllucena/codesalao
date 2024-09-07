"use client";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { register } from "module";
import { http } from "~/lib/axios";
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { useRouter } from "next/navigation";

const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type UserFormValues = z.infer<typeof userSchema>;


export default function UserRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const { mutate: create } = api.user.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Cadastro registrado",
        description: "Cadastro criado com sucesso",
      });
      router.replace("/");
    },
    onError: () => {
      toast({
        title: "Erro ao cadastrar",
        description: "Entre em contato com administrador",
      });
    },
  });

  const handleSave = async (data: UserFormValues) => {
    create(data);

  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Card className="w-full w-[380px]">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="text-2xl">Acessar</CardTitle>
            <CardDescription>
              Cadastre-se para acessar sua conta      
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="flex flex-col space-y-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Senha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Cadastrar</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
