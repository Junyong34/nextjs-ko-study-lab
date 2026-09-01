'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• output: 'standalone' 도커 경량 컨테이너 패키징의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="output: 'standalone' 도커 경량 컨테이너 패키징 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
            <DemoDeepDiveCard title="next.config.ts output: 'standalone' 초경량 도커 컨테이너 빌드 (.next/standalone)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>output: 'standalone'</code> (<code>next.config.ts</code>) 설정은 전체 <code>node_modules</code> 중 실제 프로덕션 실행에 필요한 최소한의 의존성 모듈만을 자동으로 추적(Tracing) 및 번들링하여 <code>.next/standalone/</code> 디렉토리에 초경량 독립 Node.js 서버 패키지를 생성하는 프로덕션 컨테이너 최적화 스펙입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 빌드 시 수 기가바이트(GB)에 달하는 개발 의존성을 제외하고 단 수십 메가바이트(MB) 수준의 최소 모듈과 <code>server.js</code>를 생성하여, 쿠버네티스(K8s) 도커 이미지 크기를 80% 이상 압축하고 빠른 컨테이너 기동을 실현합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>도커 이미지 크기 80% 이상 절감</strong>: 수 GB에 달하는 무거운 컨테이너 이미지를 100MB 안팎의 초경량 이미지로 경량화합니다.</li>
              <li><strong>CI/CD 배포 속도 극대화</strong>: 컨테이너 이미지 빌드 및 레지스트리 푸시/풀 네트워크 전송 시간을 대폭 단축합니다.</li>
              <li><strong>파드(Pod) 오토스케일링 가속</strong>: 트래픽 급증 시 새로운 쿠버네티스 파드가 수 초 만에 기동하여 신속하게 부하를 분산합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쿠버네티스(EKS, GKE) 기반 엔터프라이즈 마이크로서비스 배포</li>
              <li>Docker / AWS ECS / Google Cloud Run 컨테이너 기반 서버리스 배포</li>
              <li>지속적 배포(CI/CD) 파이프라인의 빌드/배포 시간 최적화</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정적 파일 수동 복사 필요</strong>: <code>standalone</code> 폴더에는 정적 파일이 포함되지 않으므로 Dockerfile 작성 시 <code>public</code> 폴더와 <code>.next/static</code> 폴더를 <code>standalone</code> 하위 경로로 명시적 복사(<code>COPY</code>)해야 정상 렌더링됩니다.</li>
              <li><strong>sharp/네이티브 바이너리</strong>: 이미지 최적화용 <code>sharp</code> 모듈을 컨테이너에서 사용할 때는 도커 베이스 이미지(Alpine/Debian)의 C++ 라이브러리 호환성을 확인해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
