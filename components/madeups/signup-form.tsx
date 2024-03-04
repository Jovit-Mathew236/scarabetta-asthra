"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth, db, updateUser } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import {
  collection,
  getDocs,
  CollectionReference,
  QuerySnapshot,
  DocumentData,
  addDoc,
} from "firebase/firestore";
import { useEffect } from "react";

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function SignUpForm() {
  const router = useRouter();
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/treasurehunt");
      }
    });
    return unsubscribe;
  }, [router]);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const res = await createUserWithEmailAndPassword(data.email, data.password);
    console.log(res);
    if (res?.user) {
      updateUser(data.name);
    }
    // add data to user collection
    const userCollectionRef: CollectionReference<DocumentData> = collection(
      db,
      "user"
    );
    await addDoc(userCollectionRef, {
      uid: res?.user.uid,
      name: data.name,
      email: data.email,
      status: "Joined",
      time: "00:00:00",
      rank: 0,
      score: 0,
    });
    router.push("/treasurehunt");
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Register here</CardTitle>
        <CardDescription>Open your first door</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="iron man" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="youremail@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="submit">Join</Button>
              <Button variant="link" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
