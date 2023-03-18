"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { UseFormRegister } from "react-hook-form/dist/types";
import { RiUpload2Fill } from "react-icons/ri";

type AvatarPickerProps = {
  name: string;
  className: string;
  error?: string;
  register: UseFormRegister<any>;
};

export default function AvatarPicker({
  name,
  className,
  error,
  register,
}: AvatarPickerProps) {
  const [src, setSrc] = useState("/defaultAvatar.webp");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register(name, {
    onChange: (e) => {
      setFileName(e?.target?.files?.[0].name || ""); 
      setSrc(URL.createObjectURL(e?.target?.files?.[0]) || "") 
    },
  });

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Image
        className="object rounded-full object-cover w-24 h-24"
        alt="Default Avatar"
        width={96}
        height={96}
        src={src}
      />
      <button
        type="button"
        onClick={() => inputRef?.current?.click()}
        className="mt-4 flex w-fit items-center gap-2 rounded-md bg-sky-500 p-2 font-medium text-white transition-colors hover:bg-sky-600"
      >
        {fileName || "Upload Avatar"}
        <RiUpload2Fill />
      </button>
      <p className="mt-2 text-sm italic text-red-500">{error}</p>
      <input
        type="file"
        hidden
        accept="image/png, image/jpeg, image/gif, image/webp"
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
        {...rest}
      />
    </div>
  );
}
