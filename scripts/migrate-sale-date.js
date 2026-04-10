// 기존 판매 완료 항목에 sale_date = 오늘 날짜 설정
// 실행: node scripts/migrate-sale-date.js

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://toeqlyblgkvnxkbmlfxs.supabase.co";
const SUPABASE_KEY = "sb_publishable_AIVedjfp0QRY3fp1JU7kwQ_CCGN81tm";
const TODAY = "2026-04-10";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  // sale_date가 없는 판매 완료 항목 조회
  const { data, error } = await supabase
    .from("items")
    .select("id, name, sale_price, sale_date")
    .not("sale_price", "is", null)
    .is("sale_date", null);

  if (error) {
    console.error("조회 실패:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("업데이트할 항목 없음 (이미 모두 sale_date 있음)");
    return;
  }

  console.log(`업데이트 대상: ${data.length}개`);
  data.forEach((i) => console.log(` - ${i.name}`));

  const ids = data.map((i) => i.id);
  const { error: updateError } = await supabase
    .from("items")
    .update({ sale_date: TODAY })
    .in("id", ids);

  if (updateError) {
    console.error("업데이트 실패:", updateError.message);
    process.exit(1);
  }

  console.log(`완료: ${data.length}개 항목 → sale_date = ${TODAY}`);
}

run();
