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
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const handleSave = async (data: UserFormValues) => {
    try {
      // Replace with your API call
      console.log("User data:", data);
      toast({
        title: "User Registered",
        description: "User registration successful",
      });
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An error occurred during registration",
      });
    }
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div>
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
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Register</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
