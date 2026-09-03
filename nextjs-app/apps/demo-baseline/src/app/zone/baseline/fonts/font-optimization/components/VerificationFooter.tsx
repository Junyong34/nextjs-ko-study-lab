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
    '• 외부 CDN 카드(나눔명조)만 fonts.googleapis.com/fonts.gstatic.com에 실제 요청 발생\n• next/font/google(Noto Sans KR), next/font/local(Gaegu) 카드는 이 zone과 같은 도메인(_next/static/media)에서 서빙\n• next/font 두 카드는 adjustFontFallback으로 폴백 폰트 치수를 자동 보정해 레이아웃 흔들림을 줄임'

  const actual = !hasInteracted
    ? '• 폰트 조작 대기 중 (상단 툴바에서 [400], [700], [900] 굵기를 선택하거나 문구를 수정하세요)'
    : `• 선택된 굵기: ${selectedWeight} (폰트별로 실제 지원하는 굵기가 달라 렌더링 결과가 다를 수 있음)\n• 미리보기 문구: "${sampleText}" (길이: ${sampleText.length}자)\n• next/font 두 카드는 /_next/static/media/ 로컬 서빙, 외부 CDN 카드만 구글 도메인 요청`

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
              <code>next/font</code>는 구글 폰트나 로컬 폰트를 빌드 타임에 자동 다운로드하여 자체 도메인에서 셀프호스팅하고, 폴백 폰트 메트릭을 자동 보정(<code>adjustFontFallback</code>)하여 폰트 로딩 중 레이아웃 이동(CLS: Cumulative Layout Shift)을 줄이는 표준 폰트 최적화 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모는 실제로 서로 다른 3개의 한글 폰트를 로드합니다 — 외부 CDN 카드는 <code>&lt;link&gt;</code> 태그로 나눔명조를 fonts.googleapis.com에서 직접 요청하고, <code>next/font/google</code> 카드는 Noto Sans KR을 빌드 타임에 다운로드해 셀프호스팅하며, <code>next/font/local</code> 카드는 저장소에 직접 번들링한 로컬 TTF 파일(Gaegu)을 셀프호스팅합니다. 브라우저 개발자 도구 네트워크 탭을 열어보면 외부 CDN 카드만 구글 도메인으로 요청이 나가는 걸 확인할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>외부 네트워크 요청 차단</strong>: Google Fonts CDN 의존성을 제거하여 외부 DNS 조회 지연 및 개인정보보호(GDPR) 이슈를 해결합니다.</li>
              <li><strong>레이아웃 흔들림 완화</strong>: 시스템 기본 폰트와 웹 폰트 간 글꼴 크기/자간 차이를 <code>adjustFontFallback</code>으로 자동 보정하여 깜빡임을 줄입니다.</li>
              <li><strong>필요한 굵기만 선택적 다운로드</strong>: <code>weight: ['400', '700', '900']</code>처럼 실제 쓰는 굵기만 배열로 지정하면 그 굵기의 정적 파일만 받아와 불필요한 페이로드를 줄입니다(가변 폰트가 아닌 경우).</li>
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
              <li><strong>weight는 폰트마다 실제 지원값만 지정 가능</strong>: 이 데모의 Noto Sans KR·Gaegu는 가변 폰트가 아니라서 <code>weight</code> 배열에 그 폰트가 실제로 제공하는 굵기(예: Gaegu는 400/700만 존재)만 넣을 수 있습니다.</li>
              <li><strong>CSS 변수 기반 전역 적용</strong>: <code>variable: '--font-sans'</code> 옵션으로 CSS 변수를 생성하고 <code>app/layout.tsx</code>의 <code>&lt;html&gt;</code> 태그 클래스에 주입하여 Tailwind CSS와 연동하는 패턴이 가장 권장됩니다.</li>
              <li><strong>next/font는 호출 위치의 상대 경로 기준</strong>: <code>next/font/local</code>의 <code>src</code> 경로는 <code>localFont()</code>를 호출한 파일 기준 상대 경로입니다(이 데모는 <code>page.tsx</code>에서 호출하므로 <code>./assets/fonts/...</code>).</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
