import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useExtraCosts() {
  const [extraItems, setExtraItems] = useState([]);

  useEffect(() => {
    supabase.from("extra_costs").select("*").order("created_at").then(({ data }) => {
      if (data) setExtraItems(data);
    });
  }, []);

  const addExtra = async ({ name, amount }) => {
    const { data, error } = await supabase.from("extra_costs").insert({ name, amount }).select().single();
    if (!error && data) setExtraItems((prev) => [...prev, data]);
    return { error };
  };

  const removeExtra = async (id) => {
    const { error } = await supabase.from("extra_costs").delete().eq("id", id);
    if (!error) setExtraItems((prev) => prev.filter((e) => e.id !== id));
  };

  return { extraItems, addExtra, removeExtra };
}
