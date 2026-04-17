interface FolderItem {
  id: string;
  name: string;
  fileCount: number;
  updated: string;
  parentId?: string | null;
  isStarred?: boolean;
  isTrashed?: boolean;
  trashedAt?: string | null;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string | number;
  updated: string;
  extension?: string;
  parentId?: string | null;
  url?: string;
  isStarred?: boolean;
  isTrashed?: boolean;
  trashedAt?: string | null;
}

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  starredCount: number;
  trashedCount: number;
  foldersCount: number;
  filesCount: number;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  signOut: () => void;
}

interface FilePreviewModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStar?: (file: FileItem) => void;
  onMoveToTrash?: (file: FileItem) => void;
}