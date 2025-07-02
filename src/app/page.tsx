"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/custom_components/header";
import PhotoUpload from "@/components/custom_components/file_upload";
import { getSupabaseClient } from "@/lib/supaBaseClient";
const supabase = getSupabaseClient();

import { getRelativeTime } from "@/lib/timeUtils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [wallText, setWallText] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resetSignal, setResetSignal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [lastPostCreatedAt, setLastPostCreatedAt] = useState<string | null>(
    null
  );
  const pageSize = 5;

  useEffect(() => {
    loadInitialPosts();
  }, []);

  const loadInitialPosts = async () => {
    setLoadingInitial(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(pageSize);

    if (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts.");
    } else {
      setPosts(data || []);
      if (data?.length > 0) {
        setLastPostCreatedAt(data[data.length - 1].created_at);
      }
    }
    setLoadingInitial(false);
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
      setPosts((prev) => [...prev, ...(data || [])]);
      if (data?.length > 0) {
        setLastPostCreatedAt(data[data.length - 1].created_at);
      } else {
        setLastPostCreatedAt(null);
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

    try {
      if (file) {
        const filePath = `wall/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("wall-uploads")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

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

      if (error) throw error;

      setWallText("");
      setSelectedFile(null);
      setResetSignal(true);
      await loadInitialPosts();
      toast.success("Post shared successfully!");
      setResetSignal(false);
    } catch (err) {
      console.error("Post share error", err);
      toast.error("Something went wrong while sharing.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-12xl mx-auto p-4">
      <Header />
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <Image
            src="/images/kyle.png"
            alt="Kyle Gomez"
            width={200}
            height={200}
            className=""
          />

          <div className="mt-3 w-full max-w-xs bg-white shadow-sm border rounded-lg p-4">
            <p className="font-bold text-gray-700 mb-2 border-b pb-1">
              Information
            </p>
            <p className="font-semibold text-lg text-center">Kyle Gomez</p>
            <p className="text-sm text-gray-600 text-center">Web Developer</p>
            <p className="text-xs text-gray-500 mt-2">
              <span className="font-medium text-blue-500">Birthday:</span> Aug
              31, 2002
            </p>
            <p className="text-xs text-gray-500">
              <span className="font-medium text-blue-500">City:</span> Ormoc, PH
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-2/3">
          <Textarea
            placeholder="What's on your mind?"
            value={wallText}
            onChange={(e) => setWallText(e.target.value.slice(0, 280))}
            className="border rounded p-2 bg-white min-h-[100px]"
          />
          <div className="text-xs mt-2 mb-2 text-gray-500 text-right">
            {280 - wallText.length} characters remaining
          </div>
          <PhotoUpload
            onFileSelect={setSelectedFile}
            resetSignal={resetSignal}
          />
          <div className="flex justify-end mt-2">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5"
              onClick={() => handleShare(selectedFile)}
              disabled={(!wallText.trim() && !selectedFile) || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading your post...
                </>
              ) : (
                "Share"
              )}
            </Button>
          </div>

          {loadingInitial ? (
            <div className="flex justify-center mt-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-400">
                Loading posts...
              </span>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <AnimatePresence>
                {posts.map((post, idx) => (
                  <motion.div
                    key={post.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border-b pb-3"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xl font-bold text-gray-800">Kyle Gomez</p>
                      <p className="text-xs text-gray-400">
                        {getRelativeTime(post.created_at)}
                      </p>
                    </div>
                    <p className="text-md text-gray-700">{post.body}</p>
                    {post.image_url && (
                      <div className="mt-2">
                        <Image
                          src={`${post.image_url}?cache_bust=${Date.now()}`}
                          alt="Post image"
                          width={300}
                          height={200}
                          className="rounded-md"
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {lastPostCreatedAt && (
                <div className="flex justify-center">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-1.5"
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                  >
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
                <p className="text-center text-sm text-gray-400">
                  You’ve reached the end.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
