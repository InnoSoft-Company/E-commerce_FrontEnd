"use client"; 

import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AddNewCategorybtn() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  const handleSubmit = () => {
    console.log("Text:", text);
    console.log("Image:", image);
    // هنا تقدر تبعت البيانات للـ API
    setOpen(false);
    setText("");
    setImage(null);
    setPreview("");
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="btn-primary !py-2.5 !px-5"        
      >
        <Plus /> ADD CATEGORY
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 font-bold text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">Add Your Category</h2>

            {/* Text Input */}
            <input
              type="text"
              placeholder="Enter category"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 mb-4"
            />

            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-4"
            />

            {/* Image Preview */}
            {preview && (
              <Image
                width={200}
                height={200}
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md mb-4 border"
              />
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="btn-primary w-full !py-2.5 !px-5" 
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}