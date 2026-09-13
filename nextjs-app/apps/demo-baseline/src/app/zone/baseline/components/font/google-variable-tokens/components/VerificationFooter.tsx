'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { FontMeta, VariableFontProbeResult } from '../types'

export interface VerificationFooterProps {
  font: FontMeta
  weight: number
  hasInteracted: boolean
  probe: VariableFontProbeResult
}

export function VerificationFooter({ font, weight, hasInteracted, probe }: VerificationFooterProps) {
  const {
    cssVariableValue,
    fontFaceRules,
    fontFaceWeightDescriptors,
    computedFontFamily,
    computedFontWeight,
    isWeightAvailable,
    isReady,
  } = probe

  // 실제 측정값 4가지가 전부 통과해야만 "검증 완료" — 폰트/굵기를 바꾸는 조작만으로 무조건 성공하지 않는다.
  const cssVarExposed = cssVariableValue.length > 0
  const familyMatches = computedFontFamily.includes(font.primaryFamily)
  const isRangeFace = fontFaceWeightDescriptors.some((w) => w.trim().includes(' '))
  const isMatched = !isReady
    ? undefined
    : cssVarExposed && familyMatches && isRangeFace && isWeightAvailable && fontFaceRules.length > 0

  const expected =
    `• getComputedStyle().getPropertyValue('${font.variableName}')가 빈 문자열이 아님 (CSS 변수 실제 노출)\n` +
    `• document.styleSheets 안에 family가 "${font.primaryFamily}"를 포함하는 @font-face 규칙 존재\n` +
    `• 그 규칙의 font-weight 디스크립터가 단일 값이 아니라 범위(예: "${font.weightRange.min} ${font.weightRange.max}")\n` +
    `• getComputedStyle().fontWeight가 슬라이더 값(${weight})과 정확히 일치\n` +
    `• document.fonts.check('${weight} 16px "${font.primaryFamily}"')가 true`

  const actual = !isReady
    ? '• 폰트 로드 및 CSSOM 스캔 대기 중 (document.fonts.ready 완료 후 자동 측정)'
    : `• --font-* 변수 실측값: ${cssVariableValue || '(비어 있음)'}\n` +
      `• 발견된 @font-face 규칙: ${fontFaceRules.length}개 (font-weight: ${fontFaceWeightDescriptors.join(', ') || '(없음)'})\n` +
      `• computed font-family: ${computedFontFamily || '(없음)'}\n` +
      `• computed font-weight: ${computedFontWeight || '(없음)'}\n` +
      `• document.fonts.check 결과: ${isWeightAvailable}\n` +
      (hasInteracted ? '• 사용자가 굵기 슬라이더를 조작함' : '• 아직 슬라이더를 조작하지 않음 (초기 굵기 측정값)')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="next/font/google CSS 변수 & 가변 폰트 보간 실측 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="브라우저 CSSOM(document.styleSheets)과 getComputedStyle을 직접 읽어, next/font/google이 실제로 CSS 변수와 범위형 @font-face를 생성하고 슬라이더로 지정한 굵기가 그대로 렌더링에 반영됐는지 검증합니다."
      />

      {fontFaceRules.length > 0 && (
        <div className="rounded border border-zinc-200 bg-zinc-950 p-3 font-mono text-[10px] leading-relaxed text-zinc-300 dark:border-zinc-800 overflow-x-auto">
          <div className="mb-1 font-bold text-zinc-400">
            실제 CSSOM @font-face 규칙 (document.styleSheets에서 직접 읽음):
          </div>
          {fontFaceRules.map((rule, i) => (
            <div key={i} className="whitespace-pre-wrap break-all">
              {rule}
            </div>
          ))}
        </div>
      )}

      <DemoDeepDiveCard title="next/font/google 가변 폰트(Variable Font) & CSS 변수 토큰">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>next/font/google</code>은 구글 폰트를 빌드 타임에 다운로드해 자체 도메인에서 셀프호스팅합니다.
              가변 폰트를 <code>weight</code> 없이 호출하면(기본값 <code>&apos;variable&apos;</code>) Next.js가 Google Fonts 메타데이터에서
              이 폰트의 실제 wght 축 범위(<code>{font.weightRange.min}~{font.weightRange.max}</code>)를 읽어
              CSS Fonts Level 4의 <code>@font-face {'{'} font-weight: {font.weightRange.min} {font.weightRange.max}; {'}'}</code> 디스크립터를 자동 생성합니다.
              브라우저는 이 범위 안의 임의의 <code>font-weight</code> 값을 만나면 별도의 <code>font-variation-settings</code> 코드 없이도
              단일 <code>.woff2</code> 파일 안의 <code>wght</code> 축을 그 값으로 보간해 렌더링합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              위 검증 패널의 값은 하드코딩이 아니라, 미리보기 요소에 <code>{font.variableClassName}</code> 클래스를 실제로 적용한 뒤
              그 요소의 <code>getComputedStyle()</code>과 <code>document.styleSheets</code>를 직접 읽어 측정한 값입니다.
              슬라이더로 굵기를 바꾸면 같은 <code>{font.className}</code> 폰트 파일 하나로 렌더링되는 굵기만 바뀌고,
              네트워크 요청은 폰트를 최초 선택할 때 한 번만 발생합니다 (개발자 도구 Network 탭에서 굵기 변경 시 추가 요청이 없음을 확인할 수 있습니다).
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>파일 하나로 전체 굵기 범위 커버</strong>: 굵기별 정적 파일을 각각 받지 않고 하나의 가변 폰트 파일만 다운로드합니다.</li>
              <li><strong>외부 네트워크 요청 0건</strong>: 브라우저가 Google 서버로 요청을 보내지 않고 이 zone과 같은 도메인에서 서빙합니다.</li>
              <li><strong>CSS 변수로 디자인 토큰화</strong>: <code>variable</code> 옵션으로 만든 <code>--font-*</code> 변수를 Tailwind <code>fontFamily</code> 토큰에 바로 매핑할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>버튼 hover 시 400→600처럼 굵기를 미세하게 트랜지션하는 마이크로 인터랙션</li>
              <li>브랜드 룩앤필에 맞춰 헤딩마다 조금씩 다른 굵기를 쓰는 타이포그래피 시스템</li>
              <li>굵기별 파일을 여러 개 받는 대신 대역폭을 아껴야 하는 글로벌 서비스</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>next/font/google에는 weight 범위 문자열이 없음</strong>: <code>weight: &apos;100 900&apos;</code> 같은 범위 표기는 <code>next/font/local</code> 전용 문법이다. Google 가변 폰트는 <code>weight</code>를 생략(또는 <code>&apos;variable&apos;</code>)해야 전체 축 범위를 자동으로 받는다 — 공식 문서의 weight 설명이 두 로더를 함께 서술해 혼동하기 쉽다.</li>
              <li><strong>가변 폰트가 아니면 배열로 지정</strong>: 고정 굵기만 있는 Google 폰트는 <code>weight: [&apos;400&apos;,&apos;700&apos;]</code>처럼 실제 존재하는 굵기 값만 배열로 지정해야 한다.</li>
              <li><strong>모듈 최상위 스코프 선언 필수</strong>: <code>next/font</code> 인스턴스는 반드시 컴포넌트 함수 외부에서 선언해야 컴파일 타임 폰트 추출이 정상 작동합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
