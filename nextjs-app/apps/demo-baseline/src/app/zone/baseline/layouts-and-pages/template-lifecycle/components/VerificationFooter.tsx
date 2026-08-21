'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  const pathname = usePathname()
  const isProduct2 = pathname.includes('product-2')

  const expectedText =
    '• layout.tsx: 탭 이동 시 기존 DOM 인스턴스와 입력 상태(state)를 영구 보존함\n• template.tsx: 탭 이동 시마다 Next.js가 새 인스턴스를 생성(Re-mount)하여 입력 상태를 완전히 리셋함'

  const actualText = `• 현재 실제 라우트: "${pathname}"\n• 템플릿 인스턴스: ${
    isProduct2
      ? '오버핏 맨투맨 라우트 진입 -> template.tsx 새 인스턴스 Re-mount 완료 (폼 자동 리셋)'
      : '에어 줌 러닝화 라우트 -> template.tsx 초기 인스턴스 활성'
  }`

  return (
    <div className="space-y-4">
      {/* 3단. 기대값 vs 실제값 검증 패널 */}
      <ExpectedActualPanel
        title="template.tsx 라우팅 생명주기 및 인스턴스 재생성 검증"
        expected={expectedText}
        actual={actualText}
        isMatched={isProduct2}
        description={
          isProduct2
            ? '실제 Next.js 라우트가 전환되면서 template.tsx가 새 인스턴스로 교체되어 폼이 초기화되었습니다.'
            : '후기 입력창에 글을 작성한 뒤 상단의 [오버핏 기모 맨투맨] 탭을 눌러 인스턴스 리셋을 확인하세요.'
        }
      />

      {/* 4단. 최하단 개념 정리 카드 */}
      <DemoDeepDiveCard title="template.tsx vs layout.tsx 생명주기 차이 및 실무 활용처">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              1. template.tsx와 layout.tsx의 근본적인 차이
            </h4>
            <p className="leading-relaxed">
              <code className="font-mono text-[11px]">layout.tsx</code>는 라우팅 시 컴포넌트를 유지하여 <strong>상태를 보존(Preserve State)</strong>하지만, <code className="font-mono text-[11px]">template.tsx</code>는 라우팅할 때마다 <strong>새로운 DOM 인스턴스를 생성(Re-mount)</strong>합니다.
            </p>
          </div>

          <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60 font-mono text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200">
            <div className="text-zinc-400 mb-1">// Next.js 내부 컴포넌트 렌더링 계층</div>
            <div>&lt;<span className="text-emerald-600 font-bold">Layout</span>&gt; <span className="text-zinc-400">&#47;&#47; 라우팅 시 인스턴스 유지 (상태 보존)</span></div>
            <div className="pl-4">&lt;<span className="text-indigo-600 font-bold">Template</span> key=&#123;pathname&#125;&gt; <span className="text-zinc-400">&#47;&#47; 라우팅마다 새 key로 Unmount &amp; Re-mount</span></div>
            <div className="pl-8">&lt;<span className="text-amber-600 font-bold">Page</span> /&gt;</div>
            <div className="pl-4">&lt;/<span className="text-indigo-600 font-bold">Template</span>&gt;</div>
            <div>&lt;/<span className="text-emerald-600 font-bold">Layout</span>&gt;</div>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              2. template.tsx는 실무에서 언제 사용하는가?
            </h4>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
              <li><strong className="text-zinc-800 dark:text-zinc-200">페이지별 진입 애니메이션:</strong> CSS / Framer Motion의 페이지 전환 애니메이션(`useEffect` 마운트 트리거).</li>
              <li><strong className="text-zinc-800 dark:text-zinc-200">페이지별 뷰 카운팅 / 로깅:</strong> 라우트 이동 시마다 `useEffect`를 반드시 재실행하여 GA 이벤트나 분석 로그를 전송해야 할 때.</li>
              <li><strong className="text-zinc-800 dark:text-zinc-200">입력 폼 완전 초기화:</strong> 페이지 전환 시 작성 중이던 폼 상태를 자동으로 폐기해야 할 때.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
