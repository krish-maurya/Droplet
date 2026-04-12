"use client"

import { useForm } from "react-hook-form";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { z } from "zod";

//zod custom schema 
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SignUpForm() {

    const router = useRouter()
    const [verifying, setVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    const { setActive } = useClerk();
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

        } catch (error: any) {
            console.error("SignUp error : ", error)
            setAuthError(
                error.errors?.[0]?.message || "An error occured during the signup. please try again"
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
            console.log("verification success", res);
            console.log("user created successfully");

        } catch (error: any) {
            console.error("SignUp error : ", error)
            setVerificationError(
                error.errors?.[0]?.message || "An error occured during the signup. please try again"
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (verifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm flex flex-col gap-5">

                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
                        <p className="text-sm text-gray-500">Enter the 6-digit code we sent to your email.</p>
                    </div>

                    <form onSubmit={handleVerification} className="flex flex-col gap-4">
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
                            className={`w-full text-center text-2xl font-semibold tracking-widest px-4 py-3 rounded-xl border bg-gray-50 text-black placeholder-gray-400 outline-none focus:ring-2 transition
                ${verificationError
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-200"
                                }`}
                        />

                        {verificationError && (
                            <p className="text-sm text-center text-red-500">{verificationError}</p>
                        )}


                        <button
                            type="submit"
                            disabled={isSubmitting || verificationCode.length < 6}
                            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium transition hover:bg-gray-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Verifying…" : "Verify email"}
                        </button>

                        <p className="text-center text-sm text-gray-400">
                            Didn't get it?{" "}
                            <button
                                type="button"
                                onClick={async () => {
                                    setVerificationCode("");
                                    setVerificationError(null);
                                    await signUp?.verifications.sendEmailCode();
                                }}
                                className="text-blue-500 font-medium hover:underline"
                            >
                                Resend code
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    // ── Sign Up Screen ──────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm flex flex-col gap-6">

                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-gray-900">Create an account</h1>
                    <p className="text-sm text-gray-500">Sign up to get started.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            {...register("email")}
                            className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 transition
                ${errors.email
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-200"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 transition
                ${errors.password
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-200"
                                }`}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Confirm password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register("passwordConfirmation")}
                            className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 transition
                ${errors.passwordConfirmation
                                    ? "border-red-400 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-200"
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
                        className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium transition hover:bg-gray-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Creating account…" : "Create account"}
                    </button>
                </form>
                {/* Sign in link */}
                <p className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <a href="/sign-in" className="text-blue-500 font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}