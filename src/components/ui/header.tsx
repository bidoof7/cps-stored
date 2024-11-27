"use client";

import React from "react";
import NavMenu from "./nav-menu";

const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex h-14 items-center px-4 justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          LOGO CPS
        </h3>
        <NavMenu />
      </div>
    </header>
  );
};

export default Header;
