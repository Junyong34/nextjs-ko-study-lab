/**
 * @fileoverview timeline/label-fit.ts
 * 블록 폭에 맞춘 단계적 라벨 축약.
 *
 * 말줄임(`…`)은 쓰지 않는다. 잘린 글자는 정보가 아니라 소음이기 때문에,
 * 폰트 축소 → 순번 칩 → 미표시 순서로 내려간다. 어떤 경우에도 블록 밖으로 나가지 않는다.
 */

import { DEFAULT_FONT_FAMILY } from '../../primitives/typography';

export type LabelFitMode = 'full' | 'ordinal' | 'none';

export interface LabelFit {
  mode: LabelFitMode;
  text: string;
  fontSize: number;
}

const ORDINALS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

export function ordinalGlyph(index: number): string {
  return ORDINALS[index] ?? String(index + 1);
}

function widthOf(ctx: CanvasRenderingContext2D, text: string, fontSize: number, weight = 700): number {
  ctx.font = `${weight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;
  return ctx.measureText(text).width;
}

/**
 * @param maxWidth 블록 내부에서 라벨이 쓸 수 있는 최대 폭 (좌우 패딩을 이미 뺀 값)
 * @param index    폭이 부족할 때 대신 표시할 순번
 */
export function fitLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  index: number,
  sizes: number[] = [12, 11, 10, 9]
): LabelFit {
  if (maxWidth <= 6) return { mode: 'none', text: '', fontSize: 0 };

  for (const fontSize of sizes) {
    if (widthOf(ctx, text, fontSize) <= maxWidth) {
      return { mode: 'full', text, fontSize };
    }
  }

  const ordinal = ordinalGlyph(index);
  if (widthOf(ctx, ordinal, 11) <= maxWidth) {
    return { mode: 'ordinal', text: ordinal, fontSize: 11 };
  }
  return { mode: 'none', text: '', fontSize: 0 };
}

/** 라벨보다 제약이 느슨한 부가 텍스트(시각·수치)용 — 들어가지 않으면 그리지 않는다 */
export function fitsAt(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
  weight = 600
): boolean {
  return widthOf(ctx, text, fontSize, weight) <= maxWidth;
}
