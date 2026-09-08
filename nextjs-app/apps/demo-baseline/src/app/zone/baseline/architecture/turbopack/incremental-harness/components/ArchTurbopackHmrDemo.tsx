'use client'

import {
  DemoDeepDiveCard,
  DemoPlaygroundCard,
  DemoResetButton,
  ExpectedActualPanel,
} from '@study/demo-kit'
import { useState } from 'react'
import { HMR_MARKER } from '../hmr-marker'

const COMPILE_ENV = {
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isServerBundle: import.meta.env.SSR,
}

export function ArchTurbopackHmrDemo() {
  const [count, setCount] = useState(0)
  const hasValidMode = COMPILE_ENV.mode === 'development' || COMPILE_ENV.mode === 'production'
  const actual = `MODE: ${COMPILE_ENV.mode}\nDEV: ${COMPILE_ENV.isDevelopment}\nPROD: ${COMPILE_ENV.isProduction}\nSSR(client bundle): ${COMPILE_ENV.isServerBundle}\nmarker: ${HMR_MARKER}\n상태 카운터: ${count}`

  return (
    <>
      <DemoPlaygroundCard title="컴파일 타임 환경과 로컬 상태">
        <div className="space-y-3">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{HMR_MARKER}</p>
            <p className="mt-1 text-zinc-500">현재 React 상태 카운터: {count}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCount((current) => current + 1)} className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">상태 카운터 증가</button>
            <DemoResetButton onReset={() => setCount(0)} />
          </div>
          <p className="text-xs leading-relaxed text-zinc-500">
            로컬 검증 파일: <code>architecture/turbopack/incremental-harness/hmr-marker.ts</code>
          </p>
        </div>
      </DemoPlaygroundCard>

      <ExpectedActualPanel
        title="Turbopack 컴파일 환경"
        expected="Next.js 16 기본 Turbopack 빌드에서 import.meta.env가 정적 값으로 치환됨"
        actual={actual}
        isMatched={hasValidMode && COMPILE_ENV.isDevelopment !== COMPILE_ENV.isProduction}
        description="시간 수치를 만들지 않고 Turbopack 전용 import.meta.env 결과를 실제 번들에서 읽습니다."
      />

      <DemoDeepDiveCard title="증분 번들링과 Fast Refresh는 같은 주제가 아닙니다">
        <p>Turbopack은 요청된 모듈만 지연 번들링하고 계산 결과를 세밀하게 캐시하는 증분 번들러입니다. Next.js 16에서는 별도 <code>--turbopack</code> 플래그 없이 기본 사용됩니다.</p>
        <p>Fast Refresh는 React와 Next.js가 제공하는 개발 경험입니다. 안전한 컴포넌트 편집에서는 로컬 상태 보존을 시도하지만, React 트리 밖에서도 쓰는 모듈 변경이나 클래스 컴포넌트 등에서는 전체 새로고침 또는 상태 초기화가 발생할 수 있습니다.</p>
        <p>갱신 시간은 프로젝트 크기와 변경 그래프에 따라 달라집니다. 따라서 고정된 ms 수치 대신 개발 서버 로그와 실제 상태 보존 여부를 관찰합니다.</p>
      </DemoDeepDiveCard>
    </>
  )
}
