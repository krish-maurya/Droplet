import * as z from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "please enter a vaild emial" }),
    password: z
        .string()
        .min(1, { message: "password is requried" })
        .min(8, { message: "password should be minimum of 8 characters" }),
})