import { NextResponse } from "next/server";

// interface
interface User {
  name: string;
  email: string;
}

// data (fake DB)
const users: User[] = [
  {
    name: "Ali",
    email: "ali@gmail.com",
  },
  {
    name: "Shimaa",
    email: "shimaa@gmail.com",
  },
];

// GET -> يرجّع كل اليوزرز
export function GET() {
  return NextResponse.json({
    users: users,
  });
}

// POST -> يضيف يوزر جديد
export async function POST(request: Request) {
  const user: User = await request.json();

  users.push(user);

  return NextResponse.json({
    message: "User added successfully",
    users: users,
  });
} 