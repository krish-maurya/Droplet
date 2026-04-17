import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import DashBoardClient from "./DashBoardClient";

const getExtensionFromName = (name: string) => {
  if (!name || !name.includes(".")) return "";
  return name.split(".").pop()?.toLowerCase() || "";
};

const formatFileSize = (value: number) => {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const formatUpdated = (value: Date | string | null | undefined) => {
  if (!value) return "Today";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Today";
  return date.toLocaleDateString();
};

async function getData(userId: string) {
  const [folderRows, fileRows] = await Promise.all([
    db
      .select()
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.isFolder, true))),
    db
      .select()
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.isFolder, false))),
  ]);

  return {
    folders: folderRows.map((row) => ({
      id: row.id,
      name: row.name,
      fileCount: 0,
      updated: formatUpdated(row.updatedAt),
      parentId: row.parentId,
      isStarred: row.isStarred,
      isTrashed: row.isTrash,
      trashedAt: row.isTrash ? formatUpdated(row.updatedAt) : null,
    })),
    files: fileRows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      size: formatFileSize(row.size),
      updated: formatUpdated(row.updatedAt),
      extension: getExtensionFromName(row.name),
      parentId: row.parentId,
      url: row.fileUrl,
      isStarred: row.isStarred,
      isTrashed: row.isTrash,
      trashedAt: row.isTrash ? formatUpdated(row.updatedAt) : null,
    })),
  };
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const initialData = await getData(userId);
  return <DashBoardClient initialData={initialData} />;
}