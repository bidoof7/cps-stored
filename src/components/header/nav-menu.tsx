import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

import Search from "./search";
import { Button } from "../ui/button";

import { LogInIcon, LogOutIcon, Moon, ShoppingCart, Sun } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/app/context/AuthContext";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "../ui/menubar";

const NavMenu = () => {
  const { setTheme } = useTheme();
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, info } = useAuth();

  const handleRedirectCartPage = () => {
    router.push("/cart");
  };

  const handleRedirectLoginPage = () => {
    router.push("/login");
  };

  const handleRedirectUserPage = () => {
    router.push("/user");
  };

  const handleLogout = async () => {
    try {
      const fetchLogout = axios.post("/api/auth/logout");
      toast.promise(fetchLogout, {
        success: "Logout successfully.",
      });
      const response = await axios.post("/api/auth/logout");
      if (response.status === 200) {
        setIsAuthenticated(false);

        // Hoặc bạn có thể dùng router.replace("/") để tránh tạo một bản ghi lịch sử mới:
        router.replace("/");
      }
    } catch (error) {
      setIsAuthenticated(false);
      const err = error as AxiosError;
      return err;
    }
  };

  return (
    <nav className="flex items-center gap-2">
      <Search />
      <Menubar className="">
        <MenubarMenu>
          <Button variant="ghost" size="icon" onClick={handleRedirectCartPage}>
            <ShoppingCart />
          </Button>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="p-0 border-none rounded-full cursor-pointer">
            <Avatar>
              {info?.photo ? (
                <AvatarImage src={`${info?.photo}`} />
              ) : (
                <AvatarImage src="https://res.cloudinary.com/dmr2omjs2/image/upload/v1732698608/none-user_ft2onz.webp" />
              )}
            </Avatar>
          </MenubarTrigger>
          <MenubarContent>
            {isAuthenticated ? (
              <div>
                <MenubarItem
                  className="justify-center"
                  onClick={handleRedirectUserPage}
                >
                  <h4 className="scroll-m-20 text-lg font-semibold tracking-tight text-center">
                    {`${info?.first_name + " " + info?.last_name}`}
                  </h4>
                </MenubarItem>
                <Separator />
              </div>
            ) : (
              <MenubarItem onClick={handleRedirectLoginPage}>
                <span>Login</span>
                <MenubarShortcut>
                  <LogInIcon />
                </MenubarShortcut>
              </MenubarItem>
            )}
            {isAuthenticated && (
              <MenubarItem onClick={handleLogout}>
                <span>Logout</span>
                <MenubarShortcut>
                  <LogOutIcon />
                </MenubarShortcut>
              </MenubarItem>
            )}
          </MenubarContent>
          <MenubarMenu>
            <Button
              variant="ghost"
              onClick={() => {
                setTheme((prevTheme) =>
                  prevTheme === "dark" ? "light" : "dark"
                );
              }}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </MenubarMenu>
        </MenubarMenu>
      </Menubar>

      {/* DROPDOWN */}
    </nav>
  );
};

export default NavMenu;
