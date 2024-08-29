import React from "react";
import { ProfileForm } from "./form";
import { Heading } from "../_components/heading";
import { api } from "~/trpc/server";

export default async function ProfilePage(){
  const profileResponse = await api.profile.get() as any;

    return (
      <>
         <Heading title="Informações do Perfil" />
         <ProfileForm profile={profileResponse} />
      </>
    );
};