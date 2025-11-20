"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";

type Message = {
  id: string;
  text: string;
  createdAt: string;
  user: {
    email: string;
  };
};

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1️⃣ لود پیام‌های قبلی از دیتابیس
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/messages/get");
      const data: Message[] = await res.json();
      setMessages(data);
      console.log(data);
    };
    fetchMessages();
  }, []);

  // 2️⃣ سابسکرایب کردن Pusher برای پیام جدید
  useEffect(() => {
    pusherClient.subscribe("chat");

    const handleMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe("chat");
      pusherClient.unbind("new-message", handleMessage);
    };
  }, []);
  // 3️⃣ اسکرول خودکار به آخر پیام‌ها
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // 3️⃣ ارسال پیام جدید
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await fetch("/api/messages/send", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    setText("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">
          💬
        </div>
        <h2 className="text-xl font-bold">چت روم</h2>
      </div>

      {/* Messages */}
      <div
        id="chat-box"
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
      >
        {messages.map((m) => {
          const mine = m.user.email === session?.user?.email;

          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${
                mine ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar others */}
              {!mine && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                  {m.user.email[0].toUpperCase()}
                </div>
              )}

              {/* Bubble */}
              <div
                className={`
                p-3 rounded-2xl shadow break-words whitespace-pre-wrap
                 max-w-[70%]
                      ${
                        mine
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-800 rounded-bl-none"
                      }
             `}
              >
                <p className="text-sm opacity-70">{m.user.email}</p>
                <p className="mt-1">{m.text}</p>
                <span className="text-[10px] opacity-50">
                  {new Date(m.createdAt).toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Avatar mine */}
              {mine && (
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-sm">
                  {session?.user?.email?.[0].toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={send}
        className="p-4 border-t border-gray-800 flex gap-3 bg-[#111]"
      >
        <input
          className="flex-1 p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:border-blue-600 outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="پیامت رو بنویس..."
        />
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl">
          ارسال
        </button>
      </form>
    </div>
  );
}
