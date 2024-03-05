"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  collection,
  getDocs,
  CollectionReference,
  QuerySnapshot,
  DocumentData,
  orderBy,
  query,
} from "firebase/firestore";

export function RankTable() {
  const [userData, setUserData] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const userCollectionRef: CollectionReference<DocumentData> = collection(
          db,
          "user"
        );
        const q = query(userCollectionRef, orderBy("score", "desc"));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
        const userData: DocumentData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserData(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Table>
      <TableCaption>Rank List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userData.map((user: any, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.status}</TableCell>
            <TableCell>{user.score}</TableCell>
            <TableCell className="text-right">{user.time} min</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
