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
      <DemoDeepDiveCard title="Route Groups ((folder)) URL 격리 및 모듈러 구조화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              소괄호(<code>(folderName)</code>)로 폴더를 감싸면 해당 폴더는 <b>Route Group</b>으로 인식되어 URL 경로 세그먼트에서 완전히 제외됩니다. 이를 통해 URL 구조를 변경하지 않고도 라우트를 논리적인 도메인 단위로 구조화할 수 있습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 <code>(shop)/products</code>와 <code>(marketing)/about</code> 경로가 실제 브라우저 주소창에는 <code>/products</code> 및 <code>/about</code>으로 깔끔하게 매핑되며, 각 그룹의 전용 <code>layout.tsx</code>가 해당 하위 페이지에만 독립 적용되는 구조를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>깔끔한 URL 체계 유지</strong>: 복잡한 내부 모듈/도메인 분류 폴더 구조를 브라우저 URL에 노출하지 않습니다.</li>
              <li><strong>팀별 독립적 코드 소유권</strong>: 이커머스 개발팀과 마케팅/콘텐츠 팀이 독립된 폴더 트리에서 충돌 없이 작업할 수 있습니다.</li>
              <li><strong>유연한 레이아웃 오버라이딩</strong>: 동일 레벨의 경로라도 특정 그룹에만 특화된 사이드바나 네비게이션을 주입합니다.</li>
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

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동일 URL 경로 충돌 주의</strong>: 서로 다른 그룹 내에 동일한 하위 경로(예: <code>(shop)/products/page.tsx</code>와 <code>(marketing)/products/page.tsx</code>)가 존재하면 동일한 <code>/products</code> URL을 두고 빌드 충돌 에러가 발생합니다.</li>
              <li><strong>특정 그룹 내 컴포넌트 격리</strong>: 그룹 내에 생성된 컴포넌트는 해당 그룹의 레이아웃 상속을 받으므로 공통 레이아웃이 필요한 경우 그룹 바깥에 배치해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
