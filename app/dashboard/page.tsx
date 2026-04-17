"use client";

import { ArrowLeftIcon, ChevronRightIcon, CloudIcon, DeletePermanentlyIcon, FigmaIcon, FileIconSmall, FolderIconSmall, ImageIconSmall, PlusIcon, PresentationIcon, RestoreIcon, SpreadsheetIcon, StarIcon, TrashIcon, UploadIcon } from "@/components/Icon";
import FilePreviewModal from "@/components/FilePreviewModal";
import SideBar from "@/components/SideBar";
import { useClerk } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";



// Helper to get file icon based on extension
const getFileIcon = (extension: string) => {
  switch (extension.toLowerCase()) {
    case "pdf": return <FileIconSmall />;
    case "xlsx": case "csv": return <SpreadsheetIcon />;
    case "md": return <FileIconSmall />;
    case "fig": return <FigmaIcon />;
    case "ppt": return <PresentationIcon />;
    case "zip": return <ImageIconSmall />;
    default: return <FileIconSmall />;
  }
};

const getExtensionFromName = (name: string) => {
  if (!name || !name.includes(".")) return "";
  return name.split(".").pop()?.toLowerCase() || "";
};

const formatFileSize = (value: unknown) => {
  if (typeof value !== "number") return String(value ?? "-");
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const mapApiFileToUiFile = (apiFile: any): FileItem => {
  const extension = getExtensionFromName(apiFile?.name ?? "");
  return {
    id: apiFile.id,
    name: apiFile.name,
    type: apiFile.type,
    size: formatFileSize(apiFile.size),
    updated: "Today",
    extension,
    parentId: apiFile.parentId ?? null,
    url: apiFile.fileUrl ?? apiFile.url ?? "",
    isStarred: apiFile.isStarred || false,
    isTrashed: apiFile.isTrashed || false,
    trashedAt: apiFile.trashedAt || null,
  };
};

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<string>("all-files");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderStack, setFolderStack] = useState<FolderItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { signOut, user } = useClerk();

  // Helper functions for star/trash
  const toggleStar = (item: FolderItem | FileItem, type: 'folder' | 'file') => {
    if (type === 'folder') {
      setFolders(prev => prev.map(f => f.id === item.id ? { ...f, isStarred: !f.isStarred } : f));
    } else {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, isStarred: !f.isStarred } : f));
    }
  };

  const moveToTrash = (item: FolderItem | FileItem, type: 'folder' | 'file') => {
    const now = new Date().toLocaleDateString();
    if (type === 'folder') {
      setFolders(prev => prev.map(f => f.id === item.id ? { ...f, isTrashed: true, trashedAt: now } : f));
    } else {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, isTrashed: true, trashedAt: now } : f));
    }
  };

  const restoreFromTrash = (item: FolderItem | FileItem, type: 'folder' | 'file') => {
    if (type === 'folder') {
      setFolders(prev => prev.map(f => f.id === item.id ? { ...f, isTrashed: false, trashedAt: null } : f));
    } else {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, isTrashed: false, trashedAt: null } : f));
    }
  };

  const deletePermanently = (item: FolderItem | FileItem, type: 'folder' | 'file') => {
    if (type === 'folder') {
      setFolders(prev => prev.filter(f => f.id !== item.id));
    } else {
      setFiles(prev => prev.filter(f => f.id !== item.id));
    }
  };

  // Get filtered views
  const getCurrentViewData = () => {
    switch (activeView) {
      case "starred":
        return {
          folders: folders.filter(f => !f.isTrashed && f.isStarred),
          files: files.filter(f => !f.isTrashed && f.isStarred),
          title: "Starred Items",
          description: "Your favorite files and folders"
        };
      case "trash":
        return {
          folders: folders.filter(f => f.isTrashed),
          files: files.filter(f => f.isTrashed),
          title: "Trash",
          description: "Items deleted in the last 30 days"
        };
      case "folders":
        return {
          folders: folders.filter(f => !f.isTrashed && !f.parentId),
          files: [],
          title: "All Folders",
          description: "All your folders in one place"
        };
      default:
        const currentFolders = folders.filter(f => !f.isTrashed && f.parentId === currentFolderId);
        const currentFiles = files.filter(f => !f.isTrashed && f.parentId === currentFolderId);
        const currentFolder = folderStack[folderStack.length - 1];
        return {
          folders: currentFolders,
          files: currentFiles,
          title: currentFolder ? currentFolder.name : "My Workspace",
          description: currentFolder ? `Contents of ${currentFolder.name} folder` : "Organized folders and files — calm, structured, premium."
        };
    }
  };

  const { folders: viewFolders, files: viewFiles, title, description } = getCurrentViewData();
  const currentFolder = folderStack[folderStack.length - 1];

  const handleFolderClick = (folder: FolderItem) => {
    if (activeView === "trash") return;
    setFolderStack([...folderStack, folder]);
    setCurrentFolderId(folder.id);
    setActiveView("all-files");
  };

  const handleBackNavigation = () => {
    const newStack = [...folderStack];
    newStack.pop();
    setFolderStack(newStack);
    setCurrentFolderId(newStack.length > 0 ? newStack[newStack.length - 1].id : null);
  };

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const handleCreateFolder = async () => {
    if (!user) return;
    const folderName = prompt("Enter folder name:");
    if (folderName && folderName.trim() !== "") {
      try {
        const response = await fetch("/api/folder/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: folderName.trim(), userId: user.id, parentId: currentFolderId }),
        });
        if (response.ok) {
          const data = await response.json();
          setFolders((prev) => [...prev, { ...data.folder, isStarred: false, isTrashed: false }]);
        }
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file || !user) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);
      if (currentFolderId) formData.append("parentId", currentFolderId);
      const response = await fetch("/api/files/upload", { method: "POST", body: formData });
      if (response.ok) {
        const data = await response.json();
        setFiles((prev) => [...prev, mapApiFileToUiFile(data.file)]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/folder/fetch");
        if (response.ok) {
          const data = await response.json();
          setFolders((data.folders || []).map((f: any) => ({ ...f, isStarred: false, isTrashed: false })));
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
          setFiles((data.files || []).map(mapApiFileToUiFile));
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFolders();
    fetchFiles();
  }, []);

  // Counts for sidebar
  const starredCount = [...folders.filter(f => !f.isTrashed && f.isStarred), ...files.filter(f => !f.isTrashed && f.isStarred)].length;
  const trashedCount = [...folders.filter(f => f.isTrashed), ...files.filter(f => f.isTrashed)].length;
  const foldersCount = folders.filter(f => !f.isTrashed && !f.parentId).length;
  const filesCount = files.filter(f => !f.isTrashed).length;

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }} />

      <div className="relative z-10 flex min-h-screen">
        <SideBar activeView={activeView}
          setActiveView={setActiveView}
          starredCount={starredCount}
          trashedCount={trashedCount}
          foldersCount={foldersCount}
          filesCount={filesCount}
          isProfileMenuOpen={isProfileMenuOpen}
          setIsProfileMenuOpen={setIsProfileMenuOpen}
          signOut={() => signOut({ redirectUrl: "/sign-in" })}
        />

        <main className="flex-1 min-w-0 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                {folderStack.length > 0 && activeView === "all-files" && (
                  <button onClick={handleBackNavigation} className="flex items-center gap-1 text-xs text-[#5b5852] hover:text-[#2c2b28] transition-colors mr-1">
                    <ArrowLeftIcon /><span>Back</span>
                  </button>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#a39e94]">
                  <span className="text-[#5b5852] font-medium">Workspace</span>
                  <ChevronRightIcon />
                  {activeView !== "all-files" ? (
                    <span className="text-[#2c2b28]">{title}</span>
                  ) : (
                    folderStack.map((folder, idx) => (
                      <React.Fragment key={folder.id}>
                        <span className="text-[#2c2b28]">{folder.name}</span>
                        {idx < folderStack.length - 1 && <ChevronRightIcon />}
                      </React.Fragment>
                    ))
                  )}
                  {activeView === "all-files" && folderStack.length === 0 && <span className="text-[#2c2b28]">My Workspace</span>}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60"></div><span className="text-[11px] text-[#8b877f]">All systems operational</span></div>
                  <div className="w-px h-3 bg-[#d1cbc0]"></div>
                  <div className="flex items-center gap-1.5"><CloudIcon /><span className="text-[11px] text-[#8b877f]">Synced</span></div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#8b877f]">
                  <span>{viewFolders.length + viewFiles.length} items</span>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#2c2b28]">{title}</h1>
                <p className="text-sm text-[#8b877f] mt-1">{description}</p>
              </div>
              {activeView !== "trash" && (
                <div className="flex items-center gap-3">
                  <label className="group flex items-center gap-2 rounded-full border border-[#d1cbc0] bg-white/70 px-5 py-2.5 text-sm font-medium text-[#4a4741] cursor-pointer transition-all hover:bg-white">
                    <UploadIcon /><span>Upload File</span>
                    <input type="file" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }} />
                  </label>
                  <button onClick={handleCreateFolder} className="flex items-center gap-2 rounded-full bg-[#2c2b28] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#3d3b37]">
                    <PlusIcon /><span>Create Folder</span>
                  </button>
                </div>
              )}
            </div>

            {/* Folders Section */}
            {viewFolders.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-5"><span className="w-1 h-5 rounded-full bg-[#2c2b28]/40"></span><h2 className="text-sm font-medium uppercase tracking-wide text-[#8b877f]">Folders</h2><span className="text-xs text-[#b8b2a6] ml-2">{viewFolders.length} items</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {viewFolders.map((folder) => (
                    <div key={folder.id} className="group relative">
                      <div onClick={() => handleFolderClick(folder)} className="h-32 rounded-2xl bg-white/80 border border-[#e6e1d8] shadow-sm p-4 flex flex-col justify-between transition-all cursor-pointer hover:bg-white hover:border-[#d6d0c5] hover:shadow-md hover:-translate-y-0.5">
                        <div className="flex items-start justify-between">
                          <div className="w-10 h-10 rounded-xl bg-[#f0ede8] text-[#5b5852] flex items-center justify-center group-hover:bg-[#e8e2d8] transition-colors"><FolderIconSmall /></div>
                          <div className="flex gap-1">
                            {activeView !== "trash" && (
                              <button onClick={(e) => { e.stopPropagation(); toggleStar(folder, 'folder'); }} className="p-1 rounded-lg text-[#a39e94] hover:text-[#f5a623] transition-colors">
                                <StarIcon className="w-4 h-4" filled={folder.isStarred} />
                              </button>
                            )}
                            {activeView === "trash" ? (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); restoreFromTrash(folder, 'folder'); }} className="p-1 rounded-lg text-[#a39e94] hover:text-[#2c2b28] transition-colors" title="Restore"><RestoreIcon /></button>
                                <button onClick={(e) => { e.stopPropagation(); deletePermanently(folder, 'folder'); }} className="p-1 rounded-lg text-[#a39e94] hover:text-[#a14f3f] transition-colors" title="Delete permanently"><DeletePermanentlyIcon /></button>
                              </>
                            ) : (
                              <button onClick={(e) => { e.stopPropagation(); moveToTrash(folder, 'folder'); }} className="p-1 rounded-lg text-[#a39e94] hover:text-[#a14f3f] transition-colors"><TrashIcon className="w-4 h-4" /></button>
                            )}
                          </div>
                        </div>
                        <div><h3 className="font-medium text-[#2c2b28] text-base truncate">{folder.name}</h3><p className="text-xs text-[#a39e94] mt-0.5">{folder.fileCount} files • Updated {folder.updated}</p>{folder.trashedAt && <p className="text-[10px] text-[#a39e94] mt-0.5">Trashed {folder.trashedAt}</p>}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files Section */}
            {viewFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-5"><span className="w-1 h-5 rounded-full bg-[#2c2b28]/30"></span><h2 className="text-sm font-medium uppercase tracking-wide text-[#8b877f]">Files</h2><span className="text-xs text-[#b8b2a6] ml-2">{viewFiles.length} items</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {viewFiles.map((file) => (
                    <div key={file.id} className="group relative">
                      <div onClick={() => handleFileClick(file)} className="h-28 rounded-2xl bg-white/80 border border-[#e6e1d8] shadow-sm p-4 flex flex-col justify-between transition-all cursor-pointer hover:bg-white hover:border-[#d6d0c5] hover:shadow-md hover:-translate-y-0.5">
                        <div className="flex items-start justify-between">
                          <div className="w-9 h-9 rounded-lg bg-[#f0ede8] text-[#5b5852] flex items-center justify-center group-hover:bg-[#e8e2d8] transition-colors">{getFileIcon(file.extension || "default")}</div>
                          <div className="flex gap-1">
                            {activeView !== "trash" && (
                              <button onClick={(e) => { e.stopPropagation(); toggleStar(file, 'file'); }} className="p-1 rounded-lg text-[#a39e94] hover:text-[#f5a623] transition-colors">
                                <StarIcon className="w-4 h-4" filled={file.isStarred} />
                              </button>
                            )}
                            {activeView === "trash" ? (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); restoreFromTrash(file, 'file'); }} className="p-1 rounded-lg text-[#a39e94] hover:text-[#2c2b28] transition-colors" title="Restore"><RestoreIcon /></button>
                                <button onClick={(e) => { e.stopPropagation(); deletePermanently(file, 'file'); }} className="p-1 rounded-lg text-[#a39e94] hover:text-[#a14f3f] transition-colors" title="Delete permanently"><DeletePermanentlyIcon /></button>
                              </>
                            ) : (
                              <button onClick={(e) => { e.stopPropagation(); moveToTrash(file, 'file'); }} className="p-1 rounded-lg text-[#a39e94] hover:text-[#a14f3f] transition-colors"><TrashIcon className="w-4 h-4" /></button>
                            )}
                          </div>
                        </div>
                        <div><h4 className="font-medium text-[#2c2b28] text-sm truncate">{file.name}</h4><div className="flex justify-between items-center mt-1"><p className="text-[11px] text-[#a39e94]">{file.size}</p><p className="text-[10px] text-[#b8b2a6]">{file.updated}</p></div>{file.trashedAt && <p className="text-[9px] text-[#a39e94] mt-0.5">Trashed {file.trashedAt}</p>}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {viewFolders.length === 0 && viewFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#f0ede8] flex items-center justify-center mb-4"><FolderIconSmall className="w-8 h-8 text-[#a39e94]" /></div>
                <h3 className="text-lg font-medium text-[#2c2b28]">{activeView === "trash" ? "Trash is empty" : activeView === "starred" ? "No starred items" : "This folder is empty"}</h3>
                <p className="text-sm text-[#8b877f] mt-1">{activeView === "trash" ? "Deleted items will appear here" : activeView === "starred" ? "Star your favorite files and folders" : "Upload files or create a new folder to get started."}</p>
                {activeView !== "trash" && activeView !== "starred" && (
                  <div className="flex gap-3 mt-6">
                    <label className="flex items-center gap-2 rounded-full border border-[#d1cbc0] bg-white px-5 py-2 text-sm font-medium text-[#4a4741] cursor-pointer hover:bg-[#faf8f5] transition">
                      <UploadIcon /> Upload File
                      <input type="file" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }} />
                    </label>
                    <button onClick={handleCreateFolder} className="flex items-center gap-2 rounded-full bg-[#2c2b28] px-5 py-2 text-sm font-medium text-white hover:bg-[#3d3b37] transition">
                      <PlusIcon /> Create Folder
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="h-12"></div>
          </div>
        </main>
      </div>

      <FilePreviewModal file={selectedFile} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedFile(null); }} onToggleStar={(file) => toggleStar(file, 'file')} onMoveToTrash={(file) => moveToTrash(file, 'file')} />
    </div>
  );
}