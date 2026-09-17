/**
 * @fileoverview structure/types.ts
 * Next.js 인터랙티브 구조 데모 3종(RSC 스트리밍 / ISR 캐시 / App Router 렌더 트리)의 데이터 모델.
 *
 * 공통 원칙: 캔버스에는 짧은 라벨만 두고, 긴 설명(detail)은 DOM(StructureNotes)이 담당한다.
 */

/* ------------------------------------------------------------------ */
/* 공통                                                                 */
/* ------------------------------------------------------------------ */

/** 하단 DOM 설명 리스트의 한 항목. 캔버스 요소와 id로 연결된다 */
export interface NoteItem {
  id: string;
  label: string;
  /** 파일 경로·시각 등 짧은 부가 정보 (모노스페이스로 표시) */
  meta?: string;
  detail: string;
  color: string;
}

export interface Panel {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* ------------------------------------------------------------------ */
/* 1. RSC Streaming Waterfall                                          */
/* ------------------------------------------------------------------ */

export type ChunkKind = 'shell' | 'suspense';

export interface StreamChunkSpec {
  id: string;
  /** 캔버스 라벨 (짧게) */
  shortLabel: string;
  /** DOM에만 노출되는 파일 경로 */
  file: string;
  kind: ChunkKind;
  startMs: number;
  durationMs: number;
  /** 브라우저 미니 뷰포트에서 이 청크가 채우는 칸 (셸 청크는 없음) */
  slot?: number;
  color: string;
  detail: string;
}

export interface BrowserSlotSpec {
  /** 슬롯 제목 — 브라우저 화면 안에 그리는 짧은 라벨 */
  title: string;
  /** 채워졌을 때 그릴 콘텐츠 형태 */
  shape: 'card' | 'list' | 'grid';
}

export interface RscStreamSpec {
  totalMs: number;
  /** 셸이 도착해 첫 픽셀이 나오는 시각 */
  firstPaintMs: number;
  url: string;
  chunks: StreamChunkSpec[];
  slots: BrowserSlotSpec[];
}

/** 재생 시각에 따른 슬롯 표시 상태 */
export type SlotState = 'blank' | 'skeleton' | 'filled';

/* ------------------------------------------------------------------ */
/* 2. ISR Cache Lifecycle                                              */
/* ------------------------------------------------------------------ */

export type CacheResult = 'HIT' | 'STALE';

export interface CacheRequestLog {
  id: number;
  /** 데모 시작 이후 경과 시각(초) — 트랙의 x축 좌표계와 같다 */
  atSec: number;
  /** 요청 시점의 캐시 나이(초) */
  ageSec: number;
  result: CacheResult;
  /** 이 요청이 백그라운드 재생성을 트리거했는지 */
  triggeredRegen: boolean;
  reason: string;
}

export interface RegenBand {
  id: number;
  startSec: number;
  /** null이면 아직 재생성 중 */
  endSec: number | null;
  /** 이 재생성을 유발한 요청 id */
  triggeredBy: number;
}

export interface IsrSpec {
  revalidateSec: number;
  regenerateSec: number;
  /** 트랙이 보여 주는 시간 창(초) */
  windowSec: number;
  /** y축 최댓값(초) */
  maxAgeSec: number;
}

export interface IsrRuntime {
  nowSec: number;
  ageSec: number;
  history: { t: number; age: number }[];
  requests: CacheRequestLog[];
  bands: RegenBand[];
  isRegenerating: boolean;
}

/* ------------------------------------------------------------------ */
/* 3. App Router Render Tree                                           */
/* ------------------------------------------------------------------ */

export type TreeNodeKind = 'rsc' | 'suspense' | 'client';

export interface RenderTreeNode {
  id: string;
  kind: TreeNodeKind;
  /** 캔버스 라벨 (짧게) */
  title: string;
  /** DOM에만 노출되는 파일 경로 */
  file: string;
  detail: string;
  /** 이 노드가 화면에 자리를 잡는 재생 진행도 (0~1) */
  readyAt: number;
  children?: RenderTreeNode[];
}

export interface UrlSegmentSpec {
  /** 주소 표시줄에 그리는 세그먼트 텍스트 */
  label: string;
  file: string;
  /** 이 세그먼트가 대응하는 트리 노드 */
  nodeId: string;
}

/** 재생 진행도에 따른 노드 표시 상태 */
export type NodeState = 'pending' | 'streaming' | 'ready' | 'hydrated';

export interface TreeBox {
  node: RenderTreeNode;
  depth: number;
  parentId: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderPhase {
  key: 'shell' | 'stream' | 'hydrate';
  label: string;
  until: number;
}

/* ------------------------------------------------------------------ */
/* 4. Metadata Resolution                                              */
/* ------------------------------------------------------------------ */

export interface MetadataEntry {
  key: string;
  /** 캔버스에 그리는 짧은 값 표기 */
  value: string;
  /** openGraph처럼 중첩 필드를 갖는 키 — 얕은 병합에서 통째로 교체된다 */
  nested?: string[];
}

export interface MetadataSegment {
  id: string;
  /** 캔버스 라벨 (짧게) */
  label: string;
  /** DOM에만 노출되는 파일 경로 */
  file: string;
  entries: MetadataEntry[];
  /** generateMetadata(async)인지 — 스트리밍 대상이 된다 */
  isGenerate?: boolean;
  /** 이 세그먼트가 평가되는 진행도 (0~1) */
  resolveAt: number;
  detail: string;
}

export interface MetadataTagView {
  key: string;
  value: string;
  fromSegmentId: string;
  /** 이 값을 덮어쓴 세그먼트 id (없으면 최종 승자) */
  overriddenBy: string | null;
  atProgress: number;
  /** 이 값이 가진 중첩 필드 (openGraph 등) */
  nestedFields?: string[];
  /** 중첩 객체가 통째로 교체되며 사라진 필드들 */
  lostNested?: string[];
  /** 스트리밍 모드에서 <head>가 아니라 <body>에 append 되는 태그 */
  streamed: boolean;
}

/* ------------------------------------------------------------------ */
/* 5. Render Strategy Boundary                                         */
/* ------------------------------------------------------------------ */

/** 이 단계가 실제로 어디서 실행되는가 */
export type ExecArea = 'server' | 'network' | 'client';

export type RenderMode = 'first-load' | 'client-nav';

export interface StrategyStepSpec {
  id: string;
  area: ExecArea;
  /** 캔버스 라벨 (짧게) */
  label: string;
  startMs: number;
  durationMs: number;
  detail: string;
  /** 서버가 만든 HTML을 나르는 단계인지 — 모드 비교의 핵심 */
  carriesHtml?: boolean;
}

export interface StrategyLaneSpec {
  id: string;
  title: string;
  /** 캔버스 좌측 게터에 붙는 한 줄 요약 (짧게) */
  note: string;
  steps: Record<RenderMode, StrategyStepSpec[]>;
  firstPaintMs: Record<RenderMode, number>;
  color: string;
  detail: string;
}
