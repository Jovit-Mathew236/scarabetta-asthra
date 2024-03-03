"use client";
import * as React from "react";
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
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import useStorage from "../hooks/useStorage";

export function QuestionForm() {
  const { getItem } = useStorage();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    React.useState<number>(0);
  const [score, setScore] = React.useState<number>(0);

  const [user] = useAuthState(auth);
  const userSession = getItem("user");

  if (!user && userSession !== "true") {
    router.push("/");
  }

  const handleNextQuestion = (answer: string) => {
    if (answer === questions.questions[currentQuestionIndex].answer) {
      setScore(score + 1);
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
        if (data.answer !== questions.questions[currentQuestionIndex].answer) {
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
    if (data.answer === questions.questions[currentQuestionIndex].answer) {
      handleNextQuestion(data.answer);
      form.reset();
    }
  };
  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Door {currentQuestionIndex + 1}</CardTitle>
          <CardDescription>
            {questions.questions[currentQuestionIndex].question}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        </CardContent>
      </Card>
    </>
  );
}
