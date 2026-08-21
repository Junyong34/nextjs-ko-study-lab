'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  const pathname = usePathname()
  const isLogin = pathname.includes('/login')

  const expectedText =
    '• 괄호 폴더 (shop), (auth)는 브라우저 URL 경로에서 완전히 생략되어 깨끗한 주소(/products, /login)가 유지됨\n• 서로 다른 폴더 그룹은 각자 독립된 layout.tsx를 적용하여 완전히 다른 화면 레이아웃을 제공함'

  const actualText = `• 현재 실제 라우트: "${pathname}"\n• Route Group 동작: ${
    isLogin
      ? 'app/(auth)/layout.tsx 독립 인증 레이아웃 적용 확인 (URL에 (auth) 생략됨)'
      : 'app/(shop)/layout.tsx 상점 레이아웃 적용 확인 (URL에 (shop) 생략됨)'
  }`

  return (
    <div className="space-y-4">
      {/* 3단. 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        title="Route Groups (folder) 및 다중 레이아웃 분리 검증"
        expected={expectedText}
        actual={actualText}
        isMatched={isLogin}
        description={
          isLogin
            ? '실제 Next.js 라우트가 /login으로 이동하면서 (auth) 레이아웃이 적용되고, URL에서 (auth)가 생략된 것을 확인했습니다.'
            : '상단의 [회원 로그인 페이지 (/login)] 링크를 눌러 독립 레이아웃 전환을 확인하세요.'
        }
      />

      {/* 4단. 최하단 개념 정리 카드 */}
      <DemoDeepDiveCard title="Route Groups (folder)의 URL 생략과 다중 루트 레이아웃 분리 원리">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              1. Route Groups `(folder)`의 핵심 규칙
            </h4>
            <p className="leading-relaxed">
              폴더 이름을 괄호로 감싸면(예: <code className="font-mono text-[11px]">(shop)</code>, <code className="font-mono text-[11px]">(auth)</code>) Next.js 파일 시스템 라우터는 <strong>해당 폴더명을 URL 경로에서 완전히 제외</strong>합니다.
            </p>
          </div>

          <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60 font-mono text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200">
            <div className="text-zinc-400 mb-1">// 파일 경로 vs 브라우저 URL 대조</div>
            <div>app/<span className="text-emerald-600 font-bold">(shop)</span>/products/page.tsx  -&gt;  <strong className="text-zinc-900 dark:text-zinc-100">/products</strong></div>
            <div>app/<span className="text-blue-600 font-bold">(auth)</span>/login/page.tsx        -&gt;  <strong className="text-zinc-900 dark:text-zinc-100">/login</strong></div>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              2. 언제 Route Groups를 사용하는가?
            </h4>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
              <li><strong className="text-zinc-800 dark:text-zinc-200">독립된 다중 레이아웃 분리:</strong> 메인 상점 페이지(GNB+사이드바)와 인증/결제 페이지(전체화면 심플 폼)의 레이아웃을 분리할 때.</li>
              <li><strong className="text-zinc-800 dark:text-zinc-200">코드베이스 구성 정리:</strong> URL 구조에 영향을 주지 않고 마케팅 페이지, 대시보드 페이지, 관리자 페이지 등으로 디렉토리를 체계적으로 나눌 때.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
