'use client'
import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import { DEBOUNCE_MS } from '../types'
import type { LastCommit, TransitionEdge } from '../types'

export interface VerificationFooterProps {
  queryFromUrl: string
  rawQueryString: string
  lastCommit: LastCommit | null
  transitionEdges: TransitionEdge[]
  inputRenderLatencyMs: number | null
}

const COMMIT_DELAY_TOLERANCE_MS = 20

export function VerificationFooter({
  queryFromUrl,
  rawQueryString,
  lastCommit,
  transitionEdges,
  inputRenderLatencyMs,
}: VerificationFooterProps) {
  const hasTransitioned = transitionEdges.some((edge) => edge.type === 'start')
  const queryMatches = lastCommit !== null && queryFromUrl === lastCommit.query
  const delayHonored = lastCommit !== null && lastCommit.keystrokeToCommitMs >= DEBOUNCE_MS - COMMIT_DELAY_TOLERANCE_MS
  const isMatched = lastCommit === null ? undefined : queryMatches && delayHonored && hasTransitioned

  // ExpectedActualPanel은 isMatched가 undefined일 때 expected/actual이 둘 다 string이면
  // 문자열 내용을 그대로 비교해 "불일치"로 오판정한다(공유 컴포넌트 자체 로직, 수정 대상 아님).
  // "대기 중" 3단 상태를 올바르게 보여주기 위해 텍스트를 <> 프래그먼트로 감싸 그 자동비교 분기를 우회한다.
  const expectedText = [
    `마지막 키 입력 후 ${DEBOUNCE_MS}ms 이상 지나야 startTransition으로 감싼 router.replace()가 실제 호출됨`,
    `호출 직후 useSearchParams().get('q')가 커밋된 검색어와 정확히 일치해야 함 (query=${lastCommit ? `"${lastCommit.query}"` : '(대기 중)'})`,
    'isPending이 최소 1회는 true → false로 실제 전환되어야 함',
  ].join('\n')
  const expected = <>{expectedText}</>

  const actualText = lastCommit
    ? [
        `실측 커밋 지연: ${lastCommit.keystrokeToCommitMs.toFixed(1)}ms (기준 ${DEBOUNCE_MS}ms, 허용오차 -${COMMIT_DELAY_TOLERANCE_MS}ms)`,
        `useSearchParams().toString() → "${rawQueryString || '(쿼리 없음)'}"`,
        `쿼리 일치: ${queryMatches ? '일치' : '불일치'} · 디바운스 지연 충족: ${delayHonored ? '충족' : '미충족'} · isPending 전환 관측: ${hasTransitioned ? `${transitionEdges.length}건` : '없음'}`,
        `로컬 입력 렌더 반영 지연: ${inputRenderLatencyMs !== null ? `${inputRenderLatencyMs.toFixed(1)}ms` : '측정 전'} (URL 커밋 지연과 별개로 즉시 반영됨을 실측)`,
      ].join('\n')
    : '상호작용 대기 중 (상단 실습 화면의 검색창에 입력해 결과를 확인해 주세요.)'
  const actual = <>{actualText}</>

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="디바운스 지연·URL 동기화·트랜지션 전환의 실측 일치 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="이 패널은 실습 화면과 동일한 실측 데이터를 근거로, 커밋 지연이 300ms 기준을 실제로 충족했는지와 URL 쿼리·isPending 전환이 그 결과와 일치하는지 검증합니다."
      />
      <DemoDeepDiveCard title="useTransition 연동 디바운스 검색 쿼리 동기화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 동작 원리</h5>
            <p>
              <code>useSearchParams()</code>는 현재 URL 쿼리를 읽는 읽기 전용 클라이언트 훅이고, <code>useTransition()</code>은
              <code>[isPending, startTransition]</code>을 반환해 <code>startTransition</code> 콜백 안의 상태 업데이트를
              낮은 우선순위 렌더로 예약합니다. 콜백이 동기 함수여야 트랜지션으로 인식되며, <code>await</code> 이후의 갱신은
              트랜지션 범위 밖으로 빠집니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 동작 원리</h5>
            <p>
              키를 입력하면 <code>setInputValue</code>로 로컬 상태를 트랜지션 없이 즉시 갱신해 입력창이 끊기지 않게 하고,
              동시에 <code>setTimeout(..., {DEBOUNCE_MS})</code>을 다시 예약합니다. 이전 타이머는 매 입력마다
              <code>clearTimeout</code>으로 취소되므로, 타이핑을 멈춘 뒤 정확히 {DEBOUNCE_MS}ms가 지나야
              <code>startTransition(() =&gt; router.replace(pathname + '?q=...'))</code>이 실행되어 주소창 쿼리가 실제로 바뀝니다.
              이 갱신이 트랜지션으로 감싸져 있어 <code>useSearchParams()</code>를 구독하는 하위 트리가 다시 렌더링되는 동안에도
              <code>isPending</code>이 true로 관측되고, 입력 자체는 계속 반응합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>입력 반응성 보존</strong>: URL 갱신과 그에 따른 리렌더를 낮은 우선순위로 미뤄, 타이핑 자체는 매 키 입력마다 즉시 반영됩니다.</li>
              <li><strong>불필요한 URL 갱신 감소</strong>: 디바운스로 연속 입력 중 발생하는 과도한 <code>router.replace</code> 호출을 하나로 합칩니다.</li>
              <li><strong>뒤로가기 스택 오염 방지</strong>: <code>router.push</code> 대신 <code>router.replace</code>를 사용해 중간 검색어 입력이 히스토리에 쌓이지 않습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 및 핵심 팁 (Caution &amp; Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>로컬 상태와 URL 상태 분리</strong>: input의 <code>value</code>를 <code>searchParams</code>에 직접 바인딩하면 디바운스 지연 동안 타이핑이 막힙니다. 반드시 별도의 <code>useState</code>로 즉시 반영해야 합니다.</li>
              <li><strong>Suspense 경계 필수</strong>: <code>useSearchParams()</code>를 쓰는 클라이언트 컴포넌트는 프로덕션 빌드에서 <code>{'<'}Suspense{'>'}</code>로 감싸지 않으면 빌드가 실패합니다.</li>
              <li><strong>읽기 전용 객체 복제 후 수정</strong>: <code>searchParams</code>는 수정할 수 없으므로 <code>new URLSearchParams(searchParams.toString())</code>로 복제한 뒤 <code>set()</code>/<code>delete()</code>를 호출해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
