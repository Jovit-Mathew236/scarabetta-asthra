"use server";
import { cookies } from "next/headers";

const Cookie = () => {
  cookies().set("6 key", "cookie");
};

export default Cookie;
