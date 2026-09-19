/**
 * @fileoverview cache-components/paint-regions.ts
 * "한 페이지, 영역별 캐시 경계" 캔버스의 진입점 — 원천 열 → 캐시 열 → 브라우저 목업.
 * 페이지 목업의 영역 칸 높이가 곧 행(흐름 선)의 위치라서, 흐름의 끝이 화면의 어느 칸인지가
 * 항상 같은 높이에서 만난다. 그림은 `paint-regions-flow.ts`(행)와 `paint-regions-page.ts`(목업)에 있다.
 */

import { drawText } from '../../primitives/typography';
import { paintRow, type FlowPaintOptions, type RowGeometry } from './paint-regions-flow';
import { REGIONS_UI, paintPage, type Rect } from './paint-regions-page';
import { REGION_IDS, type RegionId } from './regions-model';

export { MODE_COLOR } from './paint-regions-page';

const PAD = 12;
const HEAD_H = 18;
const SOURCE_W = 104;
const CACHE_W = 184;
const COL_GAP = 26;
const REGION_WEIGHT: Record<RegionId, number> = { header: 0.15, products: 0.34, price: 0.2, recs: 0.31 };
const REGION_GAP = 6;

export interface RegionsLayout {
  frame: Rect;
  regionRects: Record<RegionId, Rect>;
  rows: RowGeometry[];
  columns: { source: Rect; cache: Rect };
}

export function regionsLayout(width: number, height: number): RegionsLayout {
  const top = PAD + HEAD_H;
  const source: Rect = { x: PAD, y: top, width: SOURCE_W, height: height - top - PAD };
  const cache: Rect = { x: source.x + SOURCE_W + COL_GAP, y: top, width: CACHE_W, height: source.height };
  const frameX = cache.x + CACHE_W + COL_GAP;
  const frame: Rect = { x: frameX, y: top, width: width - PAD - frameX, height: height - top - PAD };

  const areaTop = frame.y + 36;
  const areaH = frame.y + frame.height - 8 - areaTop - REGION_GAP * (REGION_IDS.length - 1);
  let cursor = areaTop;
  const regionRects = {} as Record<RegionId, Rect>;
  REGION_IDS.forEach((id) => {
    const h = areaH * REGION_WEIGHT[id];
    regionRects[id] = { x: frame.x + 8, y: cursor, width: frame.width - 16, height: h };
    cursor += h + REGION_GAP;
  });

  const rows: RowGeometry[] = REGION_IDS.map((id) => {
    const r = regionRects[id];
    const y = r.y + r.height / 2;
    const nodeH = 28;
    return {
      id,
      y,
      band: { x: PAD - 4, y: r.y - 2, width: frame.x - PAD - 4, height: r.height + 4 },
      sourceBox: { x: source.x, y: y - nodeH / 2, width: SOURCE_W, height: nodeH },
      cacheBox: { x: cache.x, y: y - nodeH / 2, width: CACHE_W, height: nodeH },
      pageX: frame.x
    };
  });
  return { frame, regionRects, rows, columns: { source, cache } };
}

export interface RegionsPaintOptions extends FlowPaintOptions {
  width: number;
  height: number;
}

export function paintRegions(ctx: CanvasRenderingContext2D, o: RegionsPaintOptions): void {
  const layout = regionsLayout(o.width, o.height);
  const headY = PAD + 6;
  const head = (text: string, x: number, w: number) =>
    drawText(ctx, text, { x: x + w / 2, y: headY, align: 'center', baseline: 'middle', fontSize: 9, fontWeight: 800, color: REGIONS_UI.sub });
  head('① 데이터 원천', layout.columns.source.x, layout.columns.source.width);
  head('② 캐시 계층', layout.columns.cache.x, layout.columns.cache.width);
  head('③ 사용자가 보는 화면', layout.frame.x, layout.frame.width);
  drawText(ctx, `t = ${Math.round(o.nowMs)}ms`, { x: o.width - PAD, y: headY, align: 'right', baseline: 'middle', fontSize: 9, fontWeight: 700, color: REGIONS_UI.faint });

  layout.rows.forEach((row) => paintRow(ctx, row, o));
  paintPage(ctx, { frame: layout.frame, regionRects: layout.regionRects, fill: o.fill, nowMs: o.nowMs, timeMs: o.timeMs, hoveredId: o.hoveredId });
}

/** 포인터가 어느 행(영역) 위에 있는지 — 행 띠와 페이지 칸 모두 같은 영역으로 친다 */
export function hitTestRegion(width: number, height: number, px: number, py: number): RegionId | null {
  const { rows } = regionsLayout(width, height);
  if (px < PAD || px > width - PAD) return null;
  const row = rows.find((r) => py >= r.band.y && py <= r.band.y + r.band.height);
  return row ? row.id : null;
}
