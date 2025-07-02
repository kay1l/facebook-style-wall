"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/custom_components/header";
import PhotoUpload from "@/components/custom_components/file_upload";

export default function Home() {
  const [wallText, setWallText] = useState("");
  const maxChars = 280;
  const remainingChars = maxChars - wallText.length;
  const posts = [
    {
      name: "Anna",
      message:
        "Hey Greg, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
      timestamp: "2 mins ago",
    },
    {
      name: "Adelaida",
      message:
        "Greg, saw your last coding session—pretty sure you broke Stack Overflow again! 🧯",
      timestamp: "5 mins ago",
    },
    {
      name: "Juho",
      message:
        "Greg, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
      timestamp: "10 mins ago",
    },
    {
      name: "Maija",
      message:
        "Greg, rumor has it your computer has more stickers than code running on it. Confirm?",
      timestamp: "15 mins ago",
    },
    {
      name: "Alex",
      message:
        "Yo Greg, just pulled an all-nighter on the assignment. Turns out sleep deprivation doesn’t improve coding skills. Weird!",
      timestamp: "20 mins ago",
    },
    {
      name: "Sheryl",
      message:
        "Greg, when are we gonna deploy your latest dance moves to production? #AgileDancer",
      timestamp: "30 mins ago",
    },
  ];

  return (
    <div className="max-w-12xl mx-auto p-4">
      <Header />
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <Image
            src="/images/kyle.png"
            alt="Greg Wientjes"
            width={200}
            height={100}
            className="rounded"
          />
          <div className="border rounded-lg mt-4 p-4 w-full text-sm shadow-sm bg-white">
            <p className="font-bold text-lg text-gray-700 border-b pb-1 mb-2">
              Information
            </p>
            <div className="mb-3">
              {/* <p className="text-blue-500 font-semibold">Information</p> */}
              <p className="text-gray-600">Kyle Gomez</p>
              <p className="text-gray-600">Web Developer</p>
            </div>

            <div className="mb-3">
              <p className="text-blue-500 font-semibold">Contacts</p>
              <p className="text-gray-600">gomezkyle3102@gmail.com</p>
              <p className="text-gray-600">09274670264</p>
            </div>

            <div>
              <p className="text-blue-500 font-semibold">Current City</p>
              <p className="text-gray-600">Ormoc City, Philippines</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-2/3">
          <p className="font-bold text-2xl">Kyle Gomez</p>
          <Separator className="mt-3 mb-3" />
          <p className="font-bold text-2xl">Wall</p>

          <div className="mt-2">
            <Textarea
              placeholder="Write something..."
              value={wallText}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) {
                  setWallText(e.target.value);
                }
              }}
              className="border-2 border-dashed border-gray-400 rounded bg-white min-h-[100px]"
            />

            <div className="text-xs text-gray-500 mt-3 bottom-2 right-2">
              {remainingChars} characters remaining
            </div>
            <div className="mt-2">
              <PhotoUpload
                onFileSelect={(file) => console.log("Selected file:", file)}
              />
            </div>
            <div className="mt-2 flex justify-end">
              <Button className="bg-blue-500 text-white rounded px-8">
                Share
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {posts.map((post, idx) => (
              <div key={idx} className="border-b pb-2">
                <p className="font-bold text-md mb-1">{post.name}</p>
                <div className="flex justify-between items-center text-sm">
                  <p className="">{post.message}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {post.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
