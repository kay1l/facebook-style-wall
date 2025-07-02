"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/custom_components/header";
import PhotoUpload from "@/components/custom_components/file_upload";
import { supabase } from "@/lib/supaBaseClient";
import { getRelativeTime } from "@/lib/timeUtils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [wallText, setWallText] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const pageSize = 5; // how many posts per load
  const [lastPostCreatedAt, setLastPostCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    loadInitialPosts();
  }, []);

  const loadInitialPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(pageSize);

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
      if (data && data.length > 0) {
        setLastPostCreatedAt(data[data.length - 1].created_at);
      }
    }
  };

  const loadMorePosts = async () => {
    if (!lastPostCreatedAt) return;
    setLoadingMore(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(pageSize)
      .lt("created_at", lastPostCreatedAt);

    if (error) {
      console.error("Error loading more posts:", error);
      toast.error("Failed to load more posts.");
    } else {
      setPosts(prev => [...prev, ...(data || [])]);
      if (data && data.length > 0) {
        setLastPostCreatedAt(data[data.length - 1].created_at);
      } else {
        setLastPostCreatedAt(null); // no more posts
      }
    }
    setLoadingMore(false);
  };

  const handleShare = async (file?: File | null) => {
    if (!wallText.trim() && !file) {
      toast.error("Please enter a message or select a photo.");
      return;
    }
    setIsUploading(true);
    let imageUrl = null;

    if (file) {
      const filePath = `wall/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("wall-uploads")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        toast.error("Failed to upload photo.");
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
      toast.error("Something went wrong.");
    } else {
      setWallText("");
      setSelectedFile(null);
      setResetSignal(true);
      await loadInitialPosts(); // reload the first page to show the new post at top
      toast.success("Post shared successfully!");
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
            alt="Kyle Gomez"
            width={150}
            height={150}
            className="rounded"
          />
          <p className="font-bold mt-2 text-2xl">Kyle Gomez</p>
          <div className="border rounded-lg mt-4 p-4 w-full text-sm shadow-sm bg-white">
            <p className="font-bold text-lg text-gray-700 border-b pb-1 mb-2">
              Information
            </p>
            <p className="text-gray-600">Kyle Gomez</p>
            <p className="text-gray-600">Web Developer</p>
            <p className="text-blue-500 font-semibold mt-2">Birthday</p>
            <p className="text-gray-600">August 31, 2002</p>
            <p className="text-blue-500 font-semibold mt-2">Current City</p>
            <p className="text-gray-600">Ormoc City, Philippines</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-2/3">
          <p className="font-bold text-2xl">Wall</p>
          <div className="mt-2">
            <Textarea
              placeholder="Write something..."
              value={wallText}
              onChange={(e) => setWallText(e.target.value.slice(0, 280))}
              className="border-2 border-dashed border-gray-400 rounded bg-white min-h-[100px]"
            />
            <div className="text-xs text-gray-500 mt-1">
              {280 - wallText.length} characters remaining
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
         
            {isUploading && (
              <div className="flex flex-col items-center justify-start">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              </div>
            )}
           
          </div>

          <div className="mt-4 space-y-4">
           

            {posts.map((post, idx) => (
              <div key={idx} className="border-b pb-2">
                <p className="font-bold text-md mb-1">Kyle Gomez</p>
                <div className="flex justify-between items-center text-sm">
                  <p>{post.body}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {getRelativeTime(post.created_at)}
                  </p>
                </div>
                {post.image_url && (
                  <div className="mt-2">
                    <Image
                      src={`${post.image_url}?cache_bust=${Date.now()}`}
                      alt="Wall post image"
                      width={150}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
              </div>
            ))}

            {lastPostCreatedAt && (
              <div className="flex justify-center">
                <Button className="bg-blue-500" onClick={loadMorePosts} disabled={loadingMore}>
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
            {!lastPostCreatedAt && posts.length > 0 && (
              <p className="text-center text-sm text-gray-500">
                You’ve reached the end.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
