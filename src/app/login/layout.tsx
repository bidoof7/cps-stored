"use client";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-screen mt-[-56px]">
      {children}
    </div>
  );
};

export default LoginLayout;
