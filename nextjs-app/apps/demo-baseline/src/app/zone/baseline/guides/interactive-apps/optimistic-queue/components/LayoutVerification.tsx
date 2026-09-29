'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { INITIAL_LAYOUT } from '../constants'
import { channelLayoutReducer, describeLayout } from '../reducers/channel-layout-reducer'
import type { LayoutMode, LayoutModel, LayoutGroup } from '../types'

type Props = { mode: LayoutMode; model: LayoutModel; serverRead: LayoutGroup[] | null }

export function LayoutVerification({ mode, model, serverRead }: Props) {
  const applied = model.issued.filter((m) => !m.failed)
  const expectedLayout = applied.reduce(
    (groups, m) => channelLayoutReducer(groups, m.change),
    INITIAL_LAYOUT,
  )
  const expected = describeLayout(expectedLayout)
  const actual = describeLayout(model.confirmed)

  const started = model.issued.length > 0
  const isMatched = !started || model.isPending ? undefined : expected === actual

  return (
    <ExpectedActualPanel
      title="발행한 이동이 서버 저장본에 모두 남았는가"
      isMatched={isMatched}
      description={
        started
          ? `모드: ${mode} · 발행한 이동 ${model.issued.length}건(실패 주입 ${model.issued.length - applied.length}건 제외) · ${model.isPending ? '저장 진행 중 — 완료 후 판정합니다.' : '저장 완료'}`
          : '채널을 저장 대기 중(1.2초)에 두 번 연속 이동하면 판정합니다.'
      }
      expected={`발행한 이동을 초기 상태에 순서대로 적용한 결과\n${expected}`}
      actual={`서버가 마지막으로 돌려준 저장본\n${actual}${
        serverRead ? `\n\n서버 메모리에서 다시 읽은 값\n${describeLayout(serverRead)}` : ''
      }${model.error ? `\n\n오류: ${model.error}` : ''}`}
    />
  )
}
