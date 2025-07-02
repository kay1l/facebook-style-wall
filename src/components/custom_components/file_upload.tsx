"use client";

import { useRef, useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";

export default function PhotoUpload({
  onFileSelect,
  resetSignal
}: {
  onFileSelect: (file: File) => void;
  resetSignal?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    } else {
      alert("File must be JPG, PNG, or GIF and under 5MB.");
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset preview if parent triggers reset
  useEffect(() => {
    if (resetSignal) {
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // clear file input
      }
    }
  }, [resetSignal]);

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
      onClick={handleClick}
    >
      <ImageIcon className="mx-auto text-gray-400" size={32} />
      <p className="text-gray-600 font-semibold">
        Click to add photo <span className="font-normal">(optional)</span>
      </p>
      <p className="text-xs text-gray-400 mb-2">JPG, PNG, GIF up to 5MB</p>

      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Selected preview"
            className="max-h-48 mx-auto rounded border"
          />
        </div>
      )}

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
