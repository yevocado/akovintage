import React, { useState, useRef } from "react";
import {
  Search, Plus, Edit2, Trash2, ChevronRight, ChevronLeft,
  Loader2, RefreshCw, AlertCircle, X, ShoppingBag, Camera, ImagePlus,
} from "lucide-react";
import { IS_DEMO } from "../lib/supabase";

const CHANNEL_STYLE = {
  "당근":       { bg: "#FFF0E6", text: "#D4622A" },
  "콜렉티브":   { bg: "#E6F0FF", text: "#2A5BD4" },
  "번개장터":   { bg: "#FFFBE6", text: "#C4920A" },
  "후르츠":     { bg: "#EDFFF0", text: "#2A9445" },
  "인스타그램": { bg: "#FDE8F5", text: "#B0286E" },
  "직거래/기타":{ bg: "#F0F0F0", text: "#666666" },
};

function loadChannels() {
  try { return JSON.parse(localStorage.getItem("ako_channels")) || ["당근", "콜렉티브", "번개장터", "후르츠", "인스타그램", "직거래/기타"]; }
  catch { return ["당근", "콜렉티브", "번개장터", "후르츠", "인스타그램", "직거래/기타"]; }
}
const CHANNELS = loadChannels();
const LOCATIONS = ["동묘", "올드룩교하점", "옷파는야옹이"];

