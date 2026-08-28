"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("access_token");
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
    >
      <LogOut size={15} className="text-cyan-400" />
      Logout
    </button>
  );
}