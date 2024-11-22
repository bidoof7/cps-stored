"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const { push } = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    };

    try {
      const { data } = await axios.post("/api/auth/login", payload);
      alert(JSON.stringify(data));

      // redirect -> /dashboard
      push("/dashboard");
    } catch (err) {
      const error = err as AxiosError;

      alert(error);
    }
  };

  return (
    <main>
      <h1>NEXTJS AUTH</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default Login;
