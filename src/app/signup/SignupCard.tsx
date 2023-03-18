"use client";

import { account, storage } from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ID, Permission, Role } from "appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { z } from "zod";
import AvatarPicker from "./AvatarPicker";

const signupSchema = z.object({
  avatar: z.any().refine((files) => files?.length == 1, "Avatar is required."),
  name: z.string().trim().min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Must be a valid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]+/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]+/, "Password must contain at least one lowercase letter")
    .regex(/\d+/, "Password must contain at least one number")
    .regex(
      /[#?!@$%^&*-]+/,
      "Password must contain at least one special character"
    ),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const router = useRouter();

  const useSignupMutation = () =>
    useMutation({
      mutationFn: async (signupData: FormData) => {
        const authData = await account.create(
          ID.unique(),
          signupData.get("email") as string,
          signupData.get("password") as string,
          signupData.get("name") as string
        );

        const avatar = signupData.get("avatar");
        let fileData = {};
        if (avatar) {
          fileData = await storage.createFile(
            process.env.NEXT_PUBLIC_USER_AVATARS_BUCKET as string,
            `${authData.$id}-avatar`,
            avatar as File,
            [Permission.read(Role.any())]
          );
        }

        const loginData = await account.createEmailSession(
          signupData.get("email") as string,
          signupData.get("password") as string
        );
        return {
          authData,
          fileData,
          loginData,
        };
      },
    });

  const signupMutation = useSignupMutation();

  const onSignup = (data: SignupData) => {
    const newData = {
      ...data,
      avatar: data.avatar.item(0) || "",
      passwordConfirm: data.password,
    };
    const formData = new FormData();
    Object.entries(newData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    signupMutation.mutate(formData, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <div className="w-1/2 max-w-lg rounded-sm bg-slate-700 p-8 shadow-sm">
      <h1 className="text-center text-2xl text-white">Create an account</h1>
      <form onSubmit={handleSubmit(onSignup)}>
        <AvatarPicker className="mt-8" name="avatar" register={register} />
        {errors.avatar && (
            <p className="text-sm text-center italic text-red-500">{errors.avatar.message?.toString()}</p>
          )}
        <div className="mt-4">
          <label className="font-medium text-slate-200">Full Name</label>
          <input
            type="text"
            autoComplete="fullname"
            formNoValidate
            {...register("name")}
            className="mt-2 w-full rounded-md border-2 border-solid border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-sky-500"
          />
          {errors.name && (
            <p className="text-sm italic text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="mt-6">
          <label className="font-medium text-slate-200">Email address</label>
          <input
            type="text"
            autoComplete="email"
            formNoValidate
            {...register("email")}
            className="mt-2 w-full rounded-md border-2 border-solid border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-sky-500"
          />
          {errors.email && (
            <p className="text-sm italic text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="mt-6">
          <label className="font-medium text-slate-200">Password</label>
          <input
            type="password"
            autoComplete="password"
            formNoValidate
            {...register("password")}
            className="mt-2 w-full rounded-md border-2 border-solid border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-sky-500"
          />
          {errors.password && (
            <p className="text-sm italic text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        {signupMutation.isLoading ? (
          <button
            type="submit"
            className="mt-6 mb-4 w-full rounded-md bg-sky-500 p-2 font-medium text-white transition-colors"
          >
            <CgSpinner className="m-auto animate-spin" size="1.5rem" />
          </button>
        ) : (
          <button
            type="submit"
            className="mt-6 mb-4 w-full rounded-md bg-sky-500 p-2 font-medium text-white transition-colors hover:bg-sky-600"
          >
            Sign Up
          </button>
        )}

        <div>
          <span className="text-slate-200">Already have an account?</span>{" "}
          <Link href="/login" className="text-sky-500">
            Log In
          </Link>
        </div>
      </form>
    </div>
  );
}
