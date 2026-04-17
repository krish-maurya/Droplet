"use client";

import React from "react";

// ========== SIMPLE SPINNER LOADER ==========
export const SpinnerLoader: React.FC<{ size?: "sm" | "md" | "lg"; color?: string }> = ({ 
  size = "md", 
  color = "#2c2b28" 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-2 border-t-transparent animate-spin`}
        style={{
          borderColor: `${color}20`,
          borderTopColor: color,
        }}
      />
    </div>
  );
};

// ========== SKELETON LOADER FOR FOLDER CARDS ==========
export const FolderSkeleton: React.FC = () => (
  <div className="h-32 rounded-2xl bg-white/80 border border-[#e6e1d8] shadow-sm p-4 flex flex-col justify-between animate-pulse">
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 rounded-xl bg-[#e8e2d8]"></div>
      <div className="w-12 h-5 rounded-full bg-[#e8e2d8]"></div>
    </div>
    <div>
      <div className="h-5 w-24 bg-[#e8e2d8] rounded-md"></div>
      <div className="h-3 w-16 bg-[#e8e2d8] rounded-md mt-1"></div>
    </div>
  </div>
);

// ========== SKELETON LOADER FOR FILE CARDS ==========
export const FileSkeleton: React.FC = () => (
  <div className="h-28 rounded-2xl bg-white/80 border border-[#e6e1d8] shadow-sm p-4 flex flex-col justify-between animate-pulse">
    <div className="flex items-start justify-between">
      <div className="w-9 h-9 rounded-lg bg-[#e8e2d8]"></div>
      <div className="w-10 h-4 rounded-full bg-[#e8e2d8]"></div>
    </div>
    <div>
      <div className="h-4 w-28 bg-[#e8e2d8] rounded-md"></div>
      <div className="flex justify-between items-center mt-1">
        <div className="h-3 w-12 bg-[#e8e2d8] rounded-md"></div>
        <div className="h-3 w-10 bg-[#e8e2d8] rounded-md"></div>
      </div>
    </div>
  </div>
);

// ========== FULL PAGE LOADER ==========
export const FullPageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center">
    <div className="fixed inset-0 pointer-events-none z-0" style={{
      backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`,
      backgroundSize: "32px 32px",
    }} />
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#2c2b28] flex items-center justify-center shadow-sm animate-pulse">
        <span className="text-white text-lg font-medium">◈</span>
      </div>
      <SpinnerLoader size="lg" />
      <p className="text-sm text-[#8b877f]">Loading your workspace...</p>
    </div>
  </div>
);

// ========== CONTENT LOADER (for files and folders together) ==========
export const ContentLoader: React.FC = () => {
  const skeletonCount = 5;
  
  return (
    <div className="space-y-12">
      {/* Folders skeleton section */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-5 rounded-full bg-[#2c2b28]/40"></span>
          <div className="h-4 w-16 bg-[#e8e2d8] rounded-md animate-pulse"></div>
          <div className="h-3 w-8 bg-[#e8e2d8] rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <FolderSkeleton key={`folder-skel-${i}`} />
          ))}
        </div>
      </div>
      
      {/* Files skeleton section */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-5 rounded-full bg-[#2c2b28]/30"></span>
          <div className="h-4 w-12 bg-[#e8e2d8] rounded-md animate-pulse"></div>
          <div className="h-3 w-8 bg-[#e8e2d8] rounded-md animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <FileSkeleton key={`file-skel-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ========== INLINE LOADER (small, for buttons or sections) ==========
export const InlineLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex items-center gap-2 text-[#8b877f]">
    <SpinnerLoader size="sm" />
    <span className="text-xs">{text}</span>
  </div>
);

// ========== CARD LOADER (for modal or preview) ==========
export const CardLoader: React.FC = () => (
  <div className="bg-white rounded-2xl border border-[#e6e1d8] shadow-sm p-6 w-full max-w-md animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-[#e8e2d8]"></div>
      <div className="flex-1">
        <div className="h-5 w-32 bg-[#e8e2d8] rounded-md"></div>
        <div className="h-3 w-24 bg-[#e8e2d8] rounded-md mt-1"></div>
      </div>
    </div>
    <div className="h-40 bg-[#f0ede8] rounded-xl mb-4"></div>
    <div className="flex gap-3">
      <div className="flex-1 h-10 bg-[#e8e2d8] rounded-xl"></div>
      <div className="flex-1 h-10 bg-[#e8e2d8] rounded-xl"></div>
    </div>
  </div>
);

// ========== TABLE ROW LOADER (for list views) ==========
export const TableRowLoader: React.FC = () => (
  <div className="flex items-center gap-4 py-3 border-b border-[#e6e1d8] animate-pulse">
    <div className="w-8 h-8 rounded-lg bg-[#e8e2d8]"></div>
    <div className="flex-1 h-4 bg-[#e8e2d8] rounded-md"></div>
    <div className="w-20 h-4 bg-[#e8e2d8] rounded-md"></div>
    <div className="w-16 h-4 bg-[#e8e2d8] rounded-md"></div>
  </div>
);

// ========== DEFAULT EXPORT WITH ALL LOADERS ==========
const Loader = {
  Spinner: SpinnerLoader,
  FolderSkeleton,
  FileSkeleton,
  FullPage: FullPageLoader,
  Content: ContentLoader,
  Inline: InlineLoader,
  Card: CardLoader,
  TableRow: TableRowLoader,
};

export default Loader;