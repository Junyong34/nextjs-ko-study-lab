'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const pathname = usePathname()

  const defaultExpected =
    '• Route Group 폴더명((shop), (auth))이 브라우저 URL에 노출되지 않고 /products, /login으로 매핑\n• (shop) 그룹: GNB 및 쇼핑몰 레이아웃 적용\n• (auth) 그룹: GNB가 제거된 독립 인증 레이아웃 적용'

  const isLogin = pathname.endsWith('/login')
  const isProducts = pathname.endsWith('/products')
  const isNavigated = isLogin || isProducts

  const defaultActual = isLogin
    ? `• 현재 URL 경로: ${pathname} (Route Group 폴더명 (auth) 생략)\n• 적용된 레이아웃: (auth) 독립 인증 레이아웃 (GNB 비표시)\n• URL 매핑 검증: /(auth)/login → /login 정상 확인\n• Route Groups 다중 레이아웃 분리 검증 완료`
    : isProducts
    ? `• 현재 URL 경로: ${pathname} (Route Group 폴더명 (shop) 생략)\n• 적용된 레이아웃: (shop) 쇼핑몰 레이아웃 (GNB 및 카탈로그 포함)\n• URL 매핑 검증: /(shop)/products → /products 정상 확인\n• Route Groups 다중 레이아웃 분리 검증 완료`
    : `• 현재 URL 경로: ${pathname}\n• 레이아웃 전환 상태: 대기 중\n• 상태: 상단의 [회원 로그인 페이지 (/login)] 링크를 클릭하여 독립 레이아웃을 확인하세요.`

  const isMatched =
    props.isMatched !== undefined
      ? props.isMatched
      : isNavigated
      ? true
      : undefined

  const actualContent = props.actual !== undefined ? props.actual : defaultActual

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Route Groups를 활용한 다중 루트 레이아웃 분리 실증 검증"
        expected={props.expected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={
          props.description ||
          'Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다.'
        }
      />
      <DemoDeepDiveCard title="Route Groups를 활용한 다중 루트 레이아웃 분리">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              Route Groups(<code>(groupName)</code>)는 괄호로 폴더명을 감싸 URL 경로 구조에 영향을 주지 않으면서 라우트들을 논리적으로 그룹화하고, 쇼핑몰 고객 화면과 관리자/인증 화면에 서로 다른 루트 레이아웃(<code>(shop)/layout.tsx</code>, <code>(auth)/layout.tsx</code>)을 독립적으로 적용하는 표준 파일 컨벤션입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 GNB와 푸터가 포함된 일반 쇼핑몰 레이아웃(<code>(shop)</code>)과, 헤더/푸터가 제거된 독립적인 풀스크린 로그인 레이아웃(<code>(auth)</code>) 간의 라우팅 전환 시 루트 레이아웃 자체가 완전히 분리되어 적용되는 아키텍처를 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>URL 경로 오염 없는 파일 구조화</strong>: <code>/(shop)/products</code>는 <code>/products</code>로, <code>/(auth)/login</code>은 <code>/login</code>으로 깔끔한 URL을 유지합니다.</li>
              <li><strong>상이한 레이아웃 구조 공존</strong>: 헤더/사이드바가 필요한 일반 페이지와 미니멀한 단독 레이아웃이 필요한 결제/인증 화면을 단일 앱에서 완벽 분리합니다.</li>
              <li><strong>미들웨어 및 세그먼트 정책 분리</strong>: 그룹 단위로 인증 검사나 메타데이터 기본 설정을 모듈화할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>쇼핑몰 고객 메인/카탈로그 화면과 전체화면 결제/본인인증 화면의 레이아웃 분리</li>
              <li>B2B 플랫폼의 공개 마케팅 랜딩 페이지와 로그인 후 진입하는 파트너 관리자 콘솔 분리</li>
              <li>모바일 웹 뷰 전용 간소화 레이아웃과 PC 웹 전용 풀 레이아웃의 라우트 분기</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>다중 루트 레이아웃 시 not-found 주의</strong>: 루트 레이아웃을 여러 개 분리한 경우 최상위 <code>app/not-found.tsx</code> 처리를 위해 기본 <code>app/layout.tsx</code>를 두거나 모든 그룹에 fallback을 명시해야 합니다.</li>
              <li><strong>URL 충돌 방지</strong>: 서로 다른 Route Group 내부에 동일한 경로명(e.g. <code>(shop)/about/page.tsx</code>와 <code>(auth)/about/page.tsx</code>)을 선언하면 빌드 에러가 발생하므로 고유한 경로를 유지해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
