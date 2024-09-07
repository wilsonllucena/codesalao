/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Label } from "../ui/label";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AuthFormCredential } from "./auth-credentials";
type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;
export const metadata: Metadata = {
  title: "Autenticação",
};


export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-2xl">Acessar</CardTitle>
        <CardDescription>
          Entre com seu email e senha para acessar sua conta.
        </CardDescription>
      </CardHeader>
      <AuthFormCredential />
    </Card>
  );
}
