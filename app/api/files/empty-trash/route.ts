import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedFiles = await db
      .delete(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isTrash, true)
        )
      )
      .returning();

    if (deletedFiles.length === 0) {
      return NextResponse.json({ error: "No files in trash" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deletedCount: deletedFiles.length,
      files: deletedFiles,
    });

  } catch (error) {
    console.error("Error deleting files:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}