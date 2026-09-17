/**
 * @fileoverview Spring Simulator Module
 * 강성(stiffness)과 감쇠(damping) 기반 스프링 물리 진동 시뮬레이터
 */

export interface SpringConfig {
  stiffness?: number; // 스프링 강성 (기본 120)
  damping?: number;   // 감쇠 계수 (기본 12)
  mass?: number;      // 질량 (기본 1)
  precision?: number; // 정지 판정 임계치
}

export class SpringSimulator {
  public current = 0;
  public velocity = 0;
  public target = 0;

  private stiffness: number;
  private damping: number;
  private mass: number;
  private precision: number;

  constructor(config: SpringConfig = {}) {
    this.stiffness = config.stiffness ?? 120;
    this.damping = config.damping ?? 12;
    this.mass = config.mass ?? 1;
    this.precision = config.precision ?? 0.001;
  }

  public setConfig(config: Partial<SpringConfig>): void {
    if (config.stiffness !== undefined) this.stiffness = config.stiffness;
    if (config.damping !== undefined) this.damping = config.damping;
    if (config.mass !== undefined) this.mass = config.mass;
  }

  public reset(value = 0, target = value): void {
    this.current = value;
    this.velocity = 0;
    this.target = target;
  }

  /**
   * 오일러 수치 적분을 통해 스프링 상태를 1스텝 전진시킵니다.
   * @param dtSeconds 초 단위 델타 타임 (예: 1/60)
   * @returns 스프링이 목표에 도달하여 안착했는지(settled) 여부
   */
  public step(dtSeconds = 1 / 60): boolean {
    const force = -this.stiffness * (this.current - this.target) - this.damping * this.velocity;
    const acceleration = force / this.mass;

    this.velocity += acceleration * dtSeconds;
    this.current += this.velocity * dtSeconds;

    const isSettled =
      Math.abs(this.velocity) < this.precision &&
      Math.abs(this.current - this.target) < this.precision;

    if (isSettled) {
      this.current = this.target;
      this.velocity = 0;
    }

    return isSettled;
  }
}
