'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { FontFaceProbeResult, LocalFontWeight } from '../types'

export interface VerificationFooterProps {
  weight: LocalFontWeight
  primaryFamily: string
  hasInteracted: boolean
  probe: FontFaceProbeResult
}

export function VerificationFooter({ weight, primaryFamily, hasInteracted, probe }: VerificationFooterProps) {
  const { fontFaceRules, computedFontFamily, computedFontWeight, isFontLoaded, isReady } = probe

  // 실제 측정값 3가지가 전부 통과해야만 "검증 완료" — 버튼 클릭만으로 무조건 성공하지 않는다.
  const familyMatches = computedFontFamily.includes(primaryFamily)
  const weightMatches = computedFontWeight === weight
  const isMatched = !isReady ? undefined : familyMatches && weightMatches && isFontLoaded && fontFaceRules.length > 0

  const expected =
    `• document.styleSheets 안에 family가 "${primaryFamily}"를 포함하는 @font-face 규칙이 최소 1개 존재\n` +
    `• 미리보기 요소의 getComputedStyle().fontFamily가 "${primaryFamily}"를 포함\n` +
    `• getComputedStyle().fontWeight가 선택한 굵기(${weight})와 일치\n` +
    `• document.fonts.check('${weight} 16px "${primaryFamily}"')가 true`

  const actual = !isReady
    ? '• 폰트 로드 및 CSSOM 스캔 대기 중 (document.fonts.ready 완료 후 자동 측정)'
    : `• 발견된 @font-face 규칙: ${fontFaceRules.length}개\n` +
      `• computed font-family: ${computedFontFamily || '(없음)'}\n` +
      `• computed font-weight: ${computedFontWeight || '(없음)'}\n` +
      `• document.fonts.check 결과: ${isFontLoaded}\n` +
      (hasInteracted ? '• 사용자가 굵기 버튼을 조작함' : '• 아직 굵기 버튼을 조작하지 않음 (초기 400 상태 측정값)')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="next/font/local @font-face 실측 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="브라우저 CSSOM(document.styleSheets)과 getComputedStyle을 직접 읽어, next/font/local이 실제로 @font-face 규칙을 생성하고 그 스타일이 미리보기 요소에 적용됐는지 검증합니다."
      />

      {fontFaceRules.length > 0 && (
        <div className="rounded border border-zinc-200 bg-zinc-950 p-3 font-mono text-[10px] leading-relaxed text-zinc-300 dark:border-zinc-800 overflow-x-auto">
          <div className="mb-1 font-bold text-zinc-400">실제 CSSOM @font-face 규칙 (document.styleSheets에서 직접 읽음):</div>
          {fontFaceRules.map((rule, i) => (
            <div key={i} className="whitespace-pre-wrap break-all">
              {rule}
            </div>
          ))}
        </div>
      )}

      <DemoDeepDiveCard title="next/font/local 커스텀 로컬 폰트 매핑">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/font/local</code>은 <code>src</code>에 지정한 로컬 <code>.woff2</code>/<code>.woff</code>/<code>.otf</code>/<code>.ttf</code> 파일을 <code>localFont()</code>를 호출한 파일 기준 상대 경로로 찾아, 빌드 타임에 <code>@font-face</code> 규칙을 생성하고 자체 도메인(<code>/_next/static/media</code>)에서 셀프호스팅합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모는 <code>src: [{'{'} path: &apos;./assets/fonts/Gaegu-Regular.woff2&apos;, weight: &apos;400&apos; {'}'}, {'{'} path: &apos;./assets/fonts/Gaegu-Bold.woff2&apos;, weight: &apos;700&apos; {'}'}]</code> 배열로 서로 다른 두 파일을 weight별로 매핑합니다. Next.js는 이 배열마다 개별 <code>@font-face</code> 규칙을 생성하고, 하나의 <code>className</code>으로 두 굵기를 모두 사용할 수 있게 묶습니다. 위 검증 패널의 값은 하드코딩이 아니라, 브라우저의 <code>document.styleSheets</code>와 <code>getComputedStyle()</code>을 직접 읽어 측정한 실제 값입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>FOIT/FOUT 완화</strong>: 기본값 <code>display: &apos;swap&apos;</code>은 폴백 폰트로 즉시 텍스트를 그리고 로컬 폰트가 준비되면 교체해, 텍스트가 보이지 않는 FOIT(Flash of Invisible Text) 구간을 없앱니다.</li>
              <li><strong>외부 CDN 요청 없음</strong>: 사내 전용/유료 라이선스 폰트를 외부 서버 없이 이 zone과 같은 도메인에서 서빙할 수 있습니다.</li>
              <li><strong>다중 weight 파일을 단일 family로 통합</strong>: 실제 존재하는 굵기만 <code>src</code> 배열로 명시하면 각 굵기의 정적 파일만 받아 하나의 <code>font-family</code>로 매핑합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>Google Fonts에 없는 사내 전용 CI/BI 브랜드 폰트(Pretendard 등) 서빙</li>
              <li>유료 라이선스 폰트를 외부 CDN 없이 자체 도메인에서만 배포해야 하는 경우</li>
              <li>가변 폰트가 아니라 굵기별로 별도 파일이 나뉘어 있는 레거시 웹폰트 마이그레이션</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>src 경로는 호출 파일 기준 상대 경로</strong>: 이 데모는 <code>page.tsx</code>에서 <code>localFont()</code>를 호출하므로 <code>./assets/fonts/...</code>로 지정합니다.</li>
              <li><strong>weight를 지정하지 않은 파일은 매칭 실패</strong>: <code>src</code> 배열의 각 항목에 실제 파일이 지원하는 <code>weight</code>/<code>style</code>을 정확히 맞춰야 브라우저가 올바른 <code>@font-face</code>를 선택합니다.</li>
              <li><strong>adjustFontFallback 기본값은 &apos;Arial&apos;</strong>: 로컬 폰트와 폴백 폰트의 메트릭 차이를 자동 보정해 레이아웃 흔들림을 줄이며, 필요하면 <code>false</code>로 끌 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
