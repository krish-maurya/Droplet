import { useUser } from "@clerk/nextjs";
import { FilesIcon, FoldersIcon, StarIcon, TrashIcon } from "./Icon";

export default function SideBar({
  activeView,
  setActiveView,
  starredCount,
  trashedCount,
  foldersCount,
  filesCount,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  signOut,
}: SidebarProps) {
  const navItems = [
    { label: "All Files", icon: <FilesIcon className="w-5 h-5 text-[#3f3c36]" />, count: filesCount, view: "all-files" },
    { label: "Folders", icon: <FoldersIcon className="w-5 h-5 text-[#3f3c36]" />, count: foldersCount, view: "folders" },
    { label: "Starred", icon: <StarIcon className="w-5 h-5 text-[#3f3c36]" />, count: starredCount, view: "starred" },
    { label: "Trash", icon: <TrashIcon className="w-5 h-5 text-[#3f3c36]" />, count: trashedCount, view: "trash" },
  ];

  const { user } = useUser();

  return (
    <aside className="w-18 md:w-65 shrink-0 bg-[#ece8e1] border-r border-[#e0dbd2]">
      <div className="sticky top-0 flex flex-col h-screen py-6 px-3 md:px-4">
        <div className="mb-12 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#2c2b28] flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white text-xl font-medium">◈</span>
          </div>
          <span className="font-semibold text-[#2c2b28] tracking-tight text-2xl leading-none">Droplet</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveView(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeView === item.view
                ? "bg-white/60 shadow-sm text-[#2c2b28]"
                : "text-[#5b5852] hover:bg-white/40"
                }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="hidden md:inline text-sm font-medium">{item.label}</span>
              {item.count !== undefined && <span className="hidden md:inline ml-auto text-xs text-[#8b877f]">{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="relative pt-6 mt-auto border-t border-[#dbd5cb]">
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl border border-[#e0dbd2] bg-white p-2 shadow-lg">
              <button
                onClick={signOut}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#5b5852] hover:bg-[#f5f2ec] transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className=" w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-[#5b5852] hover:bg-white/40 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-[#2c2b28] flex items-center justify-center text-white text-[11px] font-medium shrink-0">
              {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline text-sm pr-1">{user?.firstName} {user?.lastName}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}