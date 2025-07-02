"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [wallText, setWallText] = useState("");

  const posts = [
    {
      name: "Anna",
      message:
        "Hey Greg, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
    },
    {
      name: "Adelaida",
      message:
        "Greg, saw your last coding session—pretty sure you broke Stack Overflow again! 🧯",
    },
    {
      name: "Juho",
      message:
        "Greg, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
    },
    {
      name: "Maija",
      message:
        "Greg, rumor has it your computer has more stickers than code running on it. Confirm?",
    },
    {
      name: "Alex",
      message:
        "Yo Greg, just pulled an all-nighter on the assignment. Turns out sleep deprivation doesn’t improve coding skills. Weird!",
    },
    {
      name: "Sheryl",
      message:
        "Greg, when are we gonna deploy your latest dance moves to production? #AgileDancer",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <Image
            src="/images/kyle.png" // Place greg.jpg in public/
            alt="Greg Wientjes"
            width={200}
            height={150}
            // className="rounded"
          />
          <div className="border rounded mt-4 p-2 w-full text-sm shadow-sm">
            <p className="font-bold border-b">Information</p>
            <div className="mt-1">
              <p className="italic">Web Developer</p>
              <p>gomezkyle3102@gmail.com</p>
              <p>Palompon Institute of Technology</p>
            </div>
            <div className="mt-1">
              <p className="italic">Current City</p>
              <p>Ormoc City, Philippines</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-2/3">
          <p className="font-bold text-lg">Kyle Gomez</p>
         <Separator className="mt-5 mb-5" />
          <p className="font-semibold">Wall</p>

          <Textarea
            placeholder="Write something..."
            value={wallText}
            onChange={(e) => setWallText(e.target.value)}
            className="border-2 border-dashed border-black rounded mt-2 bg-white"
          />
          <Button className="bg-blue-500 text-white rounded mt-2">Share</Button>

        
          <div className="mt-4 space-y-4">
            {posts.map((post, idx) => (
              <div key={idx} className="border-b pb-2">
                <p className="font-bold">{post.name}</p>
                <p>{post.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
