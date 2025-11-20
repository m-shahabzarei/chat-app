"use client";

import Link from "next/link";
import { useSession, signIn, signOut} from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  return (
    <nav className="bg-[#222222] shadow p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/">ShahabGram</Link>
        <div className="space-x-4">
          {session?.user ? (
            <>
              <Link href="/chat">chat</Link>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <>
            <button onClick={() => signIn()}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
