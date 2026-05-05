import React, { useState } from "react";
import { Store, Tag, Save, Plus, Minus } from "lucide-react";

const ALL_CHANNELS = ["당근", "콜렉티브", "번개장터", "후르츠", "인스타그램", "직거래/기타"];
const DEFAULT_CHANNELS = ["당근", "콜렉티브", "번개장터", "후르츠", "인스타그램", "직거래/기타"];

function loadChannels() {
  try { return JSON.parse(localStorage.getItem("ako_channels")) || DEFAULT_CHANNELS; }
  catch { return DEFAULT_CHANNELS; }
}

export default function SettingsView({ extraItems = [], addExtra: addExtraFn, removeExtra }) {
  const [storeName, setStoreName] = useState("AKO VINTAGE");
  const [ownerName, setOwnerName] = useState("");
  const [activeChannels, setActiveChannels] = useState(loadChannels);
  const [saved, setSaved] = useState(false);

  const [extraName, setExtraName]     = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [extraType, setExtraType]     = useState("지출");

  const addExtra = async () => {
    const amt = parseInt(extraAmount);
    if (!extraName.trim() || !amt) return;
    const amount = extraType === "지출" ? -Math.abs(amt) : Math.abs(amt);
    const { error } = await addExtraFn({ name: extraName.trim(), amount });
    if (!error) {
      setExtraName("");
      setExtraAmount("");
    }
  };

  const toggleChannel = (ch) => {
    setActiveChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleSave = () => {
    localStorage.setItem("ako_channels", JSON.stringify(activeChannels));
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

      {/* 판매 채널 */}
      <div className="bg-white p-6 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-semibold text-ako-text flex items-center gap-2 mb-5">
          <Tag size={16} className="text-ako-textLight" />
          판매 채널 관리
        </h2>
        <p className="text-xs text-ako-textLight mb-4">사용 중인 판매 채널을 선택하세요.</p>
        <div className="flex flex-wrap gap-2">
          {ALL_CHANNELS.map((ch) => (
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

        <p className="text-xs text-ako-textLight mt-1">추가된 항목은 거래 내역에서 확인할 수 있어요.</p>
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
