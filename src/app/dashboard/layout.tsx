"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UserResponse {
  user: string | null;
  error: AxiosError | null;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();
      console.log(user);
      if (error) {
        router.push("/login");
        return;
      }

      setIsSuccess(true);
    })();
  }, [router]);

  if (!isSuccess) {
    return <div>Loading....</div>;
  }

  return (
    <main>
      <h1> NAVIGATOR PAGE</h1>
      {children}
    </main>
  );
};

async function getUser(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/api/auth/me");

    return {
      user: data,
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError;

    return {
      user: null,
      error,
    };
  }
}

export default DashboardLayout;
