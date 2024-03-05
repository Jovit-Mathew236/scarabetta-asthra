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
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Cookie from "./cookie";
import { TimerContext } from "../context/timerContext";
import { formatTime } from "@/lib/formatTime";

export function QuestionForm() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(10);
  const [uid, setUid] = useState<string>("");
  const { counter } = React.useContext(TimerContext);

  useEffect(() => {
    const handleInspect = () => {
      if (currentQuestionIndex === 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };

    const onBlurHandler = () => {
      handleInspect();
    };

    window.addEventListener("blur", onBlurHandler);

    // Add event listener for beforeunload
    const onConfirmRefresh = function (event: any) {
      if (currentQuestionIndex !== 7) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave the page?";
      }
    };

    window.addEventListener("beforeunload", onConfirmRefresh, {
      capture: true,
    });

    return () => {
      window.removeEventListener("blur", onBlurHandler);
      window.removeEventListener("beforeunload", onConfirmRefresh);
    };
  }, [currentQuestionIndex]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        router.push("/");
      }
    });
    return unsubscribe;
  }, [router]);

  const handleNextQuestion = async (answer?: string) => {
    if (answer === questions.questions[currentQuestionIndex].answer) {
      setScore((prevScore) => prevScore + 10);

      if (currentQuestionIndex === 4) {
        Cookie();
      }
      // set score in db
      // console.log(score);

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
      const docRef = doc(db, "user", userDoc?.id);
      if (userDoc) {
        updateDoc(docRef, {
          score: score,
          status: currentQuestionIndex < 6 ? "On Going" : "Completed",
          time: formatTime(counter),
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
      if (currentQuestionIndex === 7) {
        router.push("/rank");
      } else {
        handleNextQuestion(data.answer.toLocaleLowerCase());
        form.reset();
      }
      // setScore((prevScore) => prevScore + 10);
    }
  };

  return (
    <>
      {currentQuestionIndex === 2 && (
        <a
          href="/qr"
          target="_blank"
          rel="Here is your 3rd door key : url"
          className="hidden"
        ></a>
      )}
      {currentQuestionIndex === 6 && (
        <>
          <div className="flex h-[200px]">
            <Image
              src="https://github.com/HaleemMuhsin/Scarbetta-709/blob/main/Young_Kurt_G%C3%B6del_as_a_student_in_1925.jpg?raw=true"
              width={200}
              height={200}
              alt="layout"
              className="object-cover"
            />
            <Image
              src="https://github.com/HaleemMuhsin/Scarbetta-709/blob/main/Maurits_Cornelis_Escher.jpg?raw=true"
              width={200}
              height={200}
              alt="layout"
              className="object-cover"
            />
            <Image
              src="https://github.com/HaleemMuhsin/Scarbetta-709/blob/main/Johann_Sebastian_Bach.jpg?raw=true"
              width={200}
              height={200}
              alt="layout"
              className="object-cover"
            />
          </div>
          <Image
            src="https://github.com/HaleemMuhsin/Scarbetta-709/blob/main/360_F_670629689_SBpYkQnNNloYddLvF9QqyiJZGXaW0RLl.jpg?raw=true"
            width={200}
            height={200}
            alt="layout"
            className="object-cover"
          />
        </>
      )}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Door {currentQuestionIndex + 1}</CardTitle>
          {questions.questions[currentQuestionIndex].question && (
            <CardDescription>
              {questions.questions[currentQuestionIndex].question}
            </CardDescription>
          )}
          {questions.questions[currentQuestionIndex].link && (
            <Image
              src={questions.questions[currentQuestionIndex].link ?? ""}
              width={1000}
              height={1000}
              alt={questions.questions[currentQuestionIndex].alt ?? ""}
            />
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
