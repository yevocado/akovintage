import { useState, useMemo } from "react";
import { supabase } from "../lib/supabase";

const EMPTY_NEW_ITEM = {
  name: "",
  purchase_date: new Date().toISOString().split("T")[0],
  purchase_cost: "",
  purchase_location: "",
  photo_url: "",
};

const EMPTY_SALE_INFO = {
  sale_price: "",
  sale_channel: "",
  sale_date: new Date().toISOString().split("T")[0],
  shipping_cost: "",
};

export function useInventory() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("전체");

  // 사입 등록 모달
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem]   = useState(null);
  const [newItem, setNewItem]           = useState(EMPTY_NEW_ITEM);
  const [photoFile, setPhotoFile]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  // 판매 완료 모달
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellingItem, setSellingItem]         = useState(null);
  const [saleInfo, setSaleInfo]               = useState(EMPTY_SALE_INFO);
  const [isSellSubmitting, setIsSellSubmitting] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("purchase_date", { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const availableMonths = useMemo(() => {
    const months = [...new Set(items.map((i) => i.purchase_date?.slice(0, 7)).filter(Boolean))];
    return months.sort((a, b) => b.localeCompare(a));
  }, [items]);

  const filteredInventory = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return items.filter((i) => {
      const matchSearch =
        i.name?.toLowerCase().includes(term) ||
        i.purchase_location?.toLowerCase().includes(term) ||
        i.sale_channel?.toLowerCase().includes(term);
      const matchMonth =
        selectedMonth === "전체" || i.purchase_date?.startsWith(selectedMonth);
      return matchSearch && matchMonth;
    });
  }, [items, searchTerm, selectedMonth]);

  const unsoldItems = useMemo(() => items.filter((i) => i.sale_price === null), [items]);
  const soldItems   = useMemo(() => items.filter((i) => i.sale_price !== null), [items]);

  // ── 사입 모달 ──────────────────────────────────────
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setNewItem({
        name: item.name,
        purchase_date: item.purchase_date,
        purchase_cost: item.purchase_cost,
        purchase_location: item.purchase_location,
        photo_url: item.photo_url || "",
      });
      setPhotoPreview(item.photo_url || "");
    } else {
      setEditingItem(null);
      setNewItem(EMPTY_NEW_ITEM);
      setPhotoPreview("");
    }
    setPhotoFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setPhotoFile(null);
    setPhotoPreview("");
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let photo_url = newItem.photo_url || null;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("item-photos")
          .upload(path, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("item-photos")
          .getPublicUrl(path);
        photo_url = urlData.publicUrl;
      }

      const itemToSave = {
        name: newItem.name,
        purchase_date: newItem.purchase_date,
        purchase_cost: parseInt(newItem.purchase_cost) || 0,
        purchase_location: newItem.purchase_location,
        photo_url,
        sale_price: null,
        sale_channel: null,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("items")
          .update(itemToSave)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("items").insert([itemToSave]);
        if (error) throw error;
      }
      await fetchInventory();
      closeModal();
    } catch (err) {
      alert("저장 실패: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── 판매 완료 모달 ──────────────────────────────────
  const openSellModal = (item) => {
    setSellingItem(item);
    setSaleInfo({
      sale_price: item.sale_price ?? "",
      sale_channel: item.sale_channel ?? "",
      sale_date: item.sale_date ?? new Date().toISOString().split("T")[0],
      shipping_cost: item.shipping_cost ?? "",
    });
    setIsSellModalOpen(true);
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
    setSellingItem(null);
  };

  const handleSellItem = async (e) => {
    e.preventDefault();
    if (!sellingItem) return;
    setIsSellSubmitting(true);
    try {
      const { error } = await supabase
        .from("items")
        .update({
          sale_price: parseInt(saleInfo.sale_price) || null,
          sale_channel: saleInfo.sale_channel || null,
          sale_date: saleInfo.sale_date || null,
          shipping_cost: parseInt(saleInfo.shipping_cost) || 0,
        })
        .eq("id", sellingItem.id);
      if (error) throw error;
      await fetchInventory();
      closeSellModal();
    } catch (err) {
      alert("판매 처리 실패: " + err.message);
    } finally {
      setIsSellSubmitting(false);
    }
  };

  // ── 삭제 ────────────────────────────────────────────
  const handleDeleteItem = async (id) => {
    if (!window.confirm("삭제하시겠어요?")) return;
    try {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
      await fetchInventory();
    } catch (err) {
      alert("삭제 실패: " + err.message);
    }
  };

  return {
    inventory: items,
    filteredInventory,
    unsoldItems,
    soldItems,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    // 사입 모달
    isModalOpen,
    isSubmitting,
    editingItem,
    newItem,
    setNewItem,
    photoFile,
    setPhotoFile,
    photoPreview,
    setPhotoPreview,
    openModal,
    closeModal,
    handleAddItem,
    // 판매 모달
    isSellModalOpen,
    isSellSubmitting,
    sellingItem,
    saleInfo,
    setSaleInfo,
    openSellModal,
    closeSellModal,
    handleSellItem,
    // 삭제
    handleDeleteItem,
    fetchInventory,
  };
}
