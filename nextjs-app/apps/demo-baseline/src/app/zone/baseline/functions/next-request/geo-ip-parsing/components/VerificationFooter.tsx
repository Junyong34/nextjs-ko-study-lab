'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { GeoStatus } from '../types'

interface VerificationFooterProps {
  status: GeoStatus
}

export function VerificationFooter({ status }: VerificationFooterProps) {
  const { country, ip, currency, hasFetched } = status

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="request.headers 기반 Geo/IP 파싱 검증"
        expected={
          '• 프리셋을 고르면 브라우저가 x-vercel-ip-country 등 헤더를 실제로 실어 보낸다\n' +
          '• route.ts는 request.headers.get()으로 그 값을 그대로 읽어 통화를 결정한다\n' +
          '• "헤더 없음"을 고르면 country/ip 모두 (없음)으로 표시돼야 한다 — 로컬 dev 환경의 실제 동작'
        }
        actual={
          hasFetched
            ? country
              ? `• country: ${country}, ip: ${ip} -> currency: ${currency}\n• 서버가 실제로 받은 헤더 값을 그대로 파싱해 현지화에 반영함`
              : `• country: (없음), ip: ${ip ?? '(없음)'}\n• 추가 헤더 없이 보낸 요청 — 로컬 dev에는 Vercel Geo 헤더가 없어 정상적으로 비어 있음`
            : '• 실습 화면에서 버튼을 눌러 요청을 보내면 결과가 표시됩니다.'
        }
        isMatched={hasFetched}
        description="isMatched는 '검증 조건을 만족했는가'가 아니라 '요청을 보내고 응답을 실제로 받았는가'를 뜻한다. 헤더가 없는 상태의 빈 값도 여기서는 정상 결과다."
      />
      <DemoDeepDiveCard title="NextRequest에는 더 이상 geo/ip가 없다 — 지금은 헤더를 직접 읽는다">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 변경 — v15.0.0에서 geo/ip 제거</h5>
            <p>
              <code>NextRequest</code>의 <code>geo</code>, <code>ip</code> 속성은 Next.js{' '}
              <strong>v15.0.0에서 완전히 삭제됐다</strong>(공식 마이그레이션 코드모드: <code>next-request-geo-ip</code>). 이 값들을 Next.js가 직접 계산한 적은 없었다 — 애초에 호스팅
              플랫폼이 엣지 프록시에서 요청에 주입한 HTTP 헤더를 Next.js가 편의상 속성으로 노출해줬을 뿐이다. 이 프로젝트의 기준 버전(Next.js 16.3.2)에서{' '}
              <code>(request as any).geo</code>처럼 타입을 우회해 접근해도 항상 <code>undefined</code>다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 지금의 공식 방법 — request.headers로 직접 읽기</h5>
            <p>
              Vercel에 배포하면 엣지 프록시가 <code>x-vercel-ip-country</code>, <code>x-vercel-ip-city</code>,{' '}
              <code>x-vercel-ip-country-region</code>, <code>x-real-ip</code> 같은 헤더를 요청에 직접 주입한다. 공식 헬퍼 패키지{' '}
              <code>@vercel/functions</code>의 <code>geolocation()</code>/<code>ipAddress()</code>도 내부적으로 이 헤더들을 읽을 뿐이라, <code>request.headers.get(&apos;x-vercel-ip-country&apos;)</code>처럼 직접 읽어도 동일한 값을 얻는다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 이 데모가 실제로 하는 일</h5>
            <p>
              위 프리셋 버튼은 값을 지어내 화면에 꽂아 넣지 않는다 — 클릭하면 브라우저 <code>fetch()</code>가 그 헤더를 <strong>실제 HTTP 요청</strong>에 실어 보내고,
              서버의 route.ts는 <code>request.headers.get()</code>으로 받은 값을 그대로 읽는다. &quot;헤더 없음&quot; 상태에서 country/ip가 비는 것도 버그가 아니라, 로컬
              dev 환경에는 이 헤더를 주입해줄 엣지 프록시가 없다는 사실을 있는 그대로 보여주는 것이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 활용 상황</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>접속 국가별 통화·배송 정책 자동 분기 (이 데모의 시나리오)</li>
              <li>특정 국가/지역 대상 접속 차단(Geo-blocking) 및 라이선스 지역 제한</li>
              <li>요청 로그에 신뢰 가능한 클라이언트 IP를 남기는 레이트 리밋/감사 로깅</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 주의사항 — 로컬 재현과 스푸핑</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                로컬 dev에서 서버 쪽만 재현하려면 curl로 직접 헤더를 주입하면 된다:
                <code className="mt-1 block rounded bg-zinc-100 p-2 font-mono text-[10px] dark:bg-zinc-900">
                  curl &quot;http://localhost:3054/zone/baseline/functions/next-request/geo-ip-parsing/api&quot; \<br />
                  {'  '}-H &quot;x-vercel-ip-country: KR&quot; -H &quot;x-vercel-ip-city: Seoul&quot; -H &quot;x-real-ip: 203.0.113.10&quot;
                </code>
              </li>
              <li>
                <strong>클라이언트가 헤더를 보낸다고 해서 배포 환경에서도 신뢰된다는 뜻이 아니다.</strong> 실제 Vercel 배포에서는 엣지 프록시가 <code>x-real-ip</code> 등을 자체
                계산해 주입·치환하므로, 이 데모처럼 브라우저에서 값을 실어 보내도 프로덕션에서는 프록시가 계산한 값으로 덮인다. 이것이 <code>@vercel/functions</code>가 &quot;non-spoofable&quot;이라고 부르는 이유다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
