"use client"

import { useForm } from "react-hook-form";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";

export default function SignInForm() {

    const router = useRouter();
    const { signIn } = useSignIn();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {

        if (!signIn) return;
        setIsSubmitting(true);
        setAuthError(null);

        try {
            const signInRes = await signIn.create({
                identifier: data.identifier,
            });
            if(signInRes.error){
                setAuthError(signInRes.error.message);
                return;
            }
            const res = await signIn.password({
                password: data.password
            })

            if (res.error) {
                console.error(res.error);
                setAuthError(res.error.message);
                return;
            } else {
                const finalizeRes = await signIn.finalize();
                if (finalizeRes.error) {
                    console.error("finalize error", finalizeRes.error);
                    setAuthError(finalizeRes.error.message);
                    return;
                }
                router.push("/dashboard")
            }

        } catch (error: any) {
            console.error("SignIn error:", error);

            setAuthError(
                error?.errors?.[0]?.message ||
                "An error occurred during the sign-in process"
            );

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm flex flex-col gap-6">

                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
                    <p className="text-sm text-gray-500">Sign in to your account.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* Email / Username */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            {...register("identifier")}
                            className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-sm outline-none focus:ring-2 transition
                ${errors.identifier
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-200"
                                }`}
                        />
                        {errors.identifier && (
                            <p className="text-xs text-red-500">{errors.identifier.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <a href="/forgot-password" className="text-xs text-blue-500 hover:underline">
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-sm outline-none focus:ring-2 transition
                ${errors.password
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-200"
                                }`}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Auth error */}
                    {authError && (
                        <p className="text-sm text-center text-red-500">{authError}</p>
                    )}

                    

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium transition hover:bg-gray-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                {/* Sign up link */}
                <p className="text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <a href="/sign-up" className="text-blue-500 font-medium hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
