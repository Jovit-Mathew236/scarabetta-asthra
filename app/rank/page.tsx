import { RankTable } from "@/components/madeups/rank-table";
import React from "react";

const page = () => {
  return (
    <div className="w-full">
      <div className="w-11/12 m-auto h-screen flex flex-col justify-center items-center">
        <RankTable />
      </div>
    </div>
  );
};

export default page;
