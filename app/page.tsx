import { SignInForm } from "@/components/madeups/signin-form";
import React from "react";

const Home = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[300px] md:w-[500px]">
        <SignInForm />
      </div>
    </div>
  );
};

export default Home;
