import Image from "next/image";
import { UseFormRegister } from "react-hook-form/dist/types";
import { RiUpload2Fill } from "react-icons/ri";

type AvatarPickerProps = {
  name: string;
  className: string;
  error?: string;
  register: UseFormRegister<any>;
  onChange?: (file: File) => void;
};

export default function AvatarPicker({
  name,
  className,
  error,
  register,
}: AvatarPickerProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Image
        className="object rounded-full object-cover"
        alt="Default Avatar"
        width={96}
        height={96}
        src="/defaultAvatar.webp"
      />
      <button
        type="button"
        className="mt-4 flex w-fit items-center gap-2 rounded-md bg-sky-500 p-2 font-medium text-white transition-colors hover:bg-sky-600"
      >
        Upload Avatar
        <RiUpload2Fill />
      </button>
      <p className="mt-2 text-sm italic text-red-500">{error}</p>
      <input
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
        {...register(name)}
      />
    </div>
  );
}
