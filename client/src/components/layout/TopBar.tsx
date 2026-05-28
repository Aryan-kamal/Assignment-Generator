"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TopBarProps {
  userName?: string;
  onLogout?: () => void;
}

export default function TopBar({ userName, onLogout }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTitle = () => {
    if (pathname.includes("/create")) return "Create Assignment";
    if (pathname.includes("/paper")) return "AI Teacher's Toolkit";
    return "Assignment";
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2 mr-2">
          <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="font-bold text-base text-gray-900">VedaAI</span>
        </div>

        <button
          onClick={() => router.back()}
          className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
          </svg>
          {getTitle()}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <span className="text-xs font-medium text-gray-600">{initials}</span>
            </div>
            <span className="hidden lg:block text-sm font-medium text-gray-700">
              {userName || "User"}
            </span>
            <svg className="hidden lg:block w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36 z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        <button className="lg:hidden p-1 text-gray-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
