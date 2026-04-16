import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // pars request body
        const body = await request.json()
        const { imagekit, userId: bodyUserId } = body;

        if (userId !== bodyUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!imagekit || !imagekit.url) {
            return NextResponse.json({ error: "Invalid file upload data" }, { status: 400 })
        }

        const fileData = {
            name: imagekit.name || "Unnamed File",
            path: imagekit.filePath || `/droplet/${userId}/${imagekit.name}`, // default path based on user ID
            size: imagekit.size || 0,
            type: imagekit.fileType || "file",
            fileUrl: imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId: userId,
            parentId: null,
            isFolder: false,
            isStarred: false,
            isTrash: false,
        };

        const newFile = await db.insert(files).values(fileData).returning();
        return NextResponse.json({ message: "File uploaded successfully", file: newFile });

    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}
