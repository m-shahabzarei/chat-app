// lib/pusher.ts
"use client";

import Pusher from "pusher-js";

// کلاینت فقط می‌تونه متغیرهای NEXT_PUBLIC_ را بخونه
export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  forceTLS: true,
});
