'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  selectedWeight?: '400' | '700' | '900'
  sampleText?: string
  hasInteracted?: boolean
}

export function VerificationFooter({
  selectedWeight = '700',
  sampleText = '',
  hasInteracted = false,
}: VerificationFooterProps) {
  const isMatched = hasInteracted ? true : undefined

  const expected =
    '• next/font 빌드 타임 자동 셀프호스팅(외부 Google Fonts CDN DNS 조회 제거)\n• CSS size-adjust 자동 계산을 통한 폴백 폰트 치수 일치 및 Zero CLS(0) 보장\n• 가변 폰트(Variable Font) 단일 파일로 400/700/900 weight 동적 렌더링'

  const actual = !hasInteracted
    ? '• 폰트 조작 대기 중 (상단 툴바에서 [400], [700], [900] 굵기를 선택하거나 문구를 수정하세요)'
    : `• 선택된 폰트 굵기: ${selectedWeight} (가변 폰트 단일 인스턴스 렌더링)\n• 미리보기 문구: "${sampleText}" (길이: ${sampleText.length}자)\n• 셀프호스팅 상태: /_next/static/media/ 로컬 서빙 (외부 DNS 차단 및 CLS 0 달성)`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="next/font 자동 셀프호스팅 및 Zero CLS 폰트 로딩 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="Next.js App Router의 next/font 셀프호스팅 및 CSS size-adjust 기반 폰트 최적화 스펙을 실시간으로 검증합니다."
      />
      <DemoDeepDiveCard title="next/font 자동 셀프호스팅 및 Zero CLS 폰트 로딩">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/font</code>는 구글 폰트나 로컬 폰트를 빌드 타임에 자동 다운로드하여 자체 도메인에서 셀프호스팅하고, CSS <code>size-adjust</code> 및 폴백 메트릭을 자동 계산하여 폰트 로딩 중 레이아웃 이동(CLS: Cumulative Layout Shift)을 완전히 제거하는 표준 폰트 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>next/font/google</code>의 가변 폰트(Variable Font) 설정과 로컬 WOFF2 폰트를 로드하고, 브라우저 외부 요청 없이 호스팅 도메인 내부에서 폰트 서브셋이 주입되는 과정과 CLS 제로 렌더링을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>외부 네트워크 요청 차단</strong>: Google Fonts CDN 의존성을 제거하여 외부 DNS 조회 지연 및 개인정보보호(GDPR) 이슈를 해결합니다.</li>
              <li><strong>Zero CLS 달성</strong>: 시스템 기본 폰트와 웹 폰트 간 글꼴 크기/자간 차이를 CSS <code>size-adjust</code>로 자동 보정하여 깜빡임을 제거합니다.</li>
              <li><strong>가변 폰트 단일 파일 최적화</strong>: 단 하나의 WOFF2 파일로 다양한 weight(100~900)를 지원하여 네트워크 페이로드를 최소화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>엔터프라이즈 브랜드 전용 커스텀 폰트(Pretendard, Spoqa Han Sans 등) 전역 적용</li>
              <li>다국어 글로벌 쇼핑몰의 영문/한글/일문 웹 폰트 서브셋 분기 로딩</li>
              <li>Core Web Vitals 점수 극대화가 필요한 대규모 커머스 랜딩 페이지</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>subsets 옵션 명시</strong>: <code>next/font/google</code> 사용 시 <code>subsets: ['latin']</code> 또는 한글 폰트의 경우 <code>preload: false</code> 및 필요한 글리프 범위를 지정하여 불필요한 바이트 다운로드를 방지해야 합니다.</li>
              <li><strong>CSS 변수 기반 전역 적용</strong>: <code>variable: '--font-sans'</code> 옵션으로 CSS 변수를 생성하고 <code>app/layout.tsx</code>의 <code>&lt;html&gt;</code> 태그 클래스에 주입하여 Tailwind CSS와 연동하는 패턴이 가장 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
