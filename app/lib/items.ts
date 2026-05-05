export type ItemStatus = "Lost" | "Found" | "Claimed";

export type Item = {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  status: ItemStatus;
  postedBy: string;
  description: string;
};

export const sampleItems: Item[] = [
  {
    id: 1,
    title: "Blue Hydro Flask",
    category: "Bottle",
    location: "Library second floor",
    date: "2026-05-03",
    status: "Lost",
    postedBy: "Student",
    description: "Light blue bottle with sticker marks near the cap.",
  },
  {
    id: 2,
    title: "Black Wireless Mouse",
    category: "Electronics",
    location: "Computer lab 3",
    date: "2026-05-04",
    status: "Found",
    postedBy: "Student",
    description: "Small black mouse found beside workstation 14.",
  },
  {
    id: 3,
    title: "Student ID Card",
    category: "Identification",
    location: "Cafeteria entrance",
    date: "2026-05-05",
    status: "Found",
    postedBy: "Manager",
    description: "Turned in at the campus lost and found desk.",
  },
];
