/**
 * @fileoverview timeline/types.ts
 * 공유 시간축 기반 타임라인 비교 시각화의 데이터 모델과 렌더 파생 타입.
 *
 * 핵심 원칙:
 * - 블록은 상대 가중치(weight)가 아니라 절대 시각(startMs/durationMs)을 갖는다.
 * - 두 레인은 하나의 totalMs와 하나의 ms→px 스케일을 공유한다. 같은 ms는 같은 x다.
 * - 캔버스에는 짧은 라벨만, 긴 설명(detail/summary)은 DOM이 담당한다.
 */

/** 태스크 종류 — 색상 팔레트와 범례의 키가 된다 */
export type TaskKind =
  | 'work' // 일반 서버/클라이언트 작업
  | 'block' // 메인 스레드를 점유하는 블로킹 롱 태스크
  | 'network' // 네트워크 왕복, 느린 API
  | 'render' // 브라우저 페인트 / 화면 갱신
  | 'input' // 사용자 입력 처리
  | 'cache' // 캐시 조회 / 백그라운드 재생성
  | 'idle'; // 유휴, 스트림 유지 등 점유하지 않는 구간

export type EventKind = 'input' | 'paint';
export type LaneVariant = 'before' | 'after';
export type Density = 'compact' | 'regular' | 'comfortable';

/** 타임라인 위의 작업 한 덩어리 */
export interface TimelineTaskSpec {
  id: string;
  /** 캔버스에 그리는 짧은 라벨 (6자 이내 권장) */
  label: string;
  startMs: number;
  durationMs: number;
  kind: TaskKind;
  /** DOM 스텝 리스트에만 표시되는 긴 설명 */
  detail: string;
}

/**
 * 사용자 관점의 이벤트. 도착(arriveMs)과 처리(handledMs)의 간격이 곧 체감 지연이며
 * 두 레인을 가르는 핵심 지표다.
 */
export interface TimelineEventSpec {
  id: string;
  label: string;
  kind: EventKind;
  arriveMs: number;
  handledMs: number;
  detail?: string;
}

export interface TimelineLaneSpec {
  variant: LaneVariant;
  /** 캔버스 레인 제목 (20자 이내 권장) */
  title: string;
  /** 레인 상태 칩 문구 (8자 이내 권장) */
  statusLabel: string;
  /** DOM에만 표시되는 레인 요약 */
  summary: string;
  tasks: TimelineTaskSpec[];
  events: TimelineEventSpec[];
  /** 제어권을 양보하는 시각들 — ⚡ 스파크와 스케줄 아크의 출발점 */
  yieldPointsMs?: number[];
  /** 완료 깃발을 세우는 절대 시각 */
  completeMs: number;
  /** 요약 스트립에 쓰는 헤드라인 수치 (보통 체감 지연) */
  metricMs: number;
}

export interface TimelineLegendSpec {
  label: string;
  kind: TaskKind;
}

export interface TimelineCompareSpec {
  totalMs: number;
  /** 비교 지표 이름 — 예: '첫 화면(FCP)', '최대 입력 지연' */
  metricLabel: string;
  legends: TimelineLegendSpec[];
  before: TimelineLaneSpec;
  after: TimelineLaneSpec;
}

/* ------------------------------------------------------------------ */
/* 렌더 파생 타입                                                        */
/* ------------------------------------------------------------------ */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TimeScale {
  totalMs: number;
  plotX: number;
  plotWidth: number;
  msToX(ms: number): number;
  xToMs(x: number): number;
}

/** 레인 하나의 세로 배치 — 제목줄 / 태스크 바 / 이벤트 흐름 */
export interface LaneLayout {
  header: Rect;
  bar: Rect;
  flow: Rect;
}

export interface TimelineLayout {
  width: number;
  height: number;
  density: Density;
  plotX: number;
  plotWidth: number;
  axis: Rect;
  /** 가이드 눈금선이 걸치는 세로 범위 */
  guide: { top: number; bottom: number };
  lanes: LaneLayout[];
  summary: Rect;
}

export interface HandledEvent {
  spec: TimelineEventSpec;
  waitedMs: number;
}

/** 특정 시각 nowMs에서의 레인 상태 */
export interface LaneRuntimeState {
  activeTask: TimelineTaskSpec | null;
  queued: TimelineEventSpec[];
  handled: HandledEvent[];
  maxWaitMs: number;
  isComplete: boolean;
  /** 최근 지나온 양보 시점 (없으면 null) */
  lastYieldMs: number | null;
}

/** 이벤트가 서로 겹치지 않도록 배정한 행 번호 */
export type EventRowMap = Record<string, number>;

export interface HoverTarget {
  laneIndex: number;
  taskId: string;
}

export interface TimelineCompareCanvasProps {
  spec: TimelineCompareSpec;
  /** 캔버스 최소 렌더 너비. 컨테이너가 더 좁으면 가로 스크롤한다 */
  minWidth?: number;
  /** 레이아웃 계산 높이의 하한 */
  minHeight?: number;
  /** 0 → totalMs 를 재생하는 실제 벽시계 시간 */
  cycleMs?: number;
  className?: string;
}
