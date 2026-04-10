import React, { useState, useEffect } from "react";
import { Store, Bell, Tag, Save, Plus, Minus, Trash2 } from "lucide-react";

const CHANNELS = ["당근", "콜렉티브", "번개장터", "후르츠", "인스타그램", "직거래"];

export default function SettingsView() {
  const [storeName, setStoreName] = useState("AKO VINTAGE");
  const [ownerName, setOwnerName] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState(5);
  const [activeChannels, setActiveChannels] = useState(["당근", "번개장터", "인스타그램"]);
  const [saved, setSaved] = useState(false);

  // 추가 비용/수입
  const [extraItems, setExtraItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ako_extra_costs") || "[]"); }
    catch { return []; }
  });
  const [extraName, setExtraName]     = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [extraType, setExtraType]     = useState("지출"); // "지출" | "수입"

  useEffect(() => {
    localStorage.setItem("ako_extra_costs", JSON.stringify(extraItems));
  }, [extraItems]);

  const addExtra = () => {
    const amt = parseInt(extraAmount);
    if (!extraName.trim() || !amt) return;
    setExtraItems((prev) => [
      ...prev,
      { id: Date.now(), name: extraName.trim(), amount: extraType === "지출" ? -Math.abs(amt) : Math.abs(amt) },
    ]);
    setExtraName("");
    setExtraAmount("");
  };

  const removeExtra = (id) => setExtraItems((prev) => prev.filter((e) => e.id !== id));

  const toggleChannel = (ch) => {
    setActiveChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[640px]">
      <div>
        <h1 className="text-[22px] font-bold text-ako-text">설정</h1>
        <p className="text-ako-textLight text-sm mt-1">스토어 정보와 운영 환경을 설정하세요.</p>
      </div>

      {/* 스토어 정보 */}
      <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-semibold text-ako-text flex items-center gap-2 mb-5">
          <Store size={16} className="text-ako-textLight" />
          스토어 정보
        </h2>
        <div className="space-y-4">
          <div className="space-y-[5px]">
            <label className="text-[13px] text-ako-textLight font-medium">상호명</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text transition-colors"
            />
          </div>
          <div className="space-y-[5px]">
            <label className="text-[13px] text-ako-textLight font-medium">대표자 이름</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text placeholder:text-ako-textLight transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-semibold text-ako-text flex items-center gap-2 mb-5">
          <Bell size={16} className="text-ako-textLight" />
          알림 설정
        </h2>
        <div className="space-y-[5px]">
          <label className="text-[13px] text-ako-textLight font-medium">재고 부족 알림 기준</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              value={lowStockAlert}
              onChange={(e) => setLowStockAlert(parseInt(e.target.value) || 1)}
              className="w-24 px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text transition-colors"
            />
            <span className="text-sm text-ako-textLight">개 이하일 때 알림</span>
          </div>
        </div>
      </div>

      {/* 판매 채널 */}
      <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-semibold text-ako-text flex items-center gap-2 mb-5">
          <Tag size={16} className="text-ako-textLight" />
          판매 채널 관리
        </h2>
        <p className="text-xs text-ako-textLight mb-4">사용 중인 판매 채널을 선택하세요.</p>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => toggleChannel(ch)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                activeChannels.includes(ch)
                  ? "bg-ako-primary text-white border-ako-primary"
                  : "border-ako-border text-ako-textLight hover:bg-ako-bg"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* 추가 비용 / 수입 */}
      <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-semibold text-ako-text flex items-center gap-2 mb-1">
          <Plus size={16} className="text-ako-textLight" />
          기타 비용 / 수입 조정
        </h2>
        <p className="text-xs text-ako-textLight mb-5">배송비, 플랫폼 수수료, 기타 수입 등을 수동으로 추가하세요.</p>

        {/* 입력 폼 */}
        <div className="flex gap-2 mb-4">
          <div className="flex rounded-lg border border-ako-border overflow-hidden shrink-0">
            {["지출", "수입"].map((t) => (
              <button
                key={t}
                onClick={() => setExtraType(t)}
                className={`px-3 py-[9px] text-xs font-semibold transition-colors ${
                  extraType === t
                    ? t === "지출" ? "bg-ako-error text-white" : "bg-ako-success text-white"
                    : "text-ako-textLight hover:bg-ako-bg"
                }`}
              >
                {t === "지출" ? <Minus size={13} /> : <Plus size={13} />}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="항목명 (예: 플랫폼 수수료)"
            value={extraName}
            onChange={(e) => setExtraName(e.target.value)}
            className="flex-1 min-w-0 px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text placeholder:text-ako-textLight transition-colors"
          />
          <input
            type="number"
            placeholder="금액"
            value={extraAmount}
            onChange={(e) => setExtraAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addExtra()}
            className="w-28 px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text transition-colors"
          />
          <button
            onClick={addExtra}
            className="px-4 py-[9px] bg-ako-primary text-white rounded-lg text-sm font-semibold hover:bg-[#7a6348] transition-colors shrink-0"
          >
            추가
          </button>
        </div>

        {/* 목록 */}
        {extraItems.length === 0 ? (
          <p className="text-center text-ako-textLight text-xs py-4">추가된 항목이 없어요.</p>
        ) : (
          <div className="divide-y divide-ako-border border border-ako-border rounded-xl overflow-hidden">
            {extraItems.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-4 py-3 hover:bg-ako-bg transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${e.amount < 0 ? "bg-[#FDE8E8]" : "bg-[#E8F4E8]"}`}>
                    {e.amount < 0 ? <Minus size={10} className="text-ako-error" /> : <Plus size={10} className="text-ako-success" />}
                  </span>
                  <p className="text-[13px] text-ako-text">{e.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`text-[13px] font-semibold ${e.amount < 0 ? "text-ako-error" : "text-ako-success"}`}>
                    {e.amount < 0 ? "-" : "+"}₩{Math.abs(e.amount).toLocaleString()}
                  </p>
                  <button onClick={() => removeExtra(e.id)} className="text-ako-textLight hover:text-ako-error transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <div className="px-4 py-3 bg-ako-tableHeader flex justify-between">
              <p className="text-[12px] font-semibold text-ako-textLight">합계</p>
              <p className={`text-[13px] font-bold ${extraItems.reduce((s, e) => s + e.amount, 0) >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                {extraItems.reduce((s, e) => s + e.amount, 0) >= 0 ? "+" : ""}₩{extraItems.reduce((s, e) => s + e.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-[18px] py-[9px] rounded-lg text-sm font-semibold transition-colors shadow-sm ${
          saved
            ? "bg-ako-success text-white"
            : "bg-ako-primary text-white hover:bg-[#7a6348]"
        }`}
      >
        <Save size={15} />
        {saved ? "저장됐어요!" : "변경사항 저장"}
      </button>
    </div>
  );
}
