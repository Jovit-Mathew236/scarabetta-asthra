import { SignInForm } from "@/components/madeups/signin-form";
import React from "react";

const SignIn = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[300px] md:w-[400px]">
        <SignInForm />
      </div>
    </div>
  );
};

export default SignIn;
