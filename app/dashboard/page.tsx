// app/dashboard/page.tsx
"use client";

import { useClerk } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

// ========== TYPES ==========
interface FolderItem {
  id: string;
  name: string;
  fileCount: number;
  updated: string;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  updated: string;
  extension?: string;
}

// ========== ICON COMPONENTS ==========
const FilesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
  </svg>
);

const FoldersIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h4l2 2h6A2.5 2.5 0 0 1 20.5 10.5v7A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
  </svg>
);

const StarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m12 4 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 18l-5.6 3 1.1-6.2L3 10.6l6.2-.9L12 4Z" />
  </svg>
);

const TrashIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
  </svg>
);

const UploadIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V5" />
    <path d="M7.5 9.5 12 5l4.5 4.5" />
    <path d="M5 19h14" />
  </svg>
);

const PlusIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const FolderIconSmall = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h4l2 2h6A2.5 2.5 0 0 1 20.5 10.5v7A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
  </svg>
);

const FileIconSmall = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z" />
  </svg>
);

const SpreadsheetIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 8h8M8 12h6" />
  </svg>
);

const ImageIconSmall = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-4-3 3-4-4-6 6" />
  </svg>
);

const PresentationIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 3.5h6l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z" />
  </svg>
);

const FigmaIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const CloudIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17.5 19H9a3.5 3.5 0 0 1 0-7h.5A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9z" />
  </svg>
);

// ========== DATA ==========

const files: FileItem[] = [
  { id: "1", name: "Onboarding_Guide.pdf", type: "Document", size: "1.2 MB", updated: "2h ago", extension: "PDF" },
  { id: "2", name: "Financial_Model.xlsx", type: "Spreadsheet", size: "312 KB", updated: "3d ago", extension: "XLSX" },
  { id: "3", name: "Project Canvas.md", type: "Markdown", size: "8 KB", updated: "1h ago", extension: "MD" },
  { id: "4", name: "Brand Guidelines.pdf", type: "Document", size: "4.8 MB", updated: "Today", extension: "PDF" },
  { id: "5", name: "UI Kit.fig", type: "Design", size: "18 MB", updated: "5d ago", extension: "FIG" },
  { id: "6", name: "Q4 Strategy.pptx", type: "Presentation", size: "2.1 MB", updated: "1w ago", extension: "PPT" },
  { id: "7", name: "Hero Images.zip", type: "Archive", size: "6 items", updated: "2d ago", extension: "ZIP" },
  { id: "8", name: "Sprint Plan.csv", type: "Spreadsheet", size: "480 KB", updated: "4d ago", extension: "CSV" },
];

const navItems = [
  { label: "Files", icon: <FilesIcon />, active: true },
  { label: "Folders", icon: <FoldersIcon /> },
  { label: "Starred", icon: <StarIcon />, count: 7 },
  { label: "Trash", icon: <TrashIcon />, count: 3 },
];

// Helper to get file icon based on extension
const getFileIcon = (extension: string) => {
  switch (extension.toLowerCase()) {
    case "pdf":
      return <FileIconSmall />;
    case "xlsx":
    case "csv":
      return <SpreadsheetIcon />;
    case "md":
      return <FileIconSmall />;
    case "fig":
      return <FigmaIcon />;
    case "ppt":
      return <PresentationIcon />;
    case "zip":
      return <ImageIconSmall />;
    default:
      return <FileIconSmall />;
  }
};

