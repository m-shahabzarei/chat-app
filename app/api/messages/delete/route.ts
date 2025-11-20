import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();

  const message = await prisma.message.findUnique({
    where: { id },
  });

  // اگر پیام وجود نداشت
  if (!message) return new Response("Not Found", { status: 404 });

  // فقط صاحب پیام می‌تونه حذف کنه
  if (message.userId !== session.user.id)
    return new Response("Forbidden", { status: 403 });

  await prisma.message.delete({
    where: { id },
  });

  return Response.json({ success: true });
}
