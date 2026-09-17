'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { CrawlerMode } from '../types'

export interface VerificationFooterProps {
  mode: CrawlerMode | null
  bodyText: string
  hasFetched: boolean
}

interface Evaluation {
  isMatched: boolean
  detail: string
}

function evaluateStaging(text: string): Evaluation {
  const blocksAll = text.includes('User-Agent: *') && text.includes('Disallow: /')
  const hasStagingSitemap = text.includes(
    'Sitemap: https://staging.study-lab.example.com/sitemap.xml',
  )
  const isMatched = blocksAll && hasStagingSitemap
  return {
    isMatched,
    detail: isMatched
      ? '• 응답 텍스트에서 "User-Agent: *" + "Disallow: /" 조합(전체 차단) 확인\n• staging 전용 Sitemap URL 확인'
      : '• staging 모드에 필요한 전체 차단(Disallow: /) 또는 staging Sitemap URL을 응답 텍스트에서 찾지 못함',
  }
}

function evaluateProduction(text: string): Evaluation {
  const allowsGooglebotProducts =
    text.includes('User-Agent: Googlebot') && text.includes('Allow: /products/')
  const hasProductionSitemap = text.includes(
    'Sitemap: https://study-lab.example.com/sitemap.xml',
  )
  const hasHost = text.includes('Host: https://study-lab.example.com')
  const isMatched = allowsGooglebotProducts && hasProductionSitemap && hasHost
  return {
    isMatched,
    detail: isMatched
      ? '• "User-Agent: Googlebot" 규칙에 "Allow: /products/" 포함 확인\n• 프로덕션 Sitemap/Host 라인 확인'
      : '• 프로덕션 모드에 필요한 Googlebot 허용 규칙 또는 Sitemap/Host 라인을 응답 텍스트에서 찾지 못함',
  }
}

export function VerificationFooter({ mode, bodyText, hasFetched }: VerificationFooterProps) {
  const evaluation: Evaluation | null = !hasFetched || !mode
    ? null
    : mode === 'staging'
    ? evaluateStaging(bodyText)
    : evaluateProduction(bodyText)

  const expected =
    '• production: User-Agent: * → Allow: /, Disallow: [/admin/, /checkout/, /account/]\n  Googlebot → Allow: [/products/, /catalog/]\n  Sitemap/Host 라인 포함\n• staging: User-Agent: * → Disallow: / (전체 차단), staging 전용 Sitemap'

  const actual = !hasFetched
    ? '• 요청 대기 중 (상단 production/staging 버튼을 눌러 실제 GET 요청을 보내세요)'
    : `• 요청 모드: ${mode}\n${evaluation?.detail ?? ''}`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="robots.ts 생성 규칙 → 실제 robots.txt 응답 텍스트 검증"
        expected={expected}
        actual={actual}
        isMatched={hasFetched ? evaluation?.isMatched : undefined}
        description="Route Handler(preview/route.ts)가 실제로 반환한 robots.txt 텍스트를 직접 파싱해, 코드에서 정의한 규칙(User-Agent/Allow/Disallow/Sitemap/Host)이 그대로 반영됐는지 검증합니다."
      />
      <DemoDeepDiveCard title="robots.ts 파일 컨벤션 & 동적 크롤링 규칙">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 앱 루트 제약</h5>
            <p>
              <code>robots.ts</code>(또는 <code>robots.js</code>)는 <strong>app 디렉터리 루트</strong>에 있을 때만
              Next.js가 특수 파일로 인식해 <code>MetadataRoute.Robots</code> 반환값을 실제{' '}
              <code>/robots.txt</code> 텍스트로 직렬화해 서빙합니다. 이 zone(<code>demo-baseline</code>)의
              app 루트는 여러 데모가 공유하는 자원이라, 이 데모는 <code>robots-rules.ts</code>에 동일한
              규칙 함수를 두고 <code>preview/route.ts</code> Route Handler로 그 결과를 재현해 보여줍니다.
              실제 프로젝트에서는 이 함수를 그대로 <code>app/robots.ts</code>의 default export로 옮기면 됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              [production 모드로 요청] 버튼은 관리자/결제 경로만 선별 차단하고 Googlebot에는{' '}
              <code>/products/</code>, <code>/catalog/</code>를 허용하며 Sitemap/Host를 포함한 규칙을
              요청합니다. [staging 모드로 요청] 버튼은 <code>User-Agent: *</code>에{' '}
              <code>Disallow: /</code>(전체 차단)만 반환하는 규칙을 요청합니다. 두 버튼 모두 실제 GET
              요청을 <code>preview/route.ts</code>로 보내고, 서버가 그때그때 계산한 텍스트를 그대로
              화면에 표시합니다 — 하드코딩된 문자열이 아닙니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>스테이징 검색 노출 사고 방지</strong>: 환경별로 다른 규칙 함수를 반환해 테스트 사이트가 검색엔진에 무단 색인되는 사고를 차단합니다.</li>
              <li><strong>타입 안전한 크롤링 규칙</strong>: <code>MetadataRoute.Robots</code> 타입으로 User-Agent, Allow, Disallow, Sitemap URL 오타를 방지합니다.</li>
              <li><strong>Route Handler와 동일한 캐싱/동적 API 규칙 적용</strong>: robots.ts는 요청 시점 API를 쓰지 않으면 기본적으로 캐시되는 특수 Route Handler입니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>루트 전용 파일</strong>: 하위 라우트 폴더에 robots.ts를 두어도 라우팅되지 않습니다 — app 루트에만 유효합니다.</li>
              <li><strong>정적 robots.txt와 공존 불가</strong>: <code>app/robots.txt</code> 정적 파일이 있으면 동적 <code>robots.ts</code>는 무시됩니다.</li>
              <li><strong>Sitemap 절대 URL</strong>: <code>sitemap</code> 속성에는 전체 도메인을 포함한 절대 URL을 입력해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
