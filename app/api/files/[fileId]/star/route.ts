import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> | { fileId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  Handle both Promise and normal object
    const params = await Promise.resolve(props.params);
    const fileId = params?.fileId;

    if (!fileId) {
      return NextResponse.json({ error: "File id is required" }, { status: 400 });
    }

    //  Fetch file
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    //  Toggle star correctly
    const [updatedFile] = await db
      .update(files)
      .set({ isStarred: !file.isStarred })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    return NextResponse.json({ success: true, file: updatedFile });

  } catch (error) {
    console.error("Error toggling star status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}