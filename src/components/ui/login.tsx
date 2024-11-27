"use client";

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
import { useAuth } from "@/app/context/AuthContext";
import { LoginFormSchema } from "@/lib/definitions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const FormLogin = () => {
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    const payload = {
      username: values.username,
      password: values.password,
    };

    try {
      const fetchLogin = axios.post("/api/auth/login", payload);
      toast.promise(fetchLogin, {
        loading: "Verifying your account...",
        success: "Login successful!",
        error: "Invalid credentials, please check again.",
      });

      const response = await fetchLogin;
      if (response.status === 200) {
        setIsAuthenticated(true);
        // Hoặc bạn có thể dùng router.replace("/") để tránh tạo một bản ghi lịch sử mới:
        router.replace("/");
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log("Login error: ", error);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader className="pb-0">
            <CardTitle>Login</CardTitle>
            <CardDescription>
              If you are have account already fill your username and password
              below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pb-0">
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
          </CardContent>
          <CardFooter className="justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const SubmitButton = () => {
  return <Button className="w-full">Login</Button>;
};

export default FormLogin;
