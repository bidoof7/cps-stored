"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormLogin from "@/components/form/login";
import FormRegister from "@/components/form/register";

const Login = () => {
  return (
    <Tabs defaultValue="account" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Log in</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        {/* LOGIN */}
        <FormLogin />
      </TabsContent>
      <TabsContent value="register">
        {/* REGISTER */}
        <FormRegister />
      </TabsContent>
    </Tabs>
  );
};

export default Login;
