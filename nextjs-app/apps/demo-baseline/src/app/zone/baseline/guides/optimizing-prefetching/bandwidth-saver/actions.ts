'use server'

import { readRenders, resetRenders } from './lib/render-counter'
import type { RenderSnapshot } from './types'

/** 목적지 layout/page가 서버에서 실행된 횟수를 모드별로 읽는다. */
export async function getRenderSnapshot(): Promise<RenderSnapshot> {
  return readRenders()
}

export async function resetRenderSnapshot(): Promise<void> {
  resetRenders()
}
