import { drawRoundRect, drawCircle } from '../../primitives/shapes';
import { drawText } from '../../primitives/typography';
import { fitLabel } from '../timeline/label-fit';

export const C = {
  ink: '#0f172a',
  muted: '#64748b',
  line: '#cbd5e1',
  blue: '#2563eb',
  green: '#047857',
  amber: '#b45309',
  violet: '#7c3aed',
};
export function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  color = C.ink,
  size = 13,
) {
  // 'ordinal' 폴백(①)은 여기서 의미가 없다 — 들어가면 그리고, 안 들어가면 그리지 않는다.
  const fit = fitLabel(ctx, text, width, 0, [size, 12, 11, 10, 9]);
  if (fit.mode === 'full')
    drawText(ctx, fit.text, {
      x,
      y,
      fontSize: fit.fontSize,
      fontWeight: 600,
      color,
      baseline: 'middle',
    });
}
export function box(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  color = C.blue,
  active = true,
) {
  drawRoundRect(ctx, {
    x,
    y,
    width: w,
    height: h,
    radius: 10,
    fill: active ? `${color}0c` : '#f8fafc',
    stroke: active ? color : C.line,
    lineWidth: active ? 1.5 : 1,
  });
  label(ctx, title, x + 14, y + 23, w - 28, active ? color : C.muted);
  label(ctx, sub, x + 14, y + 48, w - 28, C.muted, 11);
}
export function arrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = C.blue,
  progress = 1,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2 - 7 * Math.cos(angle - 0.45), y2 - 7 * Math.sin(angle - 0.45));
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 - 7 * Math.cos(angle + 0.45), y2 - 7 * Math.sin(angle + 0.45));
  ctx.stroke();
  if (progress > 0 && progress < 1)
    drawCircle(ctx, {
      x: x1 + (x2 - x1) * progress,
      y: y1 + (y2 - y1) * progress,
      radius: 5,
      fill: color,
    });
  ctx.restore();
}
