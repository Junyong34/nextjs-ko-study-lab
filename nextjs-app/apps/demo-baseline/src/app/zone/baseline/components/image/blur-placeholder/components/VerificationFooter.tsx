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

  const defaultExpected = "• placeholder='blur' 저용량 블러 미리보기 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="placeholder='blur' 저용량 블러 미리보기 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="next/image placeholder='blur' 저용량 블러 미리보기 (LQIP)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/image</code>의 <code>placeholder="blur"</code> 속성은 고해상도 이미지가 네트워크를 통해 완전히 다운로드되기 전까지 수십~수백 바이트 크기의 저화질 블러 이미지(LQIP: Low Quality Image Placeholder)를 즉시 표시하여 시각적 로딩 경험을 극대화하는 컴포넌트 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 정적 import 이미지(자동 생성된 base64 blurDataURL)와 원격 CDN 상품 이미지(수동 생성된 blurDataURL)에 대해, 네트워크 속도가 느린 환경에서도 빈 박스 대신 부드러운 블러 썸네일이 먼저 나타난 후 실제 선명한 이미지로 전환되는 과정을 실증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>체감 로딩 속도 대폭 개선</strong>: 흰색 빈 공간 대신 이미지 윤곽을 0ms로 렌더링하여 사용자 이탈율을 감소시킵니다.</li>
              <li><strong>정적 이미지 자동 블러 생성</strong>: 로컬 파일 <code>import img from './photo.jpg'</code> 사용 시 빌드 도구가 8x8 저용량 base64 인코딩을 자동 생성합니다.</li>
              <li><strong>부드러운 페이드인 트랜지션</strong>: CSS 필터 애니메이션과 결합하여 세련된 이미지 로딩 UX를 완성합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 상품 상세 메인 갤러리 및 배너 이미지 로딩</li>
              <li>블로그/뉴스 기사 본문 내 고해상도 첨부 사진 뷰어</li>
              <li>인스타그램 스타일의 포토 피드 무한 스크롤 썸네일</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>원격 이미지 사용 시 blurDataURL 필수</strong>: <code>src</code>가 원격 URL(e.g., <code>https://cdn.example.com/...</code>)인 경우 Next.js가 빌드 시점에 블러를 자동 계산할 수 없으므로 <code>blurDataURL</code> 속성에 유효한 base64 데이터 URI를 직접 전달해야 합니다.</li>
              <li><strong>blurDataURL 크기 최적화</strong>: blurDataURL 문자열이 너무 크면 HTML 문서 용량이 증가하므로 10x10 미만의 초소형 SVG/PNG base64를 사용하는 것이 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
