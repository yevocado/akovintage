import React, { useState } from "react";
import { Store, Bell, Tag, Save } from "lucide-react";

const CHANNELS = ["당근", "콜렉티브", "번개장터", "후르츠", "인스타그램", "직거래"];

export default function SettingsView() {
  const [storeName, setStoreName] = useState("AKO VINTAGE");
  const [ownerName, setOwnerName] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState(5);
  const [activeChannels, setActiveChannels] = useState(["당근", "번개장터", "인스타그램"]);
  const [saved, setSaved] = useState(false);

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
