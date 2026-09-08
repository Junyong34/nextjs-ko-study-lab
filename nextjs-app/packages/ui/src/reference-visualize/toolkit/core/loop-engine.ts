/**
 * @fileoverview Canvas Animation Loop Engine
 * requestAnimationFrame 기반 렌더 루프 및 타이밍 계산기
 */

export interface LoopTickInfo {
  time: number;
  deltaTime: number;
  frameCount: number;
}

/**
 * rAF는 16.67ms 격자 위에서만 발화한다. fpsLimit 30(=33.33ms)처럼 격자의 배수에 가까운 값은
 * 프레임이 33.30ms에 도착하는 것만으로도 "아직 이르다"고 판정돼 한 칸을 통째로 건너뛰고,
 * 그 결과 33·33·50ms처럼 불규칙해져 저더로 보인다. 판정에 약간의 여유를 둔다.
 */
const FRAME_TOLERANCE_MS = 2;

export interface LoopEngineOptions {
  onTick: (info: LoopTickInfo) => void;
  fpsLimit?: number;
}

export class LoopEngine {
  private rafId = 0;
  private isRunning = false;
  private lastTime = 0;
  private frameCount = 0;
  private onTick: (info: LoopTickInfo) => void;
  private frameInterval = 0;

  constructor(options: LoopEngineOptions) {
    this.onTick = options.onTick;
    if (options.fpsLimit && options.fpsLimit > 0) {
      this.frameInterval = 1000 / options.fpsLimit;
    }
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.scheduleNext();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
    return this.isRunning;
  }

  public get running(): boolean {
    return this.isRunning;
  }

  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    const delta = currentTime - this.lastTime;

    if (this.frameInterval > 0) {
      if (delta < this.frameInterval - FRAME_TOLERANCE_MS) {
        this.rafId = requestAnimationFrame(this.loop);
        return;
      }
      // 초과분을 이월해 기준 시각이 매 프레임 뒤로 밀리지 않게 한다.
      // lastTime = currentTime 으로 두면 위상이 계속 드리프트해 간격이 들쭉날쭉해진다.
      this.lastTime = currentTime - Math.min(delta - this.frameInterval, this.frameInterval);
    } else {
      this.lastTime = currentTime;
    }
    this.frameCount++;

    this.onTick({
      time: currentTime,
      deltaTime: Math.min(delta, 100), // 백그라운드 복귀 시 큰 delta 튐 방지
      frameCount: this.frameCount
    });

    this.scheduleNext();
  };

  private scheduleNext(): void {
    if (typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame(this.loop);
    }
  }
}
