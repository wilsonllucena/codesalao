"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/components/ui/use-toast";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Separator } from "~/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";

const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email({ message: "E-mail inválido" }),
  company: z
    .object({
      name: z.string().min(3, { message: "Nome da empresa é obrigatório" }),
    })
});

type Profile = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  profile: Profile;
};

export function SettingsForm({ profile }: ProfileFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });

  const { mutate: update } = api.profile.update.useMutation();

  const handleSave = async (data: Profile) => {
    try {
      if (!data.name) {
        return;
      }
      update({
        name: data.name,
        companyName: data.company.name,
      });
      toast({
        title: "Atualização de perfil",
        description: "Seu perfil foi atualizado com sucesso",
      });
    } catch (error) {
      alert("Erro ao atualizar perfil");
      toast({
        title: "Erro ao atualizar perfil",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="flex flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col space-y-3">
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="company.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="space-y-1">
            <Label htmlFor="company" className="text-right">
              Unidades
            </Label>
            {profile?.company?.units?.map((company, index) => (
              <div key={index} className="flex flex-1 space-x-2">
                <Input
                  {...register("company.units." + index + ".name")}
                  className="col-span-3"
                  disabled
                />
              </div>
            ))}
          </div> */}
            <div className="flex content-end justify-end pt-4">
              <Button className="pt-2" type="submit">
                Atualizar
              </Button>
            </div>
          </div>

        </form>
      </Form>
    </>
  );
}
