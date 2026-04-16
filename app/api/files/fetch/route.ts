import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await db.select().from(files).where(
            and(
                eq(files.userId, userId),
                eq(files.isFolder, false)
            )
        )
        return NextResponse.json({ success: true, files: data });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
    }
}