/**
 * @fileoverview structure/meta-head.ts
 * 병합 결과 패널. 항상 붙는 기본 태그 2개 위에 세그먼트 값이 쌓이고,
 * 교체된 태그는 취소선을 남기고 사라져 "얕은 병합 = 덮어쓰기"임을 눈으로 확인하게 한다.
 * 스트리밍 모드에서는 generateMetadata 결과가 `<head>`가 아니라 `<body> append` 구획으로 간다.
 */

import { drawRoundRect } from '../../primitives/shapes';
import { drawText, DEFAULT_FONT_FAMILY } from '../../primitives/typography';
import { STRUCTURE_UI, drawPanel } from './frame';
import { META_ROW_H, segmentColor } from './meta-flow';
import { overrideFade, type MetadataResolution } from './meta-merge';
import type { MetadataSegment, MetadataTagView, Panel } from './types';

const ROW_H = META_ROW_H;

export interface HeadPaintOptions {
  panel: Panel;
  segments: MetadataSegment[];
  resolution: MetadataResolution;
  progress: number;
  streaming: boolean;
  hoveredId: string | null;
}

/** 우측 결과 패널 — 기본 태그 2개 + 병합 결과, 스트리밍이면 `<body>` append 구획을 나눈다 */
export function paintHeadPanel(
  ctx: CanvasRenderingContext2D,
  { panel, segments, resolution, progress, streaming, hoveredId }: HeadPaintOptions
): void {
  const bodyRows = streaming ? resolution.bodyAppended.length : 0;
  const bodyH = bodyRows > 0 ? 22 + bodyRows * ROW_H : 0;
  const headPanel: Panel = { ...panel, height: panel.height - (bodyH > 0 ? bodyH + 8 : 0) };

  drawPanel(ctx, headPanel, '<head>', streaming ? '초기 UI 먼저 전송' : '렌더 블로킹');

  let y = headPanel.y + 32;
  ctx.font = `600 9px ${DEFAULT_FONT_FAMILY}`;

  // 항상 붙는 기본 2개 — metadata를 안 써도 나온다
  for (const tag of [
    { key: 'meta charset', value: 'utf-8' },
    { key: 'meta viewport', value: 'width=device-width…' }
  ]) {
    drawText(ctx, `${tag.key} = ${tag.value}`, {
      x: headPanel.x + 12,
      y,
      baseline: 'middle',
      fontSize: 9,
      fontWeight: 600,
      color: STRUCTURE_UI.faint
    });
    y += ROW_H;
  }

  y += 3;
  for (const tag of resolution.entries) {
    if (y + ROW_H > headPanel.y + headPanel.height - 6) break;
    if (tag.streamed) continue;
    const fade = overrideFade(segments, tag, progress);
    if (tag.overriddenBy && fade <= 0) continue;
    paintTagRow(ctx, headPanel, tag, y, segments, fade, hoveredId);
    y += ROW_H;
  }

  if (bodyH <= 0) return;

  const bodyPanel: Panel = {
    x: panel.x,
    y: panel.y + panel.height - bodyH,
    width: panel.width,
    height: bodyH
  };
  drawPanel(ctx, bodyPanel, '<body> append', 'generateMetadata 결과');
  let by = bodyPanel.y + 30;
  for (const tag of resolution.bodyAppended) {
    paintTagRow(ctx, bodyPanel, tag, by, segments, 0, hoveredId);
    by += ROW_H;
  }
}

function paintTagRow(
  ctx: CanvasRenderingContext2D,
  panel: Panel,
  tag: MetadataTagView,
  y: number,
  segments: MetadataSegment[],
  fade: number,
  hoveredId: string | null
): void {
  const index = segments.findIndex((segment) => segment.id === tag.fromSegmentId);
  const color = segmentColor(Math.max(0, index));
  const dead = Boolean(tag.overriddenBy);
  const text = `${tag.key} = ${tag.value}`;

  ctx.save();
  ctx.globalAlpha = dead ? Math.max(0.25, fade) : hoveredId && hoveredId !== tag.fromSegmentId ? 0.45 : 1;
  drawRoundRect(ctx, {
    x: panel.x + 12,
    y: y - 5.5,
    width: 3,
    height: 11,
    radius: 2,
    fill: color
  });
  drawText(ctx, text, {
    x: panel.x + 20,
    y,
    baseline: 'middle',
    fontSize: 9,
    fontWeight: 600,
    color: dead ? '#94a3b8' : '#0f172a'
  });

  ctx.font = `600 9px ${DEFAULT_FONT_FAMILY}`;
  const width = ctx.measureText(text).width;

  if (dead) {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(panel.x + 20, y);
    ctx.lineTo(Math.min(panel.x + panel.width - 12, panel.x + 20 + width), y);
    ctx.stroke();

    // 중첩 객체가 통째로 교체되며 사라진 필드
    if (tag.lostNested && tag.lostNested.length > 0) {
      const note = `${tag.lostNested.join(', ')} 사라짐`;
      const noteX = panel.x + 26 + width;
      if (noteX + ctx.measureText(note).width < panel.x + panel.width - 10) {
        drawText(ctx, note, {
          x: noteX,
          y,
          baseline: 'middle',
          fontSize: 9,
          fontWeight: 700,
          color: '#ef4444'
        });
      }
    }
  }
  ctx.restore();
}
