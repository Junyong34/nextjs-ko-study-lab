'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  const pathname = usePathname()

  const isShop = pathname.endsWith('/products')
  const isMarketing = pathname.endsWith('/about')
  const hasNavigated = isShop || isMarketing
  const containsParens = /[()]/.test(pathname)

  const expected =
    '• 디스크상 폴더: .../(shop)/products/page.tsx, .../(marketing)/about/page.tsx\n• usePathname()이 반환하는 문자열에는 (shop), (marketing) 괄호 폴더명이 절대 포함되지 않는다'

  const actual = hasNavigated
    ? `• usePathname(): "${pathname}"\n• 활성 그룹: ${isShop ? '(shop)/products/page.tsx' : '(marketing)/about/page.tsx'}\n• 괄호 문자 포함 여부: ${containsParens ? '포함 (오류)' : '없음 (정상)'}`
    : `• usePathname(): "${pathname}"\n• 아직 (shop) 또는 (marketing) 그룹의 하위 페이지로 이동하지 않았습니다. 실습 화면의 이동 버튼을 눌러주세요.`

  const isMatched = hasNavigated ? !containsParens : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Route Groups ((folder)) URL 격리 검증 결과"
        expected={<>{expected}</>}
        actual={<>{actual}</>}
        isMatched={isMatched}
        description="usePathname()으로 실제 브라우저 경로를 읽어, 폴더명에 있는 (shop)/(marketing) 괄호 문자열이 URL에 노출되는지 직접 검사합니다."
      />
      <DemoDeepDiveCard title="Route Groups ((folder)) — URL에 영향 없는 폴더 구조화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              소괄호(<code>(folderName)</code>)로 감싼 폴더는 <b>Route Group</b>으로 인식되어 라우트의 URL 경로 세그먼트에서 완전히 제외된다. <code>app/(shop)/products/page.tsx</code>는 <code>/shop/products</code>가 아니라 <code>/products</code>로 요청된다 — 폴더 depth와 URL depth가 일치하지 않는 유일한 파일 컨벤션이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              이 데모의 <code>(shop)/products</code>와 <code>(marketing)/about</code>은 각자 다른 <code>layout.tsx</code> 아래 중첩돼 있지만, 그 layout.tsx들은 이 실습 페이지가 공유하는 공통 루트 레이아웃 하위의 <b>일반 중첩 layout.tsx</b>일 뿐이다. 즉 이 데모가 보여주는 것은 &ldquo;폴더명이 URL에서 사라진다&rdquo;는 사실 하나이며, <code>html</code>/<code>body</code>를 통째로 분리하는 다중 루트 레이아웃 구성은 별도 주제다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>깔끔한 URL 유지</strong>: 내부 폴더를 팀·도메인 단위로 세분화해도 학습자·사용자가 보는 URL은 짧고 단순하게 유지된다.</li>
              <li><strong>팀별 독립적 코드 소유권</strong>: 이커머스팀은 <code>(shop)</code>, 마케팅팀은 <code>(marketing)</code> 폴더 안에서 서로 다른 파일 트리를 운영하되 URL 충돌 없이 공존한다.</li>
              <li><strong>선택적 레이아웃 적용</strong>: 특정 그룹의 경로에만 별도 <code>layout.tsx</code>를 적용하고, 그룹 밖의 경로는 상위 레이아웃을 그대로 물려받는다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>로그인/회원가입처럼 헤더·푸터가 없는 페이지만 별도 <code>layout.tsx</code>로 묶고 싶을 때 (<code>(auth)</code>)</li>
              <li>URL 구조는 그대로 둔 채, 코드 소유권만 팀·기능 단위 폴더로 재배치하고 싶을 때</li>
              <li>같은 뎁스의 여러 페이지 중 일부에만 특정 레이아웃을 선택적으로 적용하고 싶을 때</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>동일 URL 경로 충돌 주의</strong>: 서로 다른 그룹 내에 동일한 하위 경로(예: <code>(shop)/about/page.tsx</code>와 <code>(marketing)/about/page.tsx</code>)가 존재하면 둘 다 <code>/about</code>으로 해석되어 빌드 에러가 발생한다.</li>
              <li><strong>다중 루트 레이아웃과는 별개</strong>: 여러 <code>(group)</code>이 각자 <code>html</code>/<code>body</code>를 선언하는 &ldquo;다중 루트 레이아웃&rdquo; 구성을 쓰면 그룹 전환 시 전체 페이지 새로고침이 발생한다 — 이 데모는 그 경우에 해당하지 않는다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
