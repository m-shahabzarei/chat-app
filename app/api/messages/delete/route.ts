import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) return NextResponse.json({ error: "Not Found" }, { status: 404 });

  if (message.userId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.message.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
