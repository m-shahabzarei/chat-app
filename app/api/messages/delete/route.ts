import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // گرفتن سشن به شیوه درست NextAuth v5
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return new NextResponse("Message ID is required", { status: 400 });
  }

  try {
    await prisma.message.delete({
      where: { id },
    });

    return new NextResponse("Message deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Delete message error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
