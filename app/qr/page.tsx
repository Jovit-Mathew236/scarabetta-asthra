import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="relative">
        <Image
          src="https://github.com/Friggin-sphinx/Treasure-Hunt/blob/main/Treasure%20hunt%20QR.png?raw=true"
          width={500}
          height={500}
          className="filter  w-[500px] h-[500px] object-cover"
          alt=""
        />
        <div className="absolute top-0 left-0  w-[500px] h-[500px] bg-red-700 opacity-[0.978]"></div>
      </div>
    </div>
  );
};

export default page;
