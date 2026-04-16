import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "@imagekit/nodejs";
import { getUploadAuthParams } from "@imagekit/next/server";

// Create ImageKit instance
export const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
} as any);

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const authParams = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
        });

        return NextResponse.json(authParams);
    } catch (error) {
        return NextResponse.json({ error: " failed to generate auth params for imagekit" }, { status: 500 })
    }
}
