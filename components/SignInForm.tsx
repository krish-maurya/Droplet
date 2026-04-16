"use client";

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
        formState: { errors }
    } = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {

        if (!signIn) return;
        setIsSubmitting(true);
        setAuthError(null);

        try {
            const signInRes = await signIn.create({
                identifier: data.identifier,
            });
            if (signInRes.error) {
                setAuthError(signInRes.error.message);
                return;
            }
            const res = await signIn.password({
                password: data.password
            });

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
                router.push("/dashboard");
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
        <div className="min-h-screen bg-[#f7f5f0] flex">
            {/* Subtle grid background overlay */}
            <div 
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "32px 32px",
                }}
            />

            {/* ========== LEFT SIDE - LARGER TEXT ========== */}
<div className="hidden lg:flex lg:w-1/2 relative z-10 bg-[#ece8e1] border-r border-[#e0dbd2] items-center justify-center p-12">                <div className="max-w-md">
                    {/* Logo */}
                    <div className="mb-12">
                        <div className="w-12 h-12 rounded-xl bg-[#2c2b28] flex items-center justify-center">
                            <span className="text-white text-lg font-medium">◈</span>
                        </div>
                    </div>

                    {/* Larger text content */}
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-[#2c2b28] leading-tight">
                            Your workspace,<br />
                            <span className="text-[#8b877f]">elevated.</span>
                        </h1>
                        
                        <p className="text-lg text-[#8b877f] leading-relaxed">
                            A calm, structured environment for your folders and files. 
                            Minimal by design. Powerful by nature.
                        </p>

                        <div className="pt-8">
                            <div className="flex items-center gap-4 text-sm text-[#a39e94]">
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2c2b28]/40"></span>
                                    Organized files
                                </span>
                                <span className="w-px h-4 bg-[#d1cbc0]"></span>
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2c2b28]/40"></span>
                                    Smart folders
                                </span>
                                <span className="w-px h-4 bg-[#d1cbc0]"></span>
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2c2b28]/40"></span>
                                    Seamless sync
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== RIGHT SIDE - SIGN IN FORM (boxless, fields directly on page) ========== */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 relative z-10">
                <div className="w-full float-left max-w-sm">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#2c2b28] flex items-center justify-center">
                            <span className="text-white text-base font-medium">◈</span>
                        </div>
                    </div>

                    {/* Header - no box, just text */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#2c2b28]">Welcome back</h2>
                        <p className="text-sm text-[#8b877f] mt-1">Sign in to continue to your workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[#5b5852]">Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register("identifier")}
                                className={`w-full px-0 py-2 border-b bg-transparent text-[#2c2b28] text-base placeholder-[#cbc4b8] outline-none transition-all focus:border-[#2c2b28] ${
                                    errors.identifier
                                        ? "border-red-400"
                                        : "border-[#e0dbd2]"
                                }`}
                            />
                            {errors.identifier && (
                                <p className="text-xs text-red-500 pt-1">{errors.identifier.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-[#5b5852]">Password</label>
                                <a href="/forgot-password" className="text-xs text-[#8b877f] hover:text-[#2c2b28] transition">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={`w-full px-0 py-2 border-b bg-transparent text-[#2c2b28] text-base placeholder-[#cbc4b8] outline-none transition-all focus:border-[#2c2b28] ${
                                    errors.password
                                        ? "border-red-400"
                                        : "border-[#e0dbd2]"
                                }`}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500 pt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Auth error */}
                        {authError && (
                            <p className="text-sm text-center text-red-500">{authError}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-4 py-3 rounded-xl bg-[#2c2b28] text-white text-sm font-medium transition hover:bg-[#3d3b37] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    {/* Sign up link */}
                    <p className="text-center text-sm text-[#a39e94] mt-8">
                        Don't have an account?{" "}
                        <a href="/sign-up" className="text-[#2c2b28] font-medium hover:underline">
                            Create account
                        </a>
                    </p>

                    {/* Subtle footer line */}
                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-[#cbc4b8] tracking-wide">
                            Secure workspace • End-to-end encrypted
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}