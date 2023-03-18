"use client";

import { account } from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AppwriteException } from "appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CgSpinner } from "react-icons/cg";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Must be a valid email address"),
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginCard() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data: LoginData) => {
      const loginData = await account.createEmailSession(
        data.email,
        data.password,
      );
      return loginData;
    },
  });
  
  const loginMutation = useLoginMutation();

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        if (error instanceof AppwriteException && error.code === 401) {
          setError("email", { message: "Email or password is invalid" });
          setError("password", { message: "Email or password is invalid" });
        }
        if (error instanceof AppwriteException && error.code === 429) {
          setError("email", { message: "Too many retries. Try again in a few minutes." });
          setError("password", { message: "Too many retries. Try again in a few minutes." });
        }
      },
    });
  };

  return (
    <div className="w-1/2 max-w-lg rounded-sm bg-slate-700 p-8 shadow-sm">
      <h1 className="text-center text-2xl text-white">Welcome Back!</h1>
      <div className="text-center text-slate-300">
        <span>Glad to see you!</span>
      </div>
      <form onSubmit={handleSubmit(onLogin)}>
        <div className="mt-4">
          <label className="font-medium text-slate-200">Email address</label>
          <input
            type="text"
            autoComplete="email"
            formNoValidate
            defaultValue="test@test.com"
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
            defaultValue="Test@test1"
            {...register("password")}
            className="mt-2 w-full rounded-md border-2 border-solid border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-sky-500"
          />
          {errors.password && (
            <p className="text-sm italic text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        {loginMutation.isLoading ? (
          <button
          disabled
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
            Log In
          </button>
        )}

        <div>
          <span className="text-slate-200">Need an account?</span>{" "}
          <Link href="/signup" className="text-sky-500">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
