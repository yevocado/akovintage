# ako vintage — 디자인 가이드

## 컨셉

따뜻하고 차분한 크림/베이지 톤. 빈티지 감성에 맞게 과하지 않고 클래식한 느낌.
화려하지 않고 데이터가 잘 읽히는 것이 우선.

---

## 컬러 팔레트

```js
const COLORS = {
  bg:           "#FAF7F2",  // 전체 배경 — 크림 화이트
  card:         "#FFFFFF",  // 카드/테이블 배경
  primary:      "#8B7355",  // 주요 버튼, 강조 — 웜 브라운
  primaryLight: "#C4A882",  // 차트 보조색, hover
  text:         "#3D3427",  // 기본 텍스트
  textLight:    "#7A6E64",  // 보조 텍스트, 레이블
  border:       "#E8E0D5",  // 테두리, 구분선
  accent:       "#D4B896",  // 포인트 — 베이지
  success:      "#6B8F71",  // 수익, 판매완료 — 세이지 그린
  warning:      "#C4925A",  // 경고, 예약
  error:        "#B06060",  // 삭제, 손실 — 머드 레드
  tableHeader:  "#F7F3EE",  // 테이블 헤더 배경
}
```

---

## 폰트

```css
font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif;
```

| 용도 | 크기 | 굵기 |
|---|---|---|
| 페이지 타이틀 | 22px | 700 |
| 카드 수치 | 20px | 700 |
| 섹션 소제목 | 15px | 600 |
| 테이블 헤더 | 13px | 600 |
| 테이블 본문 | 13–14px | 400–500 |
| 보조 텍스트 | 12px | 400 |

---

## 레이아웃

```
헤더 (60px, sticky)
  └── 로고 + 탭 네비게이션

본문 (max-width: 1100px, margin: auto, padding: 28px 24px)
  └── 탭 콘텐츠
```

---

## 컴포넌트

### 헤더

- 높이: 60px, sticky
- 배경: `#FFFFFF`, 하단 border: `1px solid #E8E0D5`
- 로고: 28×28 브라운 박스 + "A" 흰 텍스트 (border-radius: 6px)
- 앱명: 17px, 700, letter-spacing: -0.3px

### 탭 버튼

```
기본:     background: transparent, color: #7A6E64
활성화:   background: #8B7355, color: white, font-weight: 600
padding:  6px 16px, border-radius: 8px
```

### 카드

```
background: #FFFFFF
border: 1px solid #E8E0D5
border-radius: 14px
padding: 18px 20px
box-shadow: 0 1px 4px rgba(0,0,0,0.04)
```

### 버튼

**Primary (상품 추가 등)**
```
background: #8B7355
color: white
border: none
border-radius: 8px
padding: 9px 18px
font-size: 14px, font-weight: 600
```

**Secondary (취소 등)**
```
background: transparent
border: 1px solid #E8E0D5
color: #7A6E64
border-radius: 8px
padding: 9px 18px
```

**Danger (삭제)**
```
background: #B06060
color: white
border: none
border-radius: 8px
```

**소형 액션 버튼 (테이블 내)**
```
수정: border: 1px solid #E8E0D5, color: #7A6E64, padding: 4px 8px, border-radius: 6px
삭제: border: 1px solid #FFCCC7, color: #B06060, padding: 4px 8px, border-radius: 6px
```

### 테이블

```
전체: border-collapse: collapse, width: 100%
헤더 행: background: #F7F3EE, border-bottom: 1px solid #E8E0D5
헤더 셀: padding: 11px 14px, font-size: 13px, color: #7A6E64, font-weight: 600
본문 행: border-bottom: 1px solid #E8E0D5
본문 행 hover: background: #FAF7F2
본문 셀: padding: 12px 14px
```

**소계 행 (사입장소별 합계)**
```
background: #F7F3EE
font-weight: 600
font-size: 13px
color: #7A6E64
```

### 판매경로 배지

```
당근:      { bg: "#FFF0E6", text: "#D4622A" }
콜렉티브:  { bg: "#E6F0FF", text: "#2A5BD4" }
번개장터:  { bg: "#FFFBE6", text: "#C4920A" }
후르츠:    { bg: "#EDFFF0", text: "#2A9445" }
인스타그램:{ bg: "#FDE8F5", text: "#B0286E" }
직거래/기타:{ bg: "#F0F0F0", text: "#666666" }

공통: padding: 3px 10px, border-radius: 20px, font-size: 12px, font-weight: 600
```

### 상태 표시

```
미판매:   { bg: "#EEF2FF", text: "#4A5BA8" }
판매완료: { bg: "#E8F4E8", text: "#4A7A50" }

공통: padding: 3px 10px, border-radius: 20px, font-size: 12px, font-weight: 600
```

### 인풋 / 셀렉트

```
padding: 9px 12px
border-radius: 8px
border: 1px solid #E8E0D5
font-size: 14px
outline: none
box-sizing: border-box
focus 시: border-color: #8B7355
```

### 모달

```
오버레이: background: rgba(0,0,0,0.4), position: fixed, inset: 0, z-index: 100
모달 박스: background: #FFFFFF, border-radius: 16px, padding: 28px
           width: 520px, max-height: 85vh, overflow-y: auto
           box-shadow: 0 20px 60px rgba(0,0,0,0.15)
타이틀: font-size: 18px, font-weight: 700
레이블: font-size: 13px, color: #7A6E64, margin-bottom: 5px
```

---

## 차트 스타일

모든 차트 공통
```
ResponsiveContainer width="100%" height={220}
CartesianGrid: strokeDasharray="3 3", stroke="#E8E0D5"
Tooltip: ₩ 포맷 (toLocaleString() + "원")
```

| 차트 | 색상 |
|---|---|
| 사입원가 Bar | `#D4B896` (베이지) |
| 판매금액 Bar | `#8B7355` (브라운) |
| 순이익 Line | `#6B8F71` (세이지) |
| 판매경로 Bar | `#C4A882` |
| 수익률 Bar | `#8B7355` |
| 미판매 Bar | `#C4925A` (워닝) |

---

## 사진 썸네일

```
크기: 32×32px
border-radius: 6px
object-fit: cover
사진 없을 때: background: #E8E0D5, 회색 빈 박스
```

---

## 수익 표시 규칙

```
양수 (이익): color: #6B8F71, "+" 접두사 붙임
음수 (손실): color: #B06060
```

---

## 빈 상태 / 로딩

```
빈 테이블:  "상품이 없어요" — 중앙 정렬, color: #7A6E64, padding: 40px
로딩 중:    "불러오는 중..." — 중앙 정렬, color: #7A6E64
에러:       상단 배너, background: #FDE8E8, color: #B06060, padding: 12px 16px, border-radius: 8px
```