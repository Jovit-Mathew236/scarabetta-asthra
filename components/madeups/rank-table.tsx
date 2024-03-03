import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const data = [
  {
    rank: "1",
    status: "Finished",
    name: "User 1",
    time: "10",
  },
  {
    rank: "2",
    status: "Finished",
    name: "User 2",
    time: "20",
  },
  {
    rank: "3",
    status: "Ongoing",
    name: "User 3",
    time: "30",
  },
  {
    rank: "4",
    status: "Ongoing",
    name: "User 4",
    time: "140",
  },
  {
    rank: "5",
    status: "Started",
    name: "User 5",
    time: "50",
  },
  {
    rank: "6",
    status: "Started",
    name: "User 6",
    time: "60",
  },
  {
    rank: "7",
    status: "Joined",
    name: "User 7",
    time: "40",
  },
];

export function RankTable() {
  return (
    <Table>
      <TableCaption>Rank List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((rank) => (
          <TableRow key={rank.rank}>
            <TableCell className="font-medium">{rank.rank}</TableCell>
            <TableCell>{rank.status}</TableCell>
            <TableCell>{rank.name}</TableCell>
            <TableCell className="text-right">{rank.time} min</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
