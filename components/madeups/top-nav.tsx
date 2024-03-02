import React from "react";
import { ModeToggle } from "./mode-toggle";

const TopNav = () => {
  return (
    <div className="flex justify-end align-bottom fixed w-11/12 h-32 top-10 left-0 z-50 print:hidden">
      <ModeToggle />
    </div>
  );
};

export default TopNav;
