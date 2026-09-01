/**
 * 여러 컴포넌트가 리터럴로 복붙하고 있던 클래스 묶음입니다.
 *
 * 형태(radius·padding·글자 굵기)는 여기 넣지 않습니다. 사용처마다 다르고,
 * 억지로 통일하면 화면이 바뀝니다. 여기 모으는 것은 **색과 상태 표현**뿐입니다.
 *
 * 색을 디자인 토큰(`@theme inline` + oklch)으로 옮기는 것은 shadcn 도입 티켓의 몫입니다
 * (packages/ui/AGENTS.md 규칙 3). 그때 고칠 자리가 이 파일 하나로 좁혀지는 것이 목적입니다.
 */

/** 활성 상태의 트리 항목·목차 항목. Sidebar와 TableOfContents가 각각 복붙하고 있었다. */
export const ACTIVE_ITEM =
  'bg-[#14161a0f] font-bold text-zinc-950 dark:bg-white/10 dark:text-zinc-50'

/** 비활성 트리 항목·목차 항목. */
export const INACTIVE_ITEM =
  'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200'

/** 강조 배경 — zone 배지, 헤더의 데모 링크, 모달 아이콘 자리. */
export const ACCENT_SURFACE =
  'bg-[#14161a0f] text-zinc-800 dark:bg-white/10 dark:text-zinc-200'

/** primary 표면 — 채운 버튼 4종이 형태만 다르고 색은 전부 이것이다. */
export const PRIMARY_SURFACE =
  'bg-zinc-900 text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'

/** outline 표면 — 테두리만 있는 버튼. */
export const OUTLINE_SURFACE =
  'border border-zinc-200 bg-white text-zinc-700 shadow-xs transition dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'

/** 입력 필드 — 검색창과 피드백 폼 3필드가 같은 문자열을 쓰고 있었다. */
export const FIELD_SURFACE =
  'w-full rounded-lg border border-zinc-200 bg-zinc-50/80 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300'

/** 상태 색 — done(완료) / pending(그 외). */
export const STATUS_TONE = {
  done: {
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
    tag: 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
  pending: {
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
    tag: 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  },
} as const

/** 카드 표면 — 데모 색인 카드와 문서 하단 카드가 공유하는 부분. */
export const CARD_SURFACE =
  'rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'

/** 카드 hover 강조. */
export const CARD_HOVER =
  'hover:border-zinc-400 hover:shadow-md dark:hover:border-zinc-600'
