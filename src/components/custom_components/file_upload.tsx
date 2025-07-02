"use client";

import { useRef } from "react";
import { ImageIcon } from "lucide-react";

export default function PhotoUpload({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) { 
      onFileSelect(file);
    } else {
      alert("File must be JPG, PNG, or GIF and under 5MB.");
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
      onClick={handleClick}
    >
      <ImageIcon className="mx-auto text-gray-400" size={32} />
      <p className="text-gray-600 font-semibold">Click to add photo <span className="font-normal">(optional)</span></p>
      <p className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</p>
      <input
        type="file"
        accept="image/png, image/jpeg, image/gif"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
