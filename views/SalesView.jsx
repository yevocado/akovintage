import React, { useState, useMemo } from "react";
import { ShoppingCart, TrendingUp, DollarSign, Package, Search, Loader2 } from "lucide-react";

const CHANNEL_STYLE = {
  "당근":       { bg: "#FFF0E6", text: "#D4622A" },
  "콜렉티브":   { bg: "#E6F0FF", text: "#2A5BD4" },
  "번개장터":   { bg: "#FFFBE6", text: "#C4920A" },
  "후르츠":     { bg: "#EDFFF0", text: "#2A9445" },
  "인스타그램": { bg: "#FDE8F5", text: "#B0286E" },
  "직거래/기타":{ bg: "#F0F0F0", text: "#666666" },
};

export default function SalesView({ soldItems = [] }) {
  const [search, setSearch] = useState("");
  const [filterChannel, setFilterChannel] = useState("전체");

  const channels = useMemo(
    () => ["전체", ...Array.from(new Set(soldItems.map((s) => s.sale_channel).filter(Boolean)))],
    [soldItems]
  );

  const filtered = useMemo(() => {
    return soldItems.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchChannel = filterChannel === "전체" || s.sale_channel === filterChannel;
      return matchSearch && matchChannel;
    });
  }, [soldItems, search, filterChannel]);

  const totalRevenue = soldItems.reduce((sum, s) => sum + (s.sale_price || 0), 0);
  const totalProfit  = soldItems.reduce((sum, s) => sum + ((s.sale_price || 0) - (s.purchase_cost || 0) - (s.shipping_cost || 0)), 0);
  const avgProfit    = soldItems.length > 0 ? Math.round(totalProfit / soldItems.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ako-text">판매 · Orders</h1>
        <p className="text-ako-textLight text-sm mt-1">판매 현황과 채널별 실적을 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "총 매출", value: `₩${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-ako-success" },
          { label: "총 수익", value: (totalProfit >= 0 ? "+" : "") + `₩${totalProfit.toLocaleString()}`, icon: TrendingUp, color: "bg-ako-primary" },
          { label: "판매 완료", value: `${soldItems.length}건`, icon: ShoppingCart, color: "bg-[#5B7FA6]" },
          { label: "건당 평균 수익", value: (avgProfit >= 0 ? "+" : "") + `₩${avgProfit.toLocaleString()}`, icon: Package, color: "bg-ako-warning" },
        ].map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className={`w-9 h-9 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon size={18} className="text-white" />
            </div>
            <p className="text-xs text-ako-textLight font-medium uppercase tracking-wider">{card.label}</p>
            <p className="text-[20px] font-bold text-ako-text mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* 검색 + 채널 필터 */}
      <div className="bg-white p-4 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ako-textLight" size={16} />
          <input
            type="text"
            placeholder="상품명 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-[9px] bg-ako-bg border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text placeholder:text-ako-textLight transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {channels.map((ch) => (
            <button
              key={ch}
              onClick={() => setFilterChannel(ch)}
              className={`px-3 py-[6px] rounded-lg text-xs font-semibold transition-colors ${
                filterChannel === ch
                  ? "bg-ako-primary text-white"
                  : "border border-ako-border text-ako-textLight hover:bg-ako-bg"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* 모바일 카드 */}
        <div className="md:hidden divide-y divide-ako-border">
          {filtered.map((item) => {
            const ch = CHANNEL_STYLE[item.sale_channel] || CHANNEL_STYLE["직거래/기타"];
            const profit = (item.sale_price || 0) - (item.purchase_cost || 0);
            return (
              <div key={item.id} className="p-4 hover:bg-ako-bg transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-ako-text">{item.name}</p>
                  <span className="text-[11px] font-bold px-[10px] py-[3px] rounded-full bg-[#E8F4E8] text-[#4A7A50]">판매완료</span>
                </div>
                <div className="flex items-center justify-between">
                  {item.sale_channel
                    ? <span className="text-[11px] font-bold px-[10px] py-[3px] rounded-full" style={{ backgroundColor: ch.bg, color: ch.text }}>{item.sale_channel}</span>
                    : <span className="text-xs text-ako-textLight">—</span>
                  }
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ako-text">₩{item.sale_price?.toLocaleString()}</p>
                    <p className={`text-xs font-semibold ${profit >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                      {profit >= 0 ? "+" : ""}₩{profit.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-ako-textLight mt-1">{item.purchase_date}</p>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-6 py-12 text-center text-ako-textLight text-sm">판매 내역이 없어요.</p>
          )}
        </div>

        {/* 데스크탑 테이블 */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ako-tableHeader border-b border-ako-border">
                {["상품", "채널", "사입원가", "판매가", "수익", "상태", "사입일"].map((h) => (
                  <th key={h} className="px-[14px] py-[11px] text-[13px] font-semibold text-ako-textLight">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const ch = CHANNEL_STYLE[item.sale_channel] || CHANNEL_STYLE["직거래/기타"];
                const profit = (item.sale_price || 0) - (item.purchase_cost || 0);
                return (
                  <tr key={item.id} className="border-b border-ako-border hover:bg-ako-bg transition-colors">
                    <td className="px-[14px] py-[12px]">
                      <p className="text-[13px] font-semibold text-ako-text">{item.name}</p>
                      <p className="text-xs text-ako-textLight">{item.purchase_location}</p>
                    </td>
                    <td className="px-[14px] py-[12px]">
                      {item.sale_channel
                        ? <span className="text-[12px] font-bold px-[10px] py-[3px] rounded-full" style={{ backgroundColor: ch.bg, color: ch.text }}>{item.sale_channel}</span>
                        : <span className="text-[13px] text-ako-textLight">—</span>
                      }
                    </td>
                    <td className="px-[14px] py-[12px] text-[13px] text-ako-textLight">₩{item.purchase_cost?.toLocaleString()}</td>
                    <td className="px-[14px] py-[12px] text-[13px] font-semibold text-ako-text">₩{item.sale_price?.toLocaleString()}</td>
                    <td className="px-[14px] py-[12px]">
                      <span className={`text-[13px] font-semibold ${profit >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                        {profit >= 0 ? "+" : ""}₩{profit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-[14px] py-[12px]">
                      <span className="text-[11px] font-bold px-[10px] py-[3px] rounded-full bg-[#E8F4E8] text-[#4A7A50]">판매완료</span>
                    </td>
                    <td className="px-[14px] py-[12px] text-[13px] text-ako-textLight">{item.purchase_date}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-ako-textLight text-sm">판매 내역이 없어요.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-[14px] py-4 bg-ako-tableHeader border-t border-ako-border">
          <p className="text-xs text-ako-textLight">총 {soldItems.length}건 중 {filtered.length}건 표시</p>
        </div>
      </div>
    </div>
  );
}
