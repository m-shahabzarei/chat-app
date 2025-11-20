import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next"; // مهم
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await req.json();

  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (message.userId !== session.user.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await prisma.message.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
