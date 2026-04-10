import React, { useState, useMemo } from "react";
import { History, TrendingUp, TrendingDown, Search, Loader2 } from "lucide-react";

const TYPE_STYLE = {
  "판매": { bg: "#E8F4E8", text: "#4A7A50" },
  "입고": { bg: "#EEF2FF", text: "#4A5BA8" },
};

export default function HistoryView({ inventory = [], isLoading = false }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("전체");

  // inventory 아이템 → 입고 + 판매 이벤트로 펼치기
  const allEvents = useMemo(() => {
    const events = [];
    inventory.forEach((item) => {
      events.push({
        id: `buy-${item.id}`,
        type: "입고",
        date: item.purchase_date,
        name: item.name,
        channel: item.purchase_location || "—",
        amount: -(item.purchase_cost || 0),
      });
      if (item.sale_price !== null) {
        events.push({
          id: `sell-${item.id}`,
          type: "판매",
          date: item.purchase_date,
          name: item.name,
          channel: item.sale_channel || "직거래/기타",
          amount: item.sale_price || 0,
        });
      }
    });
    return events.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [inventory]);

  const filtered = useMemo(() => {
    return allEvents.filter((h) => {
      const matchSearch = h.name.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "전체" || h.type === filterType;
      return matchSearch && matchType;
    });
  }, [allEvents, search, filterType]);

  const totalIn  = allEvents.filter((h) => h.type === "판매").reduce((sum, h) => sum + h.amount, 0);
  const totalShipping = inventory
    .filter((i) => i.sale_price !== null)
    .reduce((sum, i) => sum + (i.shipping_cost || 0), 0);
  const totalOut = allEvents.filter((h) => h.type === "입고").reduce((sum, h) => sum + Math.abs(h.amount), 0) + totalShipping;
  const netProfit = inventory
    .filter((i) => i.sale_price !== null)
    .reduce((sum, i) => sum + ((i.sale_price || 0) - (i.purchase_cost || 0) - (i.shipping_cost || 0)), 0);

  // 월별 리포트
  const monthlyReport = useMemo(() => {
    const map = {};
    inventory.forEach((i) => {
      const buyKey = (i.purchase_date || "").slice(0, 7);
      if (buyKey) {
        if (!map[buyKey]) map[buyKey] = { month: buyKey, buyCount: 0, buyCost: 0, sellCount: 0, revenue: 0, profit: 0 };
        map[buyKey].buyCount++;
        map[buyKey].buyCost += i.purchase_cost || 0;
      }
      if (i.sale_price !== null) {
        const sellKey = (i.sale_date || i.purchase_date || "").slice(0, 7);
        if (sellKey) {
          if (!map[sellKey]) map[sellKey] = { month: sellKey, buyCount: 0, buyCost: 0, sellCount: 0, revenue: 0, profit: 0 };
          map[sellKey].sellCount++;
          map[sellKey].revenue += i.sale_price || 0;
          map[sellKey].profit  += (i.sale_price || 0) - (i.purchase_cost || 0) - (i.shipping_cost || 0);
        }
      }
    });
    return Object.values(map).sort((a, b) => b.month.localeCompare(a.month));
  }, [inventory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ako-text">거래 내역</h1>
        <p className="text-ako-textLight text-sm mt-1">입고 및 판매 내역을 시간순으로 확인하세요.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="w-9 h-9 bg-ako-success rounded-lg flex items-center justify-center mb-3">
            <TrendingUp size={18} className="text-white" />
          </div>
          <p className="text-xs text-ako-textLight font-medium uppercase tracking-wider">총 판매 수입</p>
          <p className="text-[20px] font-bold text-ako-success mt-1">+₩{totalIn.toLocaleString()}</p>
          <p className="text-[10px] text-ako-textLight mt-1">판매된 항목 판매가 합계</p>
        </div>
        <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="w-9 h-9 bg-ako-error rounded-lg flex items-center justify-center mb-3">
            <TrendingDown size={18} className="text-white" />
          </div>
          <p className="text-xs text-ako-textLight font-medium uppercase tracking-wider">총 지출</p>
          <p className="text-[20px] font-bold text-ako-error mt-1">-₩{totalOut.toLocaleString()}</p>
          <p className="text-[10px] text-ako-textLight mt-1">전체 사입비 + 배송비</p>
        </div>
        <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="w-9 h-9 bg-ako-primary rounded-lg flex items-center justify-center mb-3">
            <History size={18} className="text-white" />
          </div>
          <p className="text-xs text-ako-textLight font-medium uppercase tracking-wider">판매 순이익</p>
          <p className={`text-[20px] font-bold mt-1 ${netProfit >= 0 ? "text-ako-success" : "text-ako-error"}`}>
            {netProfit >= 0 ? "+" : ""}₩{netProfit.toLocaleString()}
          </p>
          <p className="text-[10px] text-ako-textLight mt-1">판매가 - 사입원가 - 배송비</p>
        </div>
        <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="w-9 h-9 bg-[#5B7FA6] rounded-lg flex items-center justify-center mb-3">
            <History size={18} className="text-white" />
          </div>
          <p className="text-xs text-ako-textLight font-medium uppercase tracking-wider">전체 순익</p>
          <p className={`text-[20px] font-bold mt-1 ${(totalIn - totalOut) >= 0 ? "text-ako-success" : "text-ako-error"}`}>
            {(totalIn - totalOut) >= 0 ? "+" : ""}₩{(totalIn - totalOut).toLocaleString()}
          </p>
          <p className="text-[10px] text-ako-textLight mt-1">판매수입 - 전체지출 (미판매 포함)</p>
        </div>
      </div>

      {/* 월별 리포트 */}
      <div className="bg-white rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-5 py-4 border-b border-ako-border">
          <h3 className="text-[15px] font-semibold text-ako-text">월별 리포트</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ako-tableHeader border-b border-ako-border">
                {["월", "사입", "사입비용", "판매", "매출", "순이익"].map((h) => (
                  <th key={h} className="px-4 py-[10px] text-[12px] font-semibold text-ako-textLight whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyReport.length === 0 ? (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-ako-textLight text-sm">데이터가 없어요.</td></tr>
              ) : monthlyReport.map((r) => (
                <tr key={r.month} className="border-b border-ako-border hover:bg-ako-bg transition-colors">
                  <td className="px-4 py-[11px] text-[13px] font-semibold text-ako-text">{r.month.replace("-", "년 ") + "월"}</td>
                  <td className="px-4 py-[11px] text-[13px] text-ako-textLight">{r.buyCount}건</td>
                  <td className="px-4 py-[11px] text-[13px] text-ako-error">-₩{r.buyCost.toLocaleString()}</td>
                  <td className="px-4 py-[11px] text-[13px] text-ako-textLight">{r.sellCount}건</td>
                  <td className="px-4 py-[11px] text-[13px] text-ako-success">+₩{r.revenue.toLocaleString()}</td>
                  <td className="px-4 py-[11px]">
                    <span className={`text-[13px] font-semibold ${r.profit >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                      {r.profit >= 0 ? "+" : ""}₩{r.profit.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 검색 + 필터 */}
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
        <div className="flex gap-2">
          {["전체", "판매", "입고"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-[6px] rounded-lg text-xs font-semibold transition-colors ${
                filterType === t ? "bg-ako-primary text-white" : "border border-ako-border text-ako-textLight hover:bg-ako-bg"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 거래 리스트 */}
      <div className="bg-white rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin text-ako-textLight" size={28} />
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ako-tableHeader border-b border-ako-border">
                    {["날짜", "유형", "상품명", "장소/채널", "금액"].map((h) => (
                      <th key={h} className="px-[14px] py-[11px] text-[13px] font-semibold text-ako-textLight">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const t = TYPE_STYLE[item.type] || TYPE_STYLE["입고"];
                    return (
                      <tr key={item.id} className="border-b border-ako-border hover:bg-ako-bg transition-colors">
                        <td className="px-[14px] py-[12px] text-[13px] text-ako-textLight">{item.date}</td>
                        <td className="px-[14px] py-[12px]">
                          <span className="text-[11px] font-bold px-[10px] py-[3px] rounded-full" style={{ backgroundColor: t.bg, color: t.text }}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-[14px] py-[12px] text-[13px] font-semibold text-ako-text">{item.name}</td>
                        <td className="px-[14px] py-[12px] text-[13px] text-ako-textLight">{item.channel}</td>
                        <td className="px-[14px] py-[12px]">
                          <span className={`text-[13px] font-semibold ${item.amount >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                            {item.amount >= 0 ? "+" : ""}₩{Math.abs(item.amount).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-ako-textLight text-sm">거래 내역이 없어요.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 모바일 */}
            <div className="md:hidden divide-y divide-ako-border">
              {filtered.map((item) => {
                const t = TYPE_STYLE[item.type] || TYPE_STYLE["입고"];
                return (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-ako-bg transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold px-[10px] py-[3px] rounded-full shrink-0" style={{ backgroundColor: t.bg, color: t.text }}>
                        {item.type}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ako-text">{item.name}</p>
                        <p className="text-xs text-ako-textLight">{item.date} · {item.channel}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${item.amount >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                      {item.amount >= 0 ? "+" : ""}₩{Math.abs(item.amount).toLocaleString()}
                    </span>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-6 py-12 text-center text-ako-textLight text-sm">거래 내역이 없어요.</p>
              )}
            </div>
          </>
        )}

        <div className="px-[14px] py-4 bg-ako-tableHeader border-t border-ako-border">
          <p className="text-xs text-ako-textLight">총 {allEvents.length}건 중 {filtered.length}건 표시</p>
        </div>
      </div>
    </div>
  );
}
