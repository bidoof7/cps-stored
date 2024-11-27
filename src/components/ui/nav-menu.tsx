import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

import Search from "./search";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./header-dropdown-menu";
import { Button } from "./button";
import { LogInIcon, LogOutIcon, Moon, ShoppingCart, Sun } from "lucide-react";
import { Avatar, AvatarImage } from "./avatar";
import { useAuth } from "@/app/context/AuthContext";
import { Separator } from "./separator";
import { toast } from "sonner";

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
      <Button
        className="border-none"
        variant="outline"
        size="icon"
        onClick={handleRedirectCartPage}
      >
        <ShoppingCart />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="border-none rounded-full"
            variant="outline"
            size="icon"
          >
            <Avatar>
              {info?.photo ? (
                <AvatarImage src={`${info?.photo}`} />
              ) : (
                <AvatarImage src="https://res.cloudinary.com/dmr2omjs2/image/upload/v1732698608/none-user_ft2onz.webp" />
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isAuthenticated ? (
            <div>
              <DropdownMenuItem onClick={handleRedirectUserPage}>
                {/* <p className=""></p> */}
                <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  {`${info?.first_name + " " + info?.last_name}`}
                </h4>
              </DropdownMenuItem>
              <Separator />
            </div>
          ) : (
            <DropdownMenuItem onClick={handleRedirectLoginPage}>
              <LogInIcon />
              <span>Login</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {isAuthenticated && (
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              <span>Logout</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default NavMenu;
