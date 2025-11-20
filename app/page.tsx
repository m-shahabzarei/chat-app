"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  function sayHello(){
    return(
      <>
       Hello
        <span className="rounded-full text-xl bg-gray-950 px-3 py-1">
          {" "}
          {session?.user?.email}
        </span>
        </>
    )
  }


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
       { session ? sayHello() : "Welcome to ShahabGram App Please Sign in to your account"
}
      </h1>
    </div>
  );
}
<h1 className="mb-4">Hello </h1>;
