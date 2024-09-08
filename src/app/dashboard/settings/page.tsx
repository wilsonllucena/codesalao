import React from "react";
import {SettingsForm } from "./form";
import { Heading } from "../_components/heading";
import { api } from "~/trpc/server";

export default async function SettingsPage(){
  const profileResponse = await api.profile.get() as any;
    return (
      <>
         <Heading title="Configurações" />
         <SettingsForm profile={profileResponse} />
      </>
    );
};