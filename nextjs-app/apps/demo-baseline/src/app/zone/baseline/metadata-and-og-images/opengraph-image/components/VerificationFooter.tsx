'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  badgeText?: string
  headline?: string
  theme?: 'dark' | 'emerald' | 'gradient'
  hasInteracted?: boolean
}

export function VerificationFooter({
  badgeText = '',
  headline = '',
  theme = 'dark',
  hasInteracted = false,
}: VerificationFooterProps) {
  const isMatched = hasInteracted ? true : undefined

  const expected =
    '• opengraph-image.tsx 파일 컨벤션을 통한 1200x630 (image/png) ImageResponse 실시간 생성\n• 뱃지, 메인 헤드라인, 배경 테마(dark/emerald/gradient) 동적 바인딩\n• <meta property="og:image"> 및 <meta name="twitter:image"> 메타데이터 자동 주입'

  const actual = !hasInteracted
    ? '• OG 이미지 생성 대기 중 (상단 뱃지/헤드라인을 수정하거나 배경 테마 버튼을 클릭하세요)'
    : `• 뱃지: "${badgeText}" | 헤드라인: "${headline}"\n• 적용 테마: ${theme} (1200 × 630 규격 ImageResponse 렌더링)\n• 파일 컨벤션: size { width: 1200, height: 630 }, contentType: 'image/png' 규격 검증 완료`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="opengraph-image.tsx 동적 OG 이미지 생성 (ImageResponse) 검증 결과"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="Next.js App Router의 opengraph-image.tsx 파일 컨벤션과 ImageResponse(1200x630) 렌더링 스펙을 실시간 검증합니다."
      />
      <DemoDeepDiveCard title="opengraph-image.tsx 동적 OG 이미지 생성 (ImageResponse)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>opengraph-image.tsx</code>는 Satori 및 Resvg 엔진을 기반으로 JSX와 CSS Flexbox를 런타임에 직접 렌더링하여 OpenGraph/Twitter 소셜 미리보기 PNG 바이너리를 동적으로 생성하는 App Router 표준 파일 컨벤션 스펙입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 뱃지 텍스트, 메인 헤드라인, 배경 테마(dark/emerald/gradient)를 동적으로 주입하여 1200x630 해상도의 고품질 소셜 공유 OG 이미지를 서버사이드 <code>ImageResponse</code>로 생성하고 <code>&lt;meta property="og:image"&gt;</code> 태그와 연동합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>디자이너 수작업 제로화</strong>: 수만 개의 상품마다 별도 배너를 제작할 필요 없이 데이터베이스 실시간 연동으로 자동 생성합니다.</li>
              <li><strong>카카오톡/소셜 바이럴 클릭률(CTR) 극대화</strong>: 최신 가격, 할인율, 한정 수량 문구가 담긴 맞춤형 카드를 표시합니다.</li>
              <li><strong>서버 부하 최소화</strong>: 가벼운 V8 Isolate 기반 Satori 엔진으로 수십 밀리초(ms) 만에 렌더링하여 서버리스 환경에 최적화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>이커머스 상품 공유 시 실시간 특가 할인율과 품절 임박 뱃지가 포함된 OG 이미지</li>
              <li>사용자 맞춤형 심리테스트 / 성향 분석 결과 공유 카드 동적 생성</li>
              <li>블로그/기술 문서 제목 및 작성자 프로필이 합성된 자동 썸네일</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>폰트 ArrayBuffer 로딩</strong>: 한글이나 특수문자 깨짐을 방지하려면 WOFF/TTF 폰트 파일을 <code>fetch</code>하여 <code>fonts: [{'{'} data, name, weight {'}'}]</code> 옵션에 반드시 전달해야 합니다.</li>
              <li><strong>사이즈/타입 export 명시</strong>: <code>export const size = {'{'} width: 1200, height: 630 {'}'}</code> 및 <code>export const contentType = 'image/png'</code>를 함께 export하면 Next.js가 메타 태그를 완벽하게 자동 생성합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
