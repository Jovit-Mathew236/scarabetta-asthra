"use client";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "./mode-toggle";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { Badge } from "../ui/badge";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useRouter, usePathname } from "next/navigation";

const TopNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const userName = user?.displayName;

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Start the counter when component mounts
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 1000); // Increment the counter every second

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures that effect runs only once

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed top-10 left-0 z-50 w-full">
      <div className="m-auto flex justify-between  w-11/12  print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Badge variant="secondary" className="h-full">
              Hi {userName}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                onClick={() => {
                  signOut(auth);
                  router.push("/");
                }}
                className="h-4"
              >
                SignOut
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {user && pathname === "/treasurehunt" && (
          <Badge
            variant="destructive"
            className="h-full self-center align-middle"
          >
            {formatTime(counter)}
          </Badge>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default TopNav;
