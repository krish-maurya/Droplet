import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { ImageKit } from "@imagekit/nodejs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
} as any);


export async function POST(request: NextRequest) {
    try {

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // parse form data from body
        const formData = await request.formData();
        const file = formData.get("file") as File
        const FormUserId = formData.get("userId") as string
        const parentId = formData.get("parentId") as string

        if (FormUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        if (parentId) {
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),
                        eq(files.userId, userId),
                        eq(files.isFolder, true)
                    )
                )
            if (!parentFolder) {
                return NextResponse.json({ error: "Parent folder not found" }, { status: 404 })
            }
        }

        if (file.type.startsWith("image/") || file.type !== "application/pdf") {
            // upload file to imagekit
            const buffer = await file.arrayBuffer();
            const fileBuffer = Buffer.from(buffer);
            const base64File = fileBuffer.toString("base64");

            const folderPath = parentId
                ? `/droplet/${userId}/folder/${parentId}`
                : `/droplet/${userId}/`;

            const originalFileName = file.name;
            const fileExtension = originalFileName.split(".").pop() || "";

            // validation
            if (!originalFileName || !fileExtension) {
                return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
            }

            const uniqueName = `${uuidv4()}.${fileExtension}`;

            const result = await imagekit.files.upload({
                file: `data:${file.type};base64,${base64File}`,
                fileName: uniqueName,
                folder: folderPath,
                useUniqueFileName: false,
            });

            const fileData = {
                id: uuidv4(),
                name: originalFileName,
                path: result.filePath ?? "",
                size: file.size,
                type: file.type,
                fileUrl: result.url ?? "",
                thumbnailUrl: result.thumbnailUrl ?? null,
                userId,
                parentId,
                isFolder: false,
                isDeleted: false,
                isStarred: false
            }

            const [newFile] = await db.insert(files)
                .values(fileData)
                .returning()

            return NextResponse.json({ file: newFile }, { status: 201 });

        } else {
            return NextResponse.json({ error: "Only image and PDF files are allowed" }, { status: 400 })
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}