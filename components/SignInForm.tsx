"use client";

import { useForm } from "react-hook-form";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { useState, useEffect } from "react";
import { FullPageLoader } from "@/components/Loader";

export default function SignInForm() {

    const router = useRouter();
    const { signIn } = useSignIn();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
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
        const { error } = await signIn.password({
            emailAddress: data.identifier,
            password: data.password
        });

        if (error) {
            console.error(JSON.stringify(error, null, 2));
            setAuthError(error.message);
            return;
        }

        if (signIn.status === 'complete') {
            setIsRedirecting(true);
            
            await signIn.finalize({
                navigate: async ({ decorateUrl }) => {
                    const url = decorateUrl('/dashboard');
                    if (url.startsWith('http')) {
                        window.location.href = url;
                    } else {
                        router.push(url);
                    }
                },
            });
        } else if (signIn.status === 'needs_second_factor') {
            console.log('MFA required');
        } else if (signIn.status === 'needs_client_trust') {
            console.log('Client trust verification required');
        } else {
            console.error('Sign-in attempt not complete:', signIn.status);
        }
    } catch (error: unknown) {
        console.error("SignIn error:", error);
        setAuthError(
            error instanceof Error ? error.message :
                "An error occurred during the sign-in process"
        );
    } finally {
        setIsSubmitting(false);
        setIsRedirecting(false);
    }
};

    if (isRedirecting) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen flex">
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

            {/* ========== LEFT SIDE - BRAND SECTION ========== */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 bg-[#ece8e1] border-r border-[#e0dbd2] items-center justify-center p-12">
                <div className="max-w-md">
                    {/* Logo */}
                    <div className="mb-12 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#2c2b28] flex items-center justify-center shadow-sm shrink-0">
                            <span className="text-white text-xl font-medium">◈</span>
                        </div>
                        <span className="font-semibold text-[#2c2b28] tracking-tight text-2xl leading-none">Droplet</span>
                    </div>

                    {/* Animated quote section */}
                    <div className="space-y-1 min-h-50">
                        <h1 className="text-5xl md:text-8xl font-semibold tracking-[-0.04em] text-[#2c2b28] leading-[0.88]">
                            Welcome back to
                            <br />
                            <span className="text-[#8b877f]">your workspace.</span>
                        </h1>
                    </div>

                    {/* Features list */}
                    <div className="pt-12 mt-8 border-t border-[#d1cbc0]/50">
                        <div className="flex flex-col gap-3 text-sm text-[#8b877f]">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2c2b28]/40"></span>
                                <span>Secure file storage</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2c2b28]/40"></span>
                                <span>Smart folder organization</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2c2b28]/40"></span>
                                <span>Seamless cross-device sync</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== RIGHT SIDE - SIGN IN FORM ========== */}
            <div className="w-full lg:w-1/2 relative z-10 bg-[#f7f5f0] flex items-center justify-center px-6 md:px-12 py-8">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-[#2c2b28] flex items-center justify-center shadow-sm">
                            <span className="text-white text-lg font-medium">◈</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold tracking-tight text-[#2c2b28]">Welcome back</h2>
                        <p className="text-sm text-[#8b877f] mt-1">Sign in to continue to your workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#5b5852]">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register("identifier")}
                                className={`w-full px-4 py-2.5 rounded-xl border bg-[#faf8f5] text-sm text-[#2c2b28] placeholder-[#cbc4b8] outline-none focus:ring-2 transition
                                    ${errors.identifier
                                        ? "border-red-300 focus:ring-red-200"
                                        : "border-[#e6e1d8] focus:ring-[#2c2b28]/10 focus:border-[#2c2b28]/30"
                                    }`}
                            />
                            {errors.identifier && (
                                <p className="text-xs text-red-500">{errors.identifier.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#5b5852]">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className={`w-full px-4 py-2.5 rounded-xl border bg-[#faf8f5] text-sm text-[#2c2b28] placeholder-[#cbc4b8] outline-none focus:ring-2 transition
                                    ${errors.password
                                        ? "border-red-300 focus:ring-red-200"
                                        : "border-[#e6e1d8] focus:ring-[#2c2b28]/10 focus:border-[#2c2b28]/30"
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
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="text-[#2c2b28] font-medium hover:underline">
                            Create account
                        </Link>
                    </p>

                    {/* Terms footer */}
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