function LocationSelect({ value, onChange, disabled }) {
  const isCustom = value !== "" && !LOCATIONS.includes(value);
  const [showCustom, setShowCustom] = useState(isCustom);

  const handleSelect = (e) => {
    if (e.target.value === "기타") {
      setShowCustom(true);
      onChange("");
    } else {
      setShowCustom(false);
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-[5px]">
      <label className="text-[13px] text-ako-textLight font-medium">사입처</label>
      <select
        disabled={disabled}
        value={showCustom ? "기타" : value}
        onChange={handleSelect}
        className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text disabled:opacity-50 transition-colors"
      >
        <option value="">— 선택 —</option>
        {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        <option value="기타">기타 (직접 입력)</option>
      </select>
      {showCustom && (
        <input
          autoFocus
          required
          disabled={disabled}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="직접 입력"
          className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text placeholder:text-ako-textLight disabled:opacity-50 transition-colors"
        />
      )}
    </div>
  );
}

function ChannelBadge({ channel }) {
  const s = CHANNEL_STYLE[channel] || CHANNEL_STYLE["직거래/기타"];
  return (
    <span className="text-[11px] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}>
      {channel}
    </span>
  );
}

function formatMonth(ym) {
  const [year, month] = ym.split("-");
  const currentYear = new Date().getFullYear().toString();
  return year === currentYear ? `${parseInt(month)}월` : `${year.slice(2)}년 ${parseInt(month)}월`;
}

export default function InventoryView({
  inventory, filteredInventory, unsoldItems, soldItems,
  isLoading, error, searchTerm, setSearchTerm,
  selectedMonth, setSelectedMonth, availableMonths,
  // 사입 모달
  isModalOpen, isSubmitting, editingItem, newItem, setNewItem,
  photoFile, setPhotoFile, photoPreview, setPhotoPreview,
  openModal, closeModal, handleAddItem,
  // 판매 모달
  isSellModalOpen, isSellSubmitting, sellingItem, saleInfo, setSaleInfo,
  openSellModal, closeSellModal, handleSellItem,
  // 기타
  handleDeleteItem, fetchInventory,
}) {
  const fileInputRef = useRef(null);
  const totalProfit = soldItems.reduce(
    (acc, i) => acc + ((i.sale_price || 0) - (i.purchase_cost || 0)), 0
  );

  return (
    <div className="space-y-5">
      {/* 타이틀 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-ako-text">재고 관리</h1>
          <p className="text-ako-textLight text-sm mt-1">빈티지 컬렉션을 관리하고 추적하세요.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchInventory}
            className="p-2 text-ako-textLight hover:text-ako-text border border-ako-border rounded-lg hover:bg-ako-bg transition-colors"
            title="새로고침">
            <RefreshCw size={17} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => openModal()}
            className="flex items-center gap-2 bg-ako-primary text-white px-[18px] py-[9px] rounded-lg hover:bg-[#7a6348] transition-colors text-sm font-semibold shadow-sm">
            <Plus size={16} />
            사입 등록
          </button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "전체",    value: inventory.length + "개",          color: "text-ako-text" },
          { label: "미판매",  value: unsoldItems.length + "개",         color: "text-[#4A5BA8]" },
          { label: "판매완료",value: soldItems.length + "개",            color: "text-[#4A7A50]" },
          {
            label: "총 수익",
            value: (totalProfit >= 0 ? "+" : "") + "₩" + totalProfit.toLocaleString(),
            color: totalProfit >= 0 ? "text-ako-success" : "text-ako-error",
          },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)] px-5 py-4">
            <p className="text-xs text-ako-textLight font-medium mb-1">{c.label}</p>
            <p className={`text-[20px] font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <div className="bg-white p-4 rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ako-textLight" size={16} />
          <input type="text" placeholder="상품명, 사입처 검색..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-[9px] bg-ako-bg border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text placeholder:text-ako-textLight transition-colors" />
        </div>
      </div>

      {/* 월 필터 칩 */}
      {availableMonths.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {["전체", ...availableMonths].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`shrink-0 px-4 py-[7px] rounded-full text-sm font-medium border transition-colors ${
                selectedMonth === m
                  ? "bg-ako-primary text-white border-ako-primary"
                  : "bg-white text-ako-textLight border-ako-border hover:border-ako-primary hover:text-ako-primary"
              }`}
            >
              {m === "전체" ? "전체" : formatMonth(m)}
            </button>
          ))}
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-white rounded-[14px] border border-ako-border shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        {IS_DEMO && (
          <div className="bg-[#FFF3E6] border-b border-[#F0D0B0] p-3 flex items-center gap-2 text-ako-warning text-xs">
            <AlertCircle size={13} />데모 모드로 실행 중.
          </div>
        )}
        {error && (
          <div className="bg-[#FDE8E8] border-b border-[#F0C0C0] p-3 flex items-center gap-2 text-ako-error text-xs">
            <AlertCircle size={13} />오류: {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Loader2 className="animate-spin text-ako-textLight" size={28} />
            <p className="text-xs text-ako-textLight">불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 모바일 */}
            <div className="md:hidden divide-y divide-ako-border">
              {filteredInventory.map((item) => {
                const sold = item.sale_price !== null;
                const profit = sold ? item.sale_price - item.purchase_cost - (item.shipping_cost || 0) : null;
                return (
                  <div key={item.id} className="p-4 flex items-start justify-between gap-3 hover:bg-ako-bg transition-colors">
                    {item.photo_url && (
                      <img src={item.photo_url} alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg border border-ako-border shrink-0" />
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-ako-text truncate">{item.name}</p>
                      <p className="text-xs text-ako-textLight">{item.purchase_date} · {item.purchase_location}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={sold ? { background: "#E8F4E8", color: "#4A7A50" } : { background: "#EEF2FF", color: "#4A5BA8" }}>
                          {sold ? "판매완료" : "미판매"}
                        </span>
                        {item.sale_channel && <ChannelBadge channel={item.sale_channel} />}
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-xs text-ako-textLight">사입 ₩{item.purchase_cost?.toLocaleString()}</p>
                      {sold && <p className="text-xs font-semibold text-ako-text">판매 ₩{item.sale_price?.toLocaleString()}</p>}
                      {profit !== null && (
                        <p className={`text-xs font-semibold ${profit >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                          {profit >= 0 ? "+" : ""}₩{profit.toLocaleString()}
                        </p>
                      )}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {!sold && (
                          <button onClick={() => openSellModal(item)}
                            className="p-1.5 border border-ako-success/40 text-ako-success hover:bg-[#E8F4E8] rounded-[6px] transition-all"
                            title="판매 완료">
                            <ShoppingBag size={13} />
                          </button>
                        )}
                        <button onClick={() => openModal(item)}
                          className="p-1.5 border border-ako-border text-ako-textLight hover:text-ako-text hover:bg-ako-bg rounded-[6px] transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 border border-[#FFCCC7] text-ako-error hover:bg-[#FDE8E8] rounded-[6px] transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredInventory.length === 0 && (
                <p className="px-6 py-12 text-center text-ako-textLight text-sm">상품이 없어요.</p>
              )}
            </div>

            {/* 데스크탑 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ako-tableHeader border-b border-ako-border">
                    {["상품명", "사입일", "사입처", "사입원가", "판매가", "수익", "판매경로", "상태", "관리"].map((h) => (
                      <th key={h} className="px-[14px] py-[11px] text-[13px] font-semibold text-ako-textLight">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                    const sold = item.sale_price !== null;
                    const profit = sold ? item.sale_price - item.purchase_cost - (item.shipping_cost || 0) : null;
                    return (
                      <tr key={item.id} className="border-b border-ako-border hover:bg-ako-bg transition-colors">
                        <td className="px-[14px] py-[12px]">
                          <div className="flex items-center gap-2.5">
                            {item.photo_url && (
                              <img src={item.photo_url} alt={item.name}
                                className="w-9 h-9 object-cover rounded-lg border border-ako-border shrink-0" />
                            )}
                            <p className="text-[13px] font-semibold text-ako-text">{item.name}</p>
                          </div>
                        </td>
                        <td className="px-[14px] py-[12px] text-[13px] text-ako-textLight">{item.purchase_date}</td>
                        <td className="px-[14px] py-[12px] text-[13px] text-ako-textLight">{item.purchase_location}</td>
                        <td className="px-[14px] py-[12px] text-[13px] text-ako-text">₩{item.purchase_cost?.toLocaleString()}</td>
                        <td className="px-[14px] py-[12px]">
                          {sold
                            ? <p className="text-[13px] font-semibold text-ako-text">₩{item.sale_price?.toLocaleString()}</p>
                            : <p className="text-[13px] text-ako-textLight">—</p>}
                        </td>
                        <td className="px-[14px] py-[12px]">
                          {profit !== null
                            ? <p className={`text-[13px] font-semibold ${profit >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                                {profit >= 0 ? "+" : ""}₩{profit.toLocaleString()}
                              </p>
                            : <p className="text-[13px] text-ako-textLight">—</p>}
                        </td>
                        <td className="px-[14px] py-[12px]">
                          {item.sale_channel
                            ? <ChannelBadge channel={item.sale_channel} />
                            : <span className="text-[13px] text-ako-textLight">—</span>}
                        </td>
                        <td className="px-[14px] py-[12px]">
                          <span className="text-[11px] font-bold px-[10px] py-[3px] rounded-full"
                            style={sold ? { background: "#E8F4E8", color: "#4A7A50" } : { background: "#EEF2FF", color: "#4A5BA8" }}>
                            {sold ? "판매완료" : "미판매"}
                          </span>
                        </td>
                        <td className="px-[14px] py-[12px] text-right">
                          <div className="flex items-center justify-end gap-1">
                            {!sold && (
                              <button onClick={() => openSellModal(item)}
                                className="px-2 py-1 border border-ako-success/40 text-ako-success hover:bg-[#E8F4E8] rounded-[6px] transition-all text-xs font-semibold whitespace-nowrap"
                                title="판매 완료">
                                판매 완료
                              </button>
                            )}
                            <button onClick={() => openModal(item)}
                              className="px-2 py-1 border border-ako-border text-ako-textLight hover:text-ako-text hover:bg-ako-bg rounded-[6px] transition-all">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)}
                              className="px-2 py-1 border border-[#FFCCC7] text-ako-error hover:bg-[#FDE8E8] rounded-[6px] transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-ako-textLight text-sm">상품이 없어요.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="px-[14px] py-4 bg-ako-tableHeader border-t border-ako-border flex items-center justify-between">
          <p className="text-xs text-ako-textLight font-medium">
            총 {inventory.length}개 중 {filteredInventory.length}개 표시
          </p>
          <div className="flex gap-1">
            <button className="p-1 border border-ako-border rounded-lg hover:bg-white text-ako-textLight disabled:opacity-40" disabled>
              <ChevronLeft size={15} />
            </button>
            <button className="p-1 border border-ako-border rounded-lg hover:bg-white text-ako-textLight disabled:opacity-40" disabled>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 사입 등록 / 수정 모달 ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="bg-white rounded-t-[20px] md:rounded-[16px] w-full md:max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-ako-border rounded-full" />
            </div>
            <div className="px-7 py-5 border-b border-ako-border flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-ako-text">
                {editingItem ? "사입 정보 수정" : "사입 등록"}
              </h3>
              <button onClick={closeModal} className="text-ako-textLight hover:text-ako-text transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-7 space-y-5">
              <div className="space-y-[5px]">
                <label className="text-[13px] text-ako-textLight font-medium">상품명</label>
                <input required disabled={isSubmitting} type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="예) 빈티지 가죽 자켓"
                  className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text placeholder:text-ako-textLight disabled:opacity-50 transition-colors" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="space-y-[5px]">
                  <label className="text-[13px] text-ako-textLight font-medium">사입일</label>
                  <input required disabled={isSubmitting} type="date"
                    value={newItem.purchase_date}
                    onChange={(e) => setNewItem({ ...newItem, purchase_date: e.target.value })}
                    className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text disabled:opacity-50 transition-colors" />
                </div>
                <LocationSelect
                  value={newItem.purchase_location}
                  onChange={(v) => setNewItem({ ...newItem, purchase_location: v })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-[5px]">
                <label className="text-[13px] text-ako-textLight font-medium">사입원가 (₩)</label>
                <input required disabled={isSubmitting} type="number" min="0"
                  value={newItem.purchase_cost}
                  onChange={(e) => setNewItem({ ...newItem, purchase_cost: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text disabled:opacity-50 transition-colors" />
              </div>

              {/* 사진 업로드 */}
              <div className="space-y-[5px]">
                <label className="text-[13px] text-ako-textLight font-medium">상품 사진 (선택)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPhotoFile(file);
                    const reader = new FileReader();
                    reader.onload = (ev) => setPhotoPreview(ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
                {photoPreview ? (
                  <div className="relative w-full">
                    <img
                      src={photoPreview}
                      alt="미리보기"
                      className="w-full h-48 object-cover rounded-xl border border-ako-border"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => { setPhotoFile(null); setPhotoPreview(""); fileInputRef.current.value = ""; }}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-white/90 text-ako-textLight border border-ako-border rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-white transition-colors flex items-center gap-1.5"
                    >
                      <ImagePlus size={13} />변경
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-ako-border rounded-xl flex flex-col items-center justify-center gap-2 text-ako-textLight hover:border-ako-primary hover:text-ako-primary transition-colors disabled:opacity-50"
                  >
                    <Camera size={24} />
                    <span className="text-xs font-medium">사진 찍기 / 라이브러리에서 선택</span>
                  </button>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" disabled={isSubmitting} onClick={closeModal}
                  className="flex-1 py-[9px] border border-ako-border rounded-lg text-sm font-medium text-ako-textLight hover:bg-ako-bg transition-colors disabled:opacity-50">
                  취소
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-[9px] bg-ako-primary text-white rounded-lg text-sm font-semibold hover:bg-[#7a6348] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                  {editingItem ? "수정 완료" : "등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 판매 완료 모달 ── */}
      {isSellModalOpen && sellingItem && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeSellModal} />
          <div className="bg-white rounded-t-[20px] md:rounded-[16px] w-full md:max-w-[400px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-ako-border rounded-full" />
            </div>
            <div className="px-7 py-5 border-b border-ako-border flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-ako-text">판매 완료</h3>
                <p className="text-xs text-ako-textLight mt-0.5 truncate max-w-[260px]">{sellingItem.name}</p>
              </div>
              <button onClick={closeSellModal} className="text-ako-textLight hover:text-ako-text transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSellItem} className="p-7 space-y-5">
              <div className="bg-ako-bg rounded-xl p-4 text-sm space-y-1">
                <div className="flex justify-between text-ako-textLight">
                  <span>사입원가</span>
                  <span className="font-semibold text-ako-text">₩{sellingItem.purchase_cost?.toLocaleString()}</span>
                </div>
                {saleInfo.sale_price && (
                  <div className="flex justify-between text-ako-textLight">
                    <span>예상 수익</span>
                    {(() => {
                      const p = parseInt(saleInfo.sale_price) - (sellingItem.purchase_cost || 0) - (parseInt(saleInfo.shipping_cost) || 0);
                      return (
                        <span className={`font-semibold ${p >= 0 ? "text-ako-success" : "text-ako-error"}`}>
                          {p >= 0 ? "+" : ""}₩{p.toLocaleString()}
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-[5px]">
                  <label className="text-[13px] text-ako-textLight font-medium">판매가 (₩)</label>
                  <input required disabled={isSellSubmitting} type="number" min="0"
                    value={saleInfo.sale_price}
                    onChange={(e) => setSaleInfo({ ...saleInfo, sale_price: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text disabled:opacity-50 transition-colors" />
                </div>
                <div className="space-y-[5px]">
                  <label className="text-[13px] text-ako-textLight font-medium">판매일</label>
                  <input required disabled={isSellSubmitting} type="date"
                    value={saleInfo.sale_date}
                    onChange={(e) => setSaleInfo({ ...saleInfo, sale_date: e.target.value })}
                    className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text disabled:opacity-50 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-[5px]">
                  <label className="text-[13px] text-ako-textLight font-medium">판매경로</label>
                  <select disabled={isSellSubmitting}
                    value={saleInfo.sale_channel}
                    onChange={(e) => setSaleInfo({ ...saleInfo, sale_channel: e.target.value })}
                    className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text disabled:opacity-50 transition-colors">
                    <option value="">— 선택 —</option>
                    {CHANNELS.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
                  </select>
                </div>
                <div className="space-y-[5px]">
                  <label className="text-[13px] text-ako-textLight font-medium">배송비 (₩)</label>
                  <input disabled={isSellSubmitting} type="number" min="0"
                    value={saleInfo.shipping_cost}
                    onChange={(e) => setSaleInfo({ ...saleInfo, shipping_cost: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-[9px] border border-ako-border rounded-lg focus:outline-none focus:border-ako-primary text-sm text-ako-text disabled:opacity-50 transition-colors" />
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" disabled={isSellSubmitting} onClick={closeSellModal}
                  className="flex-1 py-[9px] border border-ako-border rounded-lg text-sm font-medium text-ako-textLight hover:bg-ako-bg transition-colors disabled:opacity-50">
                  취소
                </button>
                <button type="submit" disabled={isSellSubmitting}
                  className="flex-1 py-[9px] bg-ako-success text-white rounded-lg text-sm font-semibold hover:bg-[#5a7a60] transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSellSubmitting && <Loader2 size={15} className="animate-spin" />}
                  판매 완료 처리
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
