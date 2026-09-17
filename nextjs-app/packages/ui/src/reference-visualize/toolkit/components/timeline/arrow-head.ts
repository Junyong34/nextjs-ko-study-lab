/**
 * @fileoverview timeline/arrow-head.ts
 * 선(획) 화살촉. 채운 삼각형은 작은 크기에서 뭉쳐 보이므로,
 * 타임라인의 방향 표시는 전부 얇은 두 획의 셰브론으로 통일한다.
 */

/**
 * @param angle 화살표가 향하는 방향(라디안). 0이면 오른쪽, Math.PI면 왼쪽.
 * @param size  촉의 팔 길이(px). 기본값은 눈에 거슬리지 않는 최소 크기다.
 */
export function drawLineArrowHead(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  angle: number,
  color: string,
  size = 4,
  lineWidth = 1.3
): void {
  const spread = Math.PI / 6;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(tipX - size * Math.cos(angle - spread), tipY - size * Math.sin(angle - spread));
  ctx.lineTo(tipX, tipY);
  ctx.lineTo(tipX - size * Math.cos(angle + spread), tipY - size * Math.sin(angle + spread));
  ctx.stroke();
  ctx.restore();
}
