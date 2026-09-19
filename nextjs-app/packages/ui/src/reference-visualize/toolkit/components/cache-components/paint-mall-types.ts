/**
 * @fileoverview cache-components/paint-mall-types.ts
 * paint-mall 계열 파일이 공유하는 타입. 순환 참조를 피하려고 구현과 분리해 둔다.
 */

import type { LaneKey, LaneResult, MallSim, TagMode } from './mall-model';

/** 페이지 요청 한 번이 만든 레인별 이동 애니메이션 — 실제 시간(ms) 기준 */
export interface LaneTravel {
  lane: LaneKey;
  result: LaneResult;
  startMs: number;
  /** 도착 시 브라우저가 받은 버전 라벨 (장바구니는 빈 문자열) */
  versionLabel: string;
}

/** 관리자 태그 갱신 펄스 */
export interface AdminPulse {
  mode: TagMode;
  startMs: number;
}

/** 재생성 완료 순간의 캐시 노드 플래시 */
export interface SaveFlash {
  lane: LaneKey;
  startMs: number;
}

export interface MallPaintOptions {
  width: number;
  height: number;
  /** 실제 경과 시간(ms) — 애니메이션용. 시뮬레이션 시계는 sim.nowSec */
  timeMs: number;
  sim: MallSim;
  travels: LaneTravel[];
  adminPulse: AdminPulse | null;
  flashes: SaveFlash[];
  /** 마지막 페이지 요청의 레인별 결과 (없으면 null) */
  lastResults: Record<LaneKey, LaneResult> | null;
  /** DOM 노트 호버로 강조할 레인 */
  hoveredLane: LaneKey | null;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 한 레인의 좌표계 — 브라우저 오른쪽 끝에서 서버 왼쪽 끝까지 */
export interface LaneGeometry {
  key: LaneKey;
  /** 레인 제목 행의 y */
  titleY: number;
  /** 이동 선의 y */
  lineY: number;
  /** 레인 영역 (배경 하이라이트용) */
  box: Box;
  x0: number;
  x1: number;
  /** 캐시 노드 상자. 장바구니 레인은 null */
  cacheBox: Box | null;
}
