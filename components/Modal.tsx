// app/components/Modal.tsx
"use client";

import React, { useCallback, useEffect, useRef } from "react";

// ========== CONFIRMATION MODAL ==========
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconBg: "bg-red-50",
          iconColor: "text-red-500",
          buttonBg: "bg-red-500 hover:bg-red-600",
        };
      case "warning":
        return {
          iconBg: "bg-amber-50",
          iconColor: "text-amber-500",
          buttonBg: "bg-amber-500 hover:bg-amber-600",
        };
      default:
        return {
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
          buttonBg: "bg-blue-500 hover:bg-blue-600",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm transform transition-all animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center pt-6">
            <div className={`w-12 h-12 rounded-full ${typeStyles.iconBg} flex items-center justify-center`}>
              {type === "danger" ? (
                <svg className={`w-6 h-6 ${typeStyles.iconColor}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              ) : type === "warning" ? (
                <svg className={`w-6 h-6 ${typeStyles.iconColor}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${typeStyles.iconColor}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="text-center px-6 pt-4 pb-2">
            <h3 className="text-lg font-semibold text-[#2c2b28]">{title}</h3>
            <p className="text-sm text-[#8b877f] mt-2">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e0dbd2] text-sm font-medium text-[#5b5852] transition-all hover:bg-[#faf8f5] active:scale-[0.98]"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${typeStyles.buttonBg}`}
            >
              {isLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ========== PROMPT MODAL (for folder name input) ==========
interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "Enter name",
  defaultValue = "",
  confirmText = "Create",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setValue(defaultValue);
    onClose();
  }, [defaultValue, onClose]);

  useEffect(() => {
    let focusTimer: ReturnType<typeof setTimeout> | undefined;

    if (isOpen) {
      focusTimer = setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      if (focusTimer) {
        clearTimeout(focusTimer);
      }
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      handleConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm transform transition-all animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center pt-6">
            <div className="w-12 h-12 rounded-full bg-[#f0ede8] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2c2b28]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h4l2 2h6A2.5 2.5 0 0 1 20.5 10.5v7A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center px-6 pt-4">
            <h3 className="text-lg font-semibold text-[#2c2b28]">{title}</h3>
            {message && <p className="text-sm text-[#8b877f] mt-2">{message}</p>}
          </div>

          {/* Input Field */}
          <div className="px-6 pt-5 pb-2">
            <div className={`relative rounded-xl border transition-all duration-200 ${isFocused ? "border-[#2c2b28] ring-2 ring-[#2c2b28]/10" : "border-[#e0dbd2]"}`}>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-[#faf8f5] text-[#2c2b28] text-base placeholder-[#cbc4b8] outline-none rounded-xl"
                autoComplete="off"
              />
            </div>
            <p className="text-[10px] text-[#cbc4b8] mt-2 ml-1">
              Press Enter to confirm
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e0dbd2] text-sm font-medium text-[#5b5852] transition-all hover:bg-[#faf8f5] active:scale-[0.98]"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !value.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#2c2b28] text-sm font-medium text-white transition-all hover:bg-[#3d3b37] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ========== USAGE EXAMPLE COMPONENT ==========
// This shows how to use both modals in your dashboard
export const ModalExample: React.FC = () => {
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmptyTrash = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Trash emptied");
    setIsLoading(false);
    setIsTrashModalOpen(false);
  };

  const handleCreateFolder = async (folderName: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Folder created:", folderName);
    setIsLoading(false);
    setIsFolderModalOpen(false);
  };

  return (
    <>
      {/* Buttons to trigger modals */}
      <div className="flex gap-4 p-8">
        <button
          onClick={() => setIsTrashModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Empty Trash
        </button>
        <button
          onClick={() => setIsFolderModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#2c2b28] text-white hover:bg-[#3d3b37] transition"
        >
          Create Folder
        </button>
      </div>

      {/* Confirmation Modal for Empty Trash */}
      <ConfirmationModal
        isOpen={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        onConfirm={handleEmptyTrash}
        title="Empty Trash"
        message="Are you sure you want to permanently delete all items in the Trash? This action cannot be undone."
        confirmText="Empty Trash"
        cancelText="Cancel"
        type="danger"
        isLoading={isLoading}
      />

      {/* Prompt Modal for Create Folder */}
      <PromptModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onConfirm={handleCreateFolder}
        title="New Folder"
        message="Enter a name for your new folder"
        placeholder="Folder name"
        confirmText="Create"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  );
};

// Helper useState import
import { useState } from "react";

const Modal = { ConfirmationModal, PromptModal };

export default Modal;