// ========== MAIN DASHBOARD COMPONENT ==========
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState<string>("Files");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const { signOut, user } = useClerk();

  const handleCreateFolder = async () => {
    if (!user) return;
    const folderName = prompt("Enter folder name:");
    if (folderName && folderName.trim() !== "") {
      try {
        const response = await fetch("/api/folder/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: folderName.trim(),
            userId: user.id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Folder created successfully");
          setFolders((prev) => [...prev, { id: data.id, name: folderName.trim(), fileCount: 0, updated: "Today" }]);
        }
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
  }


  const handleFileUpload = async (file: File) => {
    if (!file || !user) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);
      // if (parentId) {
      //   formData.append("parentId", parentId);
      // } 
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded successfully", data);
        setFiles((prev) => [...prev, {
          id: data.file.id,
          name: data.file.name,
          type: data.file.type,
          size: data.file.size,
          updated: "Today"
        }]);

      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(()=>{
    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/folder/fetch");
        if (response.ok) {
          const data = await response.json();
          setFolders(data.folders);
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files/fetch");
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFolders();
    fetchFiles();
  }, []);


  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      {/* Subtle grid pattern overlay */}
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

      <div className="relative z-10 flex min-h-screen">
        {/* ========== SIDEBAR ========== */}
        <aside className="w-18 md:w-65 shrink-0 bg-[#ece8e1] border-r border-[#e0dbd2]">
          <div className="sticky top-0 flex flex-col h-screen py-6 px-3 md:px-4">
            {/* Logo */}
            <div className="mb-10 flex items-center justify-center md:justify-start gap-2 px-2">
              <div className="w-8 h-8 rounded-xl bg-[#2c2b28] flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">◈</span>
              </div>
              <span className="hidden md:inline-block font-semibold text-[#2c2b28] tracking-tight text-base">
                canvas
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                    ${activeNav === item.label
                      ? "bg-white/60 shadow-sm text-[#2c2b28]"
                      : "text-[#5b5852] hover:bg-white/40"
                    }
                  `}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="hidden md:inline text-sm font-medium">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="hidden md:inline ml-auto text-xs text-[#8b877f]">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Profile Section */}
            <div
              className="relative pt-6 mt-auto border-t border-[#dbd5cb]"
              onMouseEnter={() => setIsProfileMenuOpen(true)}
              onMouseLeave={() => setIsProfileMenuOpen(false)}
            >
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#5b5852] hover:bg-white/40 transition-all"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
              >
                <div className="w-6 h-6 rounded-full bg-[#2c2b28] flex items-center justify-center text-white text-[11px] font-medium">
                  JD
                </div>
                <span className="hidden md:inline text-sm">Jamie Dawson</span>
              </button>

              {isProfileMenuOpen && (
                <div
                  className="absolute bottom-[calc(100%+8px)] left-6 right-0 md:left-10 md:right-0 rounded-xl border border-[#dbd5cb] bg-white shadow-lg p-1.5 z-20"
                  role="menu"
                >
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-[#4a4741] hover:bg-[#f6f2ea] transition-colors"
                    role="menuitem"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-[#4a4741] hover:bg-[#f6f2ea] transition-colors"
                    role="menuitem"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-[#4a4741] hover:bg-[#f6f2ea] transition-colors"
                    role="menuitem"
                  >
                    Help & Support
                  </button>
                  <div className="my-1 h-px bg-[#ece8e1]" />
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      signOut({ redirectUrl: "/sign-in" });
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-[#a14f3f] hover:bg-[#fff3ef] transition-colors"
                    role="menuitem"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <main className="flex-1 min-w-0 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

            {/* ========== BREADCRUMB & STATUS BAR ========== */}
            {/* Clean, functional elements that add value without being decorative */}
            <div className="mb-8">
              {/* Breadcrumb navigation */}
              <div className="flex items-center gap-1.5 text-xs text-[#a39e94] mb-3">
                <span className="text-[#5b5852] font-medium">Workspace</span>
                <ChevronRightIcon />
                <span className="text-[#2c2b28]">My Workspace</span>
              </div>

              {/* Status bar with useful info - clean and minimal */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60"></div>
                    <span className="text-[11px] text-[#8b877f]">All systems operational</span>
                  </div>
                  <div className="w-px h-3 bg-[#d1cbc0]"></div>
                  <div className="flex items-center gap-1.5">
                    <CloudIcon />
                    <span className="text-[11px] text-[#8b877f]">Synced</span>
                  </div>
                  <div className="w-px h-3 bg-[#d1cbc0] hidden sm:block"></div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="text-[11px] text-[#8b877f]">Last updated: just now</span>
                  </div>
                </div>

                {/* Quick stats - minimal */}
                <div className="flex items-center gap-3 text-[11px] text-[#8b877f]">
                  <span>{folders.reduce((acc, f) => acc + f.fileCount, 0) + files.length} total items</span>
                  <span className="text-[#d1cbc0]">|</span>
                  <span>{files.filter(f => f.updated === "Today" || f.updated === "1h ago" || f.updated === "2h ago").length} new today</span>
                </div>
              </div>
            </div>

            {/* ========== HEADER SECTION ========== */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2c2b28]">
                  My Workspace
                </h1>
                <p className="text-sm text-[#8b877f] mt-1">
                  Organized folders and files — calm, structured, premium.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <label className="group flex items-center gap-2 rounded-full border border-[#d1cbc0] bg-white/70 px-5 py-2.5 text-sm font-medium text-[#4a4741] cursor-pointer transition-all hover:bg-white hover:border-[#b8b0a3] hover:shadow-sm">
                  <UploadIcon />
                  <span>Upload File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                  />
                </label>
                <button onClick={() => handleCreateFolder()} className="flex items-center gap-2 rounded-full bg-[#2c2b28] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#3d3b37] hover:shadow-md">
                  <PlusIcon />
                  <span>Create Folder</span>
                </button>
              </div>
            </div>

            {/* ========== FOLDERS SECTION ========== */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1 h-5 rounded-full bg-[#2c2b28]/40"></span>
                <h2 className="text-sm font-medium uppercase tracking-wide text-[#8b877f]">
                  Folders
                </h2>
                <span className="text-xs text-[#b8b2a6] ml-2">{folders.length} items</span>
              </div>

              {/* Uniform folder grid - all cards same size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="group h-32 rounded-2xl bg-white/80 border border-[#e6e1d8] shadow-sm p-4 flex flex-col justify-between transition-all cursor-pointer hover:bg-white hover:border-[#d6d0c5] hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#f0ede8] flex items-center justify-center text-[#2c2b28] group-hover:bg-[#e8e2d8] transition-colors">
                        <FolderIconSmall />
                      </div>
                      <span className="text-[11px] text-[#b8b2a6] bg-white/60 px-2 py-0.5 rounded-full">
                        {folder.fileCount} files
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2c2b28] text-base truncate">
                        {folder.name}
                      </h3>
                      <p className="text-xs text-[#a39e94] mt-0.5">Updated {folder.updated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========== FILES SECTION ========== */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-1 h-5 rounded-full bg-[#2c2b28]/30"></span>
                <h2 className="text-sm font-medium uppercase tracking-wide text-[#8b877f]">
                  Files
                </h2>
                <span className="text-xs text-[#b8b2a6] ml-2">{files.length} items</span>
              </div>

              {/* Uniform file grid - all cards same size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="group h-28 rounded-2xl bg-white/80 border border-[#e6e1d8] shadow-sm p-4 flex flex-col justify-between transition-all cursor-pointer hover:bg-white hover:border-[#d6d0c5] hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-[#f0ede8] flex items-center justify-center text-[#5b5852] group-hover:bg-[#e8e2d8] transition-colors">
                        {getFileIcon(file.extension || "default")}
                      </div>
                      <span className="text-[10px] text-[#b8b2a6]">{file.extension}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#2c2b28] text-sm truncate">
                        {file.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[11px] text-[#a39e94]">{file.size}</p>
                        <p className="text-[10px] text-[#b8b2a6]">{file.updated}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer spacing */}
            <div className="h-12"></div>
          </div>
        </main>
      </div>
    </div>
  );
}