import React, { useMemo } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  History,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
} from "recharts";
import StatCard from "../components/StatCard";

export default function DashboardView({ inventory, isLoading, extraItems = [] }) {
  const soldItems   = useMemo(() => inventory.filter((i) => i.sale_price !== null), [inventory]);
  const unsoldItems = useMemo(() => inventory.filter((i) => i.sale_price === null), [inventory]);

  const totalProfit = useMemo(
    () =>
      soldItems.reduce((acc, i) => acc + ((i.sale_price || 0) - (i.purchase_cost || 0)), 0) +
      extraItems.reduce((acc, e) => acc + e.amount, 0),
    [soldItems, extraItems]
  );

  const totalInvested = useMemo(
    () => inventory.reduce((acc, i) => acc + (i.purchase_cost || 0), 0),
    [inventory]
  );

  const salesData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        name: `${d.getMonth() + 1}월`,
        revenue: 0,
        orders: 0,
        profit: 0,
      });
    }
    soldItems.forEach((item) => {
      const dateStr = item.sale_date || item.purchase_date;
      if (!dateStr) return;
      const monthKey = dateStr.slice(0, 7);
      const found = months.find((m) => m.key === monthKey);
      if (found) {
        found.revenue += item.sale_price || 0;
        found.profit  += (item.sale_price || 0) - (item.purchase_cost || 0);
        found.orders  += 1;
      }
    });
    return months;
  }, [soldItems]);

  const maxRevenue = useMemo(
    () => Math.max(...salesData.map((d) => d.revenue), 1),
    [salesData]
  );

  const channelStats = useMemo(() => {
    const stats = {};
    soldItems.forEach((item) => {
      const ch = item.sale_channel || "직거래/기타";
      stats[ch] = (stats[ch] || 0) + 1;
    });
    return Object.entries(stats).map(([name, count]) => ({ name, count }));
  }, [soldItems]);

  return (
    <div className="space-y-7">
      {/* 상단 타이틀 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-ako-text">안녕하세요, Manager</h1>
          <p className="text-ako-textLight text-sm mt-1">오늘의 재고 현황입니다.</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Package}     label="전체 상품"  value={inventory.length + "개"} color="bg-ako-primary" />
        <StatCard icon={ShoppingCart} label="미판매"    value={unsoldItems.length + "개"} color="bg-[#5B7FA6]" />
        <StatCard icon={DollarSign}  label="총 수익"
          value={(totalProfit >= 0 ? "+" : "") + "₩" + totalProfit.toLocaleString()}
          color="bg-ako-success"
        />
        <StatCard icon={TrendingUp}  label="총 투자금"  value={"₩" + totalInvested.toLocaleString()} color="bg-ako-warning" />
      </div>

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 매출 추이 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-semibold text-ako-text flex items-center gap-2">
              <TrendingUp size={16} className="text-ako-textLight" />
              매출 추이
            </h3>
            <select className="text-xs font-semibold text-ako-textLight bg-ako-bg border border-ako-border rounded-lg px-2 py-1 outline-none focus:border-ako-primary">
              <option>최근 6개월</option>
              <option>최근 1년</option>
            </select>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E0D5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#7A6E64", fontSize: 12 }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7A6E64", fontSize: 12 }}
                  tickFormatter={(v) =>
                    maxRevenue >= 1000000
                      ? `₩${(v / 1000000).toFixed(1)}M`
                      : `₩${(v / 10000).toFixed(0)}만`
                  }
                />
                <Tooltip
                  contentStyle={{ borderRadius: "10px", border: "1px solid #E8E0D5", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(value, name) => [
                    name === "revenue" ? `₩${value.toLocaleString()}원` : name === "profit" ? `₩${value.toLocaleString()}원` : `${value}건`,
                    name === "revenue" ? "매출" : name === "profit" ? "수익" : "판매수",
                  ]}
                />
                <Area type="monotone" dataKey="revenue" fill="#FAF7F2" stroke="#8B7355" strokeWidth={2} />
                <Bar dataKey="orders" barSize={18} fill="#D4B896" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 판매경로별 판매수 */}
        <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-ako-text mb-6 flex items-center gap-2">
            <ShoppingCart size={16} className="text-ako-textLight" />
            판매경로별 판매수
          </h3>
          <div className="h-[220px] w-full">
            {channelStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E0D5" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#3D3427", fontSize: 11, fontWeight: 600 }}
                    width={70}
                  />
                  <Tooltip
                    cursor={{ fill: "#FAF7F2" }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #E8E0D5", boxShadow: "0 4px 6px rgba(0,0,0,0.06)" }}
                    formatter={(value) => [value + "개", "판매수"]}
                  />
                  <Bar dataKey="count" fill="#8B7355" radius={[0, 4, 4, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-ako-textLight text-sm">
                판매 데이터가 없어요.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 최근 입고 현황 */}
      <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h3 className="text-[15px] font-semibold text-ako-text mb-5 flex items-center gap-2">
          <History size={16} className="text-ako-textLight" />
          최근 입고 현황
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-8 text-ako-border">
              <Loader2 className="animate-spin" />
            </div>
          ) : inventory.length === 0 ? (
            <div className="col-span-full text-center py-8 text-ako-textLight text-sm">
              상품이 없어요.
            </div>
          ) : (
            inventory.slice(0, 4).map((item) => {
              const sold = item.sale_price !== null;
              return (
                <div key={item.id} className="p-4 rounded-xl bg-ako-bg border border-ako-border relative group overflow-hidden">
                  <p className="text-[10px] font-bold text-ako-textLight uppercase tracking-widest mb-1">{item.purchase_date}</p>
                  <p className="text-sm font-bold text-ako-text truncate mb-2">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ako-textLight">₩{item.purchase_cost?.toLocaleString()}</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={sold
                        ? { background: "#E8F4E8", color: "#4A7A50" }
                        : { background: "#EEF2FF", color: "#4A5BA8" }
                      }
                    >
                      {sold ? "판매완료" : "미판매"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
