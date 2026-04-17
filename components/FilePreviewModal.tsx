"use client";
import { useEffect } from "react";
import { CloseIcon, DownloadIcon, StarIcon } from "./Icon";

export default function FilePreviewModal ({ file, isOpen, onClose, onToggleStar, onMoveToTrash } :{ file: FileItem | null; isOpen: boolean; onClose: () => void; onToggleStar?: (file: FileItem) => void; onMoveToTrash?: (file: FileItem) => void }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !file) return null;

  const getPreviewIcon = () => {
    const ext = file.extension?.toLowerCase();
    if (ext === 'pdf') return '📄';
    if (ext === 'xlsx' || ext === 'csv') return '📊';
    if (ext === 'md') return '📝';
    if (ext === 'fig') return '🎨';
    if (ext === 'ppt') return '📽️';
    if (ext === 'zip') return '📦';
    return '📎';
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-[#e6e1d8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f0ede8] flex items-center justify-center text-2xl">{getPreviewIcon()}</div>
              <div>
                <h3 className="font-semibold text-[#2c2b28]">{file.name}</h3>
                <p className="text-xs text-[#8b877f]">{file.type} • {file.size}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-[#a39e94] hover:bg-[#f0ede8] transition-colors">
              <CloseIcon />
            </button>
          </div>
          <div className="p-4 flex items-center justify-center min-h-50">
            {file.url ? (
              <>
                {["jpg", "jpeg", "png", "gif", "webp"].includes(file.extension || "") && (
                  <img src={file.url} alt={file.name} className="max-h-50 rounded-xl object-contain" />
                )}
                {file.extension === "pdf" && (
                  <iframe src={file.url} className="w-full h-75 rounded-xl" />
                )}
                {["mp4", "webm"].includes(file.extension || "") && (
                  <video controls className="max-h-50 rounded-xl">
                    <source src={file.url} />
                  </video>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#f0ede8] flex items-center justify-center text-4xl mx-auto mb-3">{getPreviewIcon()}</div>
                <p className="text-sm text-[#5b5852]">No preview available</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 p-5 border-t border-[#e6e1d8]">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#d1cbc0] bg-white px-4 py-2.5 text-sm font-medium text-[#4a4741] transition-all hover:bg-[#faf8f5]">
              <DownloadIcon /> Download
            </button>
            {onToggleStar && (
              <button onClick={() => onToggleStar(file)} className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#d1cbc0] bg-white px-4 py-2.5 text-sm font-medium text-[#4a4741] transition-all hover:bg-[#faf8f5]">
                <StarIcon className="w-4 h-4" filled={file.isStarred} /> {file.isStarred ? "Starred" : "Star"}
              </button>
            )}
            {onMoveToTrash && !file.isTrashed && (
              <button onClick={() => onMoveToTrash(file)} className="flex-1 rounded-xl bg-[#a14f3f] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#b85c4a]">
                Move to Trash
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};