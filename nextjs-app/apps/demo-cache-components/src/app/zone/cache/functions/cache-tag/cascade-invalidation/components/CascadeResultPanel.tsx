'use client'

import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { CacheEntrySnapshot, InvalidationTarget } from '../types'

export interface CascadeRun {
  target: InvalidationTarget
  /** 버튼을 누른 순간 화면에 있던(서버가 렌더한) 엔트리 스냅샷 */
  before: CacheEntrySnapshot[]
}

interface CascadeResultPanelProps {
  run: CascadeRun | null
  entries: CacheEntrySnapshot[]
  isPending: boolean
}

const TITLE = '태그 계층별 무효화 범위(blast radius)'

function labels(list: CacheEntrySnapshot[]) {
  return list.length === 0 ? '(없음)' : list.map((e) => e.label).join(', ')
}

export function CascadeResultPanel({ run, entries, isPending }: CascadeResultPanelProps) {
  if (!run || isPending) {
    // 문자열 expected/actual + isMatched undefined 조합은 demo-kit이 "불일치"로 오판하므로 JSX로 감싼다
    return (
      <ExpectedActualPanel
        title={TITLE}
        description={
          isPending
            ? 'Server Action 실행 중입니다. 액션 응답에 담긴 새 렌더 결과를 기다립니다.'
            : '위 실습 화면에서 무효화 버튼 하나를 눌러 주세요.'
        }
        expected={<span>무효화한 태그를 cacheTag()로 부착한 엔트리만 cacheId가 바뀐다.</span>}
        actual={<span>{isPending ? '측정 중...' : '아직 실행한 무효화가 없습니다.'}</span>}
        isMatched={undefined}
      />
    )
  }

  // 기대: 버튼을 누르기 전 각 엔트리가 서버에서 실제로 부착하고 있던 태그 목록 기준
  const expected = run.before.filter((e) => e.tags.includes(run.target.tag))
  // 실제: 액션 전후로 서버가 렌더한 cacheId를 비교해 실제로 다시 계산된 엔트리
  const beforeById = new Map(run.before.map((e) => [e.key, e.cacheId]))
  const recomputed = entries.filter((e) => beforeById.get(e.key) !== e.cacheId)
  const kept = entries.filter((e) => beforeById.get(e.key) === e.cacheId)

  const expectedKeys = expected.map((e) => e.key).sort().join('|')
  const actualKeys = recomputed.map((e) => e.key).sort().join('|')

  return (
    <ExpectedActualPanel
      title={TITLE}
      description={`updateTag('${run.target.tag}') 실행 전후로 서버가 렌더한 엔트리 ${entries.length}개의 cacheId를 비교했습니다.`}
      expected={
        <span>
          {`대상 태그를 가진 엔트리 ${expected.length}개가 재계산\n- ${labels(expected)}\n나머지 ${run.before.length - expected.length}개는 유지`}
        </span>
      }
      actual={
        <span>
          {`재계산 ${recomputed.length}개 (cacheId 변경)\n- ${labels(recomputed)}\n유지 ${kept.length}개 (cacheId 동일)\n- ${labels(kept)}`}
        </span>
      }
      isMatched={expectedKeys === actualKeys}
    />
  )
}
