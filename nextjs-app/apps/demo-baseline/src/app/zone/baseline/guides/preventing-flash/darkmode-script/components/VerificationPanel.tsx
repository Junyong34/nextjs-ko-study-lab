'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { DEFAULT_THEME } from '../lib/theme'
import { frameText, type ProbeSummary } from '../lib/summarize'

interface Props {
  effect: ProbeSummary | null
  script: ProbeSummary | null
}

export function VerificationPanel({ effect, script }: Props) {
  const ready = effect?.done && script?.done
  const differs = ready && script.target !== DEFAULT_THEME

  const isMatched = !ready || !differs
    ? undefined
    : script.firstFrame?.theme === script.target &&
      script.wrongFrames === 0 &&
      script.errors.length === 0 &&
      effect.firstFrame?.theme === DEFAULT_THEME &&
      effect.finalFrame?.theme === effect.target

  const expected = (
    <>
      {`저장값 dark(서버 기본값 ${DEFAULT_THEME}과 다름)일 때\n`}
      {'B. 인라인 스크립트: 첫 rAF 프레임부터 dark, 잘못된 프레임 0, hydration 경고 0\n'}
      {`A. useEffect: 첫 rAF 프레임 ${DEFAULT_THEME}(서버 HTML) → 하이드레이션 뒤 dark (깜빡임)`}
    </>
  )

  const actual = !ready ? (
    <>{'두 iframe의 측정이 끝나기를 기다리는 중...'}</>
  ) : !differs ? (
    <>{`저장값이 ${script.target}(서버 기본값과 같음) — 차이가 생기지 않습니다.\n[dark 저장 후 두 방식 새로고침]을 눌러 주세요.`}</>
  ) : (
    <>
      {`B. 첫 프레임 ${frameText(script.firstFrame)}\n`}
      {`   잘못된 프레임 ${script.wrongFrames}, 경고 ${script.errors.length}건\n`}
      {`A. 첫 프레임 ${frameText(effect.firstFrame)}\n`}
      {`   잘못된 프레임 ${effect.wrongFrames}(${effect.wrongMs.toFixed(1)}ms) → 최종 ${effect.finalFrame?.theme}`}
    </>
  )

  return (
    <ExpectedActualPanel
      title="첫 페인트 시점의 테마 대조"
      expected={expected}
      actual={actual}
      isMatched={isMatched}
      description="두 하위 라우트를 실제로 하드 로드해, 각 문서의 rAF 프레임마다 기록한 data-theme·배경색과 하이드레이션 시점 값을 비교합니다."
    />
  )
}
