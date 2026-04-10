import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  Settings,
  User,
} from "lucide-react";
import DashboardView from "./views/DashboardView";
import InventoryView from "./views/InventoryView";
import SalesView from "./views/SalesView";
import HistoryView from "./views/HistoryView";
import SettingsView from "./views/SettingsView";
import { useInventory } from "./hooks/useInventory";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "대시보드" },
  { id: "inventory", icon: Package,         label: "재고" },
  { id: "sales",     icon: ShoppingCart,    label: "판매" },
  { id: "history",   icon: History,         label: "거래" },
  { id: "settings",  icon: Settings,        label: "설정" },
];

export default function AkoVintageApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const inventoryState = useInventory();

  useEffect(() => {
    inventoryState.fetchInventory();
  }, []);

  const renderContent = () => {
    if (activeTab === "dashboard") return <DashboardView inventory={inventoryState.inventory} isLoading={inventoryState.isLoading} />;
    if (activeTab === "inventory") return <InventoryView {...inventoryState} />;
    if (activeTab === "sales")     return <SalesView soldItems={inventoryState.soldItems} />;
    if (activeTab === "history")   return <HistoryView inventory={inventoryState.inventory} isLoading={inventoryState.isLoading} />;
    if (activeTab === "settings")  return <SettingsView />;
  };

  return (
    <div className="min-h-screen bg-ako-bg font-sans">

      {/* ── 헤더 ── */}
      <header className="h-[56px] bg-white border-b border-ako-border sticky top-0 z-30 flex items-center px-4 gap-4">
        {/* 로고 */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-ako-primary rounded-[6px] flex items-center justify-center">
            <span className="text-white font-bold text-[15px]">A</span>
          </div>
          <span className="text-[17px] font-bold tracking-[-0.3px] text-ako-text">
            AKO VINTAGE
          </span>
        </div>

        {/* 데스크탑 탭 네비 */}
        <nav className="hidden md:flex flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-4 py-[6px] rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? "bg-ako-primary text-white font-semibold"
                  : "text-ako-textLight hover:bg-ako-bg"
              }`}
            >
              <item.icon size={15} />
              <span>{item.label === "재고" ? "재고 관리" : item.label === "판매" ? "판매 · Orders" : item.label === "거래" ? "거래 내역" : item.label}</span>
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-ako-primary flex items-center justify-center cursor-pointer">
            <User size={15} className="text-white" />
          </div>
        </div>
      </header>

      {/* ── 본문 ── */}
      <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-5 md:py-7 pb-[88px] md:pb-7">
        {renderContent()}
      </main>

      {/* ── 모바일 하단 탭바 ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-ako-border">
        <div className="flex items-stretch h-[64px]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === item.id
                  ? "text-ako-primary"
                  : "text-ako-textLight"
              }`}
            >
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${activeTab === item.id ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
