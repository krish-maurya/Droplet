"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

//zod custom schema 
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FullPageLoader } from "@/components/Loader";

export default function SignUpForm() {

    const router = useRouter()
    const [verifying, setVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { signUp } = useSignUp()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
            firstName: "",
            lastName: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!signUp) return;
        setIsSubmitting(true)
        setAuthError(null)
        try {
            // STEP 1
            const signUpRes = await signUp.create({
                emailAddress: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
            });

            if (signUpRes.error) {
                setAuthError(signUpRes.error.message);
                return;
            }

            // STEP 2
            const passRes = await signUp.password({
                password: data.password,
            });

            if (passRes.error) {
                setAuthError(passRes.error.message);
                return;
            }

            // STEP 3
            const codeRes = await signUp.verifications.sendEmailCode();

            if (codeRes.error) {
                setAuthError(codeRes.error.message);
                return;
            }

            setVerifying(true);

        } catch (error: unknown) {
            console.error("SignUp error : ", error)
            setAuthError(
                error instanceof Error ? error.message : "An error occured during the signup. please try again"
            )
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!signUp) return;
        setIsSubmitting(true);
        setAuthError(null);
        try {
            const res = await signUp.verifications.verifyEmailCode({
                code: verificationCode,
            })

            //todo console result
            if (res.error) {
                console.error("verification error", res.error);
                setVerificationError(res.error.message);
            }

            const finalizeRes = await signUp.finalize({
                navigate: () => {
                    router.push("/dashboard");
                },
            })
            if (finalizeRes.error) {
                console.error("finalize error", finalizeRes.error);
                setVerificationError(finalizeRes.error.message);
                return;
            }

            setIsRedirecting(true);
            setTimeout(() => {
                router.replace("/dashboard");
            }, 500);

            console.log("verification success", res);
            console.log("user created successfully");

        } catch (error: unknown) {
            console.error("SignUp error : ", error)
            setVerificationError(
                error instanceof Error ? error.message : "An error occured during the signup. please try again"
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (verifying) {
        if (isRedirecting) {
            return <FullPageLoader />;
        }

        return (
            <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4">
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

                <div className="relative z-10 bg-white rounded-3xl border border-[#e6e1d8] shadow-sm p-8 w-full max-w-sm flex flex-col gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#f0ede8] flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#2c2b28]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold tracking-tight text-[#2c2b28]">Check your email</h2>
                        <p className="text-sm text-[#8b877f]">Enter the 6-digit code we sent to your email.</p>
                    </div>

                    <form onSubmit={handleVerification} className="flex flex-col gap-5">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="000000"
                            value={verificationCode}
                            onChange={(e) => {
                                setVerificationCode(e.target.value.replace(/\D/g, ""));
                                setVerificationError(null);
                            }}
                            className={`w-full text-center text-2xl font-semibold tracking-[0.25em] px-4 py-3 rounded-xl border bg-[#faf8f5] text-[#2c2b28] placeholder-[#cbc4b8] outline-none focus:ring-2 transition
                                ${verificationError
                                    ? "border-red-300 focus:ring-red-200"
                                    : "border-[#e6e1d8] focus:ring-[#2c2b28]/10 focus:border-[#2c2b28]/30"
                                }`}
                        />

                        {verificationError && (
                            <p className="text-sm text-center text-red-500">{verificationError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || verificationCode.length < 6}
                            className="w-full py-3 rounded-xl bg-[#2c2b28] text-white text-sm font-medium transition hover:bg-[#3d3b37] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Verifying…" : "Verify email"}
                        </button>

                        <p className="text-center text-sm text-[#a39e94]">
                            Didn&apos;t get it?{" "}
                            <button
                                type="button"
                                onClick={async () => {
                                    setVerificationCode("");
                                    setVerificationError(null);
                                    await signUp?.verifications.sendEmailCode();
                                }}
                                className="text-[#2c2b28] font-medium hover:underline"
                            >
                                Resend code
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    // ── Sign Up Screen (Split Layout) ──────────────────────────────────────────
    return (
        <div className="min-h-screen flex">
            {/* Subtle grid background */}
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
                    <div className="mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-[#2c2b28] flex items-center justify-center shadow-sm">
                            <span className="text-white text-xl font-medium">◈</span>
                        </div>
                    </div>

                    {/* Animated quote */}
                    <div className="space-y-1 min-h-[200px]">
                        <h1 className="text-5xl md:text-8xl font-semibold tracking-[-0.04em] text-[#2c2b28] leading-[0.88]">
                            Join the
                            <br />
                            <span className="text-[#8b877f]">calm workspace.</span>
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

            {/* ========== RIGHT SIDE - SIGN UP FORM ========== */}
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
                        <h2 className="text-2xl font-semibold tracking-tight text-[#2c2b28]">Create an account</h2>
                        <p className="text-sm text-[#8b877f] mt-1">Sign up to start organizing your workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        {/* Name Fields - First & Last in a row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[#5b5852]">First name</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    {...register("firstName")}
                                    className={`w-full px-4 py-2.5 rounded-xl border bg-[#faf8f5] text-sm text-[#2c2b28] placeholder-[#cbc4b8] outline-none focus:ring-2 transition
                                        ${errors.firstName
                                            ? "border-red-300 focus:ring-red-200"
                                            : "border-[#e6e1d8] focus:ring-[#2c2b28]/10 focus:border-[#2c2b28]/30"
                                        }`}
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-red-500">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-[#5b5852]">Last name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    {...register("lastName")}
                                    className={`w-full px-4 py-2.5 rounded-xl border bg-[#faf8f5] text-sm text-[#2c2b28] placeholder-[#cbc4b8] outline-none focus:ring-2 transition
                                        ${errors.lastName
                                            ? "border-red-300 focus:ring-red-200"
                                            : "border-[#e6e1d8] focus:ring-[#2c2b28]/10 focus:border-[#2c2b28]/30"
                                        }`}
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-red-500">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#5b5852]">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                {...register("email")}
                                className={`w-full px-4 py-2.5 rounded-xl border bg-[#faf8f5] text-sm text-[#2c2b28] placeholder-[#cbc4b8] outline-none focus:ring-2 transition
                                    ${errors.email
                                        ? "border-red-300 focus:ring-red-200"
                                        : "border-[#e6e1d8] focus:ring-[#2c2b28]/10 focus:border-[#2c2b28]/30"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
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

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#5b5852]">Confirm password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register("passwordConfirmation")}
                                className={`w-full px-4 py-2.5 rounded-xl border bg-[#faf8f5] text-sm text-[#2c2b28] placeholder-[#cbc4b8] outline-none focus:ring-2 transition
                                    ${errors.passwordConfirmation
                                        ? "border-red-300 focus:ring-red-200"
                                        : "border-[#e6e1d8] focus:ring-[#2c2b28]/10 focus:border-[#2c2b28]/30"
                                    }`}
                            />
                            {errors.passwordConfirmation && (
                                <p className="text-xs text-red-500">{errors.passwordConfirmation.message}</p>
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
                            className="w-full py-2.5 rounded-xl bg-[#2c2b28] text-white text-sm font-medium transition hover:bg-[#3d3b37] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                        >
                            {isSubmitting ? "Creating account…" : "Create account"}
                        </button>
                    </form>

                    {/* Sign in link */}
                    <p className="text-center text-sm text-[#a39e94] mt-6">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-[#2c2b28] font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="text-center text-[10px] text-[#cbc4b8] mt-6">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}