/**
 * @fileoverview Particle System Module
 * 파티클 생성, 물리 업데이트(중력, 공기저항, 3D 펄럭임 회전) 및 렌더링 모듈
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

export const DEFAULT_PARTICLE_COLORS = [
  '#228be6',
  '#40c057',
  '#fab005',
  '#fa5252',
  '#845ef7',
  '#ff922b',
  '#15aabf',
  '#e64980'
];

export interface ConfettiClusterOptions {
  originX: number;
  originY: number;
  count?: number;
  colors?: string[];
  spreadAngle?: number;
  speedMin?: number;
  speedMax?: number;
  direction?: 'up' | 'down' | 'all';
}

/** 콘페티(색종이) 파티클 클러스터 생성 */
export function createConfettiCluster(options: ConfettiClusterOptions): Particle[] {
  const {
    originX,
    originY,
    count = 80,
    colors = DEFAULT_PARTICLE_COLORS,
    spreadAngle = Math.PI * 0.75,
    speedMin = 6,
    speedMax = 14,
    direction = 'up'
  } = options;

  const baseAngle =
    direction === 'up'
      ? -Math.PI / 2
      : direction === 'down'
        ? Math.PI / 2
        : 0;

  const angleRange = direction === 'all' ? Math.PI * 2 : spreadAngle;

  return Array.from({ length: count }, () => {
    const angle = direction === 'all'
      ? Math.random() * Math.PI * 2
      : baseAngle + (Math.random() - 0.5) * angleRange;

    const speed = speedMin + Math.random() * (speedMax - speedMin);

    return {
      x: originX + (Math.random() - 0.5) * 16,
      y: originY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
      vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 5,
      h: 8 + Math.random() * 7,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    };
  });
}

export interface ParticlePhysicsOptions {
  gravity?: number;
  drag?: number;
  floorY?: number;
  fadeRate?: number;
}

/** 파티클 물리 업데이트 및 캔버스 렌더링 (살아있는 파티클이 있으면 true 반환) */
export function updateAndDrawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  options: ParticlePhysicsOptions = {}
): boolean {
  const { gravity = 0.16, drag = 0.02, floorY, fadeRate = 0.025 } = options;

  let hasAlive = false;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (p.opacity <= 0) continue;

    hasAlive = true;

    // 물리 업데이트 (중력 + 공기저항)
    p.vy += gravity;
    p.vx *= 1 - drag;
    p.vy *= 1 - drag * 0.5;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;

    // 바닥 근처에 도달하면 서서히 투명해지며 소멸
    if (floorY !== undefined && p.y > floorY) {
      p.opacity -= fadeRate;
    }

    // 3D 펄럭임 회전 효과 (cos(rotation)으로 폭 스케일링)
    const scaleX = Math.cos(p.rotation);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * 0.5);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.fillRect((-p.w / 2) * scaleX, -p.h / 2, p.w * scaleX, p.h);
    ctx.restore();
  }

  return hasAlive;
}
