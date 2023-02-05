"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useLoginMutation } from "@/queries/queries";
import AvatarPicker from "./AvatarPicker";

const signupSchema = z.object({
  avatar: z.any().optional(),
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Must be a valid email address"),
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])[0-9a-zA-Z@#$%^&+=]$/,
      {
        message:
          "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character",
      }
    ),
});

type signupData = z.infer<typeof signupSchema>;

export default function LoginCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupData>({
    resolver: zodResolver(signupSchema),
  });

  const router = useRouter();
  const loginMutation = useLoginMutation();

  const onSignup = (data: signupData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };
  console.log(errors);
  return (
    <div className="w-1/2 max-w-lg rounded-sm bg-slate-700 p-8 shadow-sm">
      <h1 className="text-center text-2xl text-white">Create an account</h1>
      <form onSubmit={handleSubmit(onSignup)}>
        <AvatarPicker className="mt-8" name="avatar" register={register} />
        <div className="mt-4">
          <label className="font-medium text-slate-200">Full Name</label>
          <input
            type="text"
            autoComplete="fullname"
            formNoValidate
            {...register("fullName")}
            className="mt-2 w-full rounded-md border-2 border-solid border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-sky-500"
          />
          {errors.fullName && (
            <p className="text-sm italic text-red-500">
              {errors.fullName.message as string}
            </p>
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
              {errors.email.message as string}
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
              {errors.password.message as string}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="mt-6 mb-4 w-full rounded-md bg-sky-500 p-2 font-medium text-white transition-colors hover:bg-sky-600"
        >
          Sign Up
        </button>
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
