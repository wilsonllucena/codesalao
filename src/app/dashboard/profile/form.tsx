"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "~/components/ui/use-toast";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { Separator } from "~/components/ui/separator";

const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().nullish(),
  email: z.string().email({ message: "E-mail inválido" }),
  company: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      slug: z.string().optional(),
      userId: z.string()
    })
  ).optional(),
});

type Profile = z.infer<typeof profileSchema>;

type ProfileFormProps = {
  profile: Profile;
};
export function ProfileForm({ profile }: ProfileFormProps) {
  const { toast } = useToast();


  console.log(profile);



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
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
      });
      toast({
        title: "Perfil",
        description: "Seu perfil foi atualizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil"
      });
    }
  };


  return (
    <>

      <form
        onSubmit={handleSubmit(handleSave)}
        name="formClient"
        className="flex flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input {...register("name")} className="col-span-3" />

          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-right">
              E-mail
            </Label>
            <Input {...register("email")} className="col-span-3" disabled />
          </div>

          <Separator />

          <div className="space-y-1">
            <Label htmlFor="company" className="text-right">
              Unidades
            </Label>
            {profile.company?.map((company, index) => (
              <div key={index} className="flex flex-1 space-x-2">

                <Input
                  {...register(`company.${index}.name` as const)}
                  className="col-span-3"
                  disabled
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex content-end justify-end pt-4">
          <Button className="pt-2" type="submit">
            Atualizar
          </Button>
        </div>
      </form>
    </>
  );
}
