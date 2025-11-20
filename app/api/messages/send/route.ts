import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusherServer";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { text } = await req.json();

  const msg = await prisma.message.create({
    data: {
      text,
      userId: session.user.id,
    },
    include: { user: true },
  });

  await pusherServer.trigger("chat", "new-message", msg);

  return Response.json(msg);
}
