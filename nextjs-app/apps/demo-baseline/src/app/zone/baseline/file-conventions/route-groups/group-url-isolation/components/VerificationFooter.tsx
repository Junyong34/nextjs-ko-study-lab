'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

interface VerificationFooterProps {
  currentGroup?: 'shop' | 'marketing'
  currentPath?: string
}

export function VerificationFooter({
  currentGroup,
  currentPath,
}: VerificationFooterProps) {
  const isMatched = Boolean(currentPath && !currentPath.includes('(') && !currentPath.includes(')'))

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Route Groups ((folder)) URL 격리 실증 검증"
        expected="• (shop) 및 (marketing) 폴더 컨벤션이 URL 경로에서 완전 제외\n• 브라우저 주소는 /products 및 /about으로 노출되며 각자 독립된 layout.tsx 적용"
        actual={
          currentGroup
            ? `• [그룹 활성: (${currentGroup})] 요청 URL: "${currentPath}" (괄호 폴더명 미노출)\n• 전용 (${currentGroup})/layout.tsx 레이아웃 마운트 확인 완료`
            : '• Route Group 메인 인덱스 대기 상태'
        }
        isMatched={isMatched}
        description="Next.js App Router의 Route Groups ((folderName)) 컨벤션을 통해 URL 변경 없이 레이아웃을 계층별로 독립 격리하는 동작을 검증합니다."
      />
      <DemoDeepDiveCard title="Route Groups ((folder)) URL 격리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              소괄호(<code>(folderName)</code>)로 폴더를 감싸면 해당 폴더는 <b>Route Group</b>으로 인식되어 URL 경로 세그먼트에 포함되지 않습니다.
              이를 통해 라우트 구조를 논리적인 도메인 단위로 정리하거나 복수의 루트 레이아웃을 구성할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 레이아웃 독립 분리</h5>
            <p>
              <code>(shop)/layout.tsx</code>와 <code>(marketing)/layout.tsx</code>처럼 각 그룹마다 서로 다른 <code>layout.tsx</code>를 정의하면,
              하위 페이지들이 각자의 전용 GNB, 사이드바, 푸터를 독립적으로 상속받아 렌더링됩니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>깔끔한 URL 유지: 복잡한 내부 폴더 계층을 감추고 사용자에게 최적화된 URL 제공</li>
              <li>다중 레이아웃 공존: 동일한 레벨의 경로(e.g., <code>/checkout</code>, <code>/dashboard</code>)에 상이한 레이아웃 적용</li>
              <li>팀별 독립 코드 관리: 스토어프론트 팀과 마케팅 팀이 독립된 폴더 트리에서 작업 가능</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>로그인/회원가입 등 헤더/푸터가 없는 인증 전용 레이아웃 (<code>(auth)</code>)</li>
              <li>관리자 대시보드와 사용자 쇼핑몰의 루트 레이아웃 분리 (<code>(admin)</code> vs <code>(shop)</code>)</li>
              <li>마케팅 랜딩 페이지와 웹 애플리케이션 화면 분리 (<code>(marketing)</code> vs <code>(app)</code>)</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
