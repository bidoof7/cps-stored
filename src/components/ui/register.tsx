import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupFormSchema } from "@/lib/definitions";
import { toast } from "sonner";

const FormRegister = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof SignupFormSchema>) => {
    const payload = {
      username: values.username,
      password: values.password,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
    };

    try {
      const fetchRegister = axios.post("/api/auth/register", payload);

      toast.promise(fetchRegister, {
        loading: "Verifying...",
        success: "Register successfully, login and shopping now.",
        error: "Invalid credentials, please check again.",
      });

      await fetchRegister;
    } catch (err) {
      const error = err as AxiosError;
      alert(error);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader className="pb-0">
            <CardTitle>Register</CardTitle>
            <CardDescription>
              If you are new please register the account to shopping with cps.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 pb-0 gap-4">
            <div className="grid grid-rows-3 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username..." {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-rows-3 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your first name..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your last name..."
                        {...field}
                      />
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
                      <Input
                        type="email"
                        placeholder="Your email..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const SubmitButton = () => {
  return (
    <Button className="w-full" type="submit">
      Register
    </Button>
  );
};

export default FormRegister;
