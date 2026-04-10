import React from "react";

export default function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? "bg-stone-800 text-stone-100 shadow-md"
          : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
      }`}
    >
      <Icon size={20} />
      {label && <span className="font-medium text-sm">{label}</span>}
    </button>
  );
}
