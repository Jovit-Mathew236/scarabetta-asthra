"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import questions from "@/public/question.json";
import { boolean, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase/config";
import {
  collection,
  getDocs,
  CollectionReference,
  QuerySnapshot,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function QuestionForm() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [uid, setUid] = useState<string>("");

  useEffect(() => {
    const handleInspect = () => {
      if (currentQuestionIndex === 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };

    window.addEventListener("keydown", handleInspect);

    return () => {
      window.removeEventListener("keydown", handleInspect);
    };
  }, [currentQuestionIndex, router]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        router.push("/");
      }
    });
    return unsubscribe;
  }, []);

  const handleNextQuestion = async (answer?: string) => {
    if (answer === questions.questions[currentQuestionIndex].answer) {
      setScore(score + 10);
      // set score in db
      console.log(score);

      const userCollectionRef: CollectionReference<DocumentData> = collection(
        db,
        "user"
      );
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        userCollectionRef
      );
      const userData: DocumentData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const userDoc = userData.find((localuser) => localuser.uid === uid);
      console.log(userDoc, uid, userData);

      if (userDoc) {
        updateDoc(userDoc.id, {
          score: score,
        });
      }
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const FormSchema = z
    .object({
      answer: z.string().nonempty({
        message: "Answer cannot be empty.",
      }),
    })
    .refine(
      (data) => {
        if (
          data.answer.toLocaleLowerCase() !==
          questions.questions[currentQuestionIndex].answer
        ) {
          return false;
        }
        return true;
      },
      {
        message: "Incorrect answer! Please try again.",
        path: ["answer"],
      }
    );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      answer: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (
      data.answer.toLocaleLowerCase() ===
      questions.questions[currentQuestionIndex].answer
    ) {
      handleNextQuestion(data.answer);
      form.reset();
    }
  };

  return (
    <>
      <a
        href="localhost:3000/qr"
        target="_blank"
        rel="Here is your 3rd door key : url"
        className="hidden"
      ></a>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Door {currentQuestionIndex + 1}</CardTitle>
          {questions.questions[currentQuestionIndex].question && (
            <CardDescription>
              {questions.questions[currentQuestionIndex].question}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {questions.questions[currentQuestionIndex].answer && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </>
  );
}
