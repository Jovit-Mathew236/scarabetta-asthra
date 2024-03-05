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
  onSnapshot, // Import onSnapshot
  query,
  orderBy,
  DocumentData,
} from "firebase/firestore";

export function RankTable() {
  const [userData, setUserData] = useState<DocumentData[]>([]);

  useEffect(() => {
    const userCollectionRef = collection(db, "user");
    const q = query(userCollectionRef, orderBy("score", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newData: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        newData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserData(newData);
    });

    return () => unsubscribe(); // Unsubscribe from the snapshot listener when component unmounts
  }, []); // Run effect only once when component mounts

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
          <TableRow key={user.id}>
            <TableCell className="font-medium">{i + 1}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.status}</TableCell>
            <TableCell>{user.score}</TableCell>
            <TableCell className="text-right">{user.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
