"use client";

import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { role } = useAuth();
  console.log(role);
  if (role === "Admin") {
    return (
      <main>
        <h1>NAVIGATOR PAGE</h1>
        {children}
      </main>
    );
  } else {
    return (
      <div>
        <p>Your are not authorization to this site</p>
      </div>
    );
  }
};

export default DashboardLayout;
