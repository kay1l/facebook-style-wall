"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/custom_components/header";
import PhotoUpload from "@/components/custom_components/file_upload";
import { supabase } from "@/lib/supaBaseClient";
import { useEffect } from "react";
import { getRelativeTime } from "@/lib/timeUtils";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [wallText, setWallText] = useState("");
  const maxChars = 280;
  const remainingChars = maxChars - wallText.length;
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
  };

  const handleShare = async (file?: File | null) => {
    if (!wallText.trim() && !file) {
      alert("Please enter a message or select a photo.");
      return;
    }
    setIsUploading(true);
    let imageUrl = null;

    if (file) {
      const filePath = `wall/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("wall-uploads")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        alert("Failed to upload photo.");
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("wall-uploads")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
      await new Promise((res) => setTimeout(res, 500));
    }

    const { error } = await supabase.from("posts").insert([
      {
        user_id: null,
        body: wallText.trim(),
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.log("Error inserting post", error);
      alert("Something went wrong.");
    } else {
      setWallText("");
      setSelectedFile(null);
      await new Promise((res) => setTimeout(res, 2000));
      setResetSignal(true);
      await fetchPosts();
      setResetSignal(false);
    }
    setIsUploading(false);
  };

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
          <p className="font-bold mt-2 text-2xl">Kyle Gomez</p>
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
              <p className="text-blue-500 font-semibold">Birthday</p>
              <p className="text-gray-600">August 31, 2002</p>
            </div>

            <div>
              <p className="text-blue-500 font-semibold">Current City</p>
              <p className="text-gray-600">Ormoc City, Philippines</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-2/3">
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
                onFileSelect={(file) => setSelectedFile(file)}
                resetSignal={resetSignal}
              />
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                className="bg-blue-500 text-white rounded px-8"
                onClick={() => handleShare(selectedFile)}
              >
                Share
              </Button>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {isUploading && (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              </div>
            )}

            {posts.map((post, idx) => (
              <div key={idx} className="border-b pb-2">
                <p className="font-bold text-md mb-1">Kyle Gomez</p>
                <div className="flex justify-between items-center text-sm">
                  <p className="">{post.body}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {getRelativeTime(post.created_at)}
                  </p>
                </div>
                {post.image_url && (
                  <div className="mt-2">
                    <Image
                      src={`${post.image_url}?cache_bust=${Date.now()}`}
                      alt="Wall post image"
                      width={300}
                      height={200}
                      className="rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
