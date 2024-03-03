"use client";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { Badge } from "../ui/badge";

const TopNav = () => {
  const [user] = useAuthState(auth);
  const userName = user?.displayName;
  return (
    <div className="fixed top-10 left-0 z-50 w-full">
      <div className="m-auto flex justify-between  w-11/12  print:hidden">
        <Badge variant="secondary">Hi {userName}</Badge>
        <ModeToggle />
      </div>
    </div>
  );
};

export default TopNav;
