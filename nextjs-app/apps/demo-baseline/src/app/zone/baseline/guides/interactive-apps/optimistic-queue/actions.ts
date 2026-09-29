'use server'

import { INITIAL_LAYOUT, SAVE_DELAY_MS } from './constants'
import { channelLayoutReducer } from './reducers/channel-layout-reducer'
import type { LayoutChange, LayoutGroup } from './types'

// 서버 메모리 저장소. 모든 방문자가 공유하며 재시작·다중 인스턴스에서는 유지되지 않는다.
let savedLayout: LayoutGroup[] = structuredClone(INITIAL_LAYOUT)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function simulateWrite(injectFail: boolean) {
  // 실제 DB 쓰기 지연을 대신하는 관찰용 지연. 실패도 서버 안에서만 만든다.
  await sleep(SAVE_DELAY_MS)
  if (injectFail) throw new Error('저장 실패(실패 주입)')
}

/** queued: 클라이언트가 넘긴 이전 저장본에 변경 하나를 적용해 저장하고 결과를 돌려준다. */
export async function saveLayoutChange(
  previousGroups: LayoutGroup[],
  change: LayoutChange,
  injectFail: boolean,
): Promise<LayoutGroup[]> {
  await simulateWrite(injectFail)
  savedLayout = channelLayoutReducer(previousGroups, change)
  return savedLayout
}

/** naive: 클라이언트가 계산한 전체 레이아웃을 그대로 덮어써 저장한다. */
export async function saveLayoutSnapshot(
  nextGroups: LayoutGroup[],
  injectFail: boolean,
): Promise<LayoutGroup[]> {
  await simulateWrite(injectFail)
  savedLayout = nextGroups
  return savedLayout
}

export async function getSavedLayout(): Promise<LayoutGroup[]> {
  return savedLayout
}

export async function resetSavedLayout(): Promise<LayoutGroup[]> {
  savedLayout = structuredClone(INITIAL_LAYOUT)
  return savedLayout
}
