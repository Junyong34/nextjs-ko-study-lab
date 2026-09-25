'use client'

import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import { SCENARIOS } from '../constants'
import type { ComparisonResult, ComparisonResults } from '../types'

const EXPECTED = [
  '• 정상 조회: BFF 본문 크기 < 원본, 값 개수 < 원본, BFF 중첩 깊이 1(평탄), 민감 필드 원본 ≥1곳 → BFF 0곳',
  '• 없는 상품: 원본은 HTTP 200 + 내부 정보, BFF는 404 + { error }만',
  '• 형식 오류: BFF는 400 + { error }만, 레거시 호출 안 함',
].join('\n')

const isErrorOnly = (r: ComparisonResult) =>
  r.bff.topLevelKeys.length === 1 && r.bff.topLevelKeys[0] === 'error' && r.bff.sensitivePaths.length === 0

function evaluate(results: ComparisonResults): { isMatched: boolean | undefined; actual: string } {
  const lines: string[] = []
  const checks: boolean[] = []
  const ran = { product: false, 'not-found': false, invalid: false }

  for (const s of SCENARIOS) {
    const r = results[s.id]
    if (!r) continue
    ran[s.kind] = true
    const { legacy, bff } = r
    if (s.kind === 'product') {
      checks.push(
        legacy.status === 200 && bff.status === 200,
        bff.decodedBodySize > 0 && bff.decodedBodySize < legacy.decodedBodySize,
        bff.leafCount < legacy.leafCount,
        bff.maxDepth === 1,
        legacy.sensitivePaths.length > 0 && bff.sensitivePaths.length === 0,
      )
      lines.push(
        `• ${s.id}: ${legacy.decodedBodySize.toLocaleString()} B → ${bff.decodedBodySize.toLocaleString()} B, 값 ${legacy.leafCount} → ${bff.leafCount}, 깊이 ${legacy.maxDepth} → ${bff.maxDepth}, 민감 ${legacy.sensitivePaths.length} → ${bff.sensitivePaths.length}곳`,
      )
    } else {
      const expectedStatus = s.kind === 'not-found' ? 404 : 400
      const expectedCall = s.kind === 'not-found'
      checks.push(
        legacy.status === 200 && legacy.sensitivePaths.length > 0,
        bff.status === expectedStatus,
        isErrorOnly(r),
        bff.legacyCalled === expectedCall,
      )
      lines.push(
        `• ${s.id}: 원본 HTTP ${legacy.status}(민감 ${legacy.sensitivePaths.length}곳) → BFF HTTP ${bff.status}, 키 [${bff.topLevelKeys.join(', ')}], 레거시 ${bff.legacyCalled ? '호출함' : '호출 안 함'}`,
      )
    }
  }

  if (lines.length === 0) {
    return { isMatched: undefined, actual: '• 아직 실행하지 않았습니다. 정상 상품 1개와 오류 2개를 눌러 주세요.' }
  }
  if (checks.includes(false)) return { isMatched: false, actual: lines.join('\n') }
  const allRun = ran.product && ran['not-found'] && ran.invalid
  if (!allRun) lines.push('• 정상 조회 1건과 오류 2건을 모두 실행하면 최종 판정합니다.')
  return { isMatched: allRun ? true : undefined, actual: lines.join('\n') }
}

export function VerificationFooter({ results }: { results: ComparisonResults }) {
  const { isMatched, actual } = evaluate(results)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="응답 가공: 크기·필드·민감 정보·오류 형식"
        expected={<span>{EXPECTED}</span>}
        actual={<span>{actual}</span>}
        isMatched={isMatched}
        description="크기는 브라우저 Resource Timing(decodedBodySize), 값 개수·깊이·민감 필드는 받은 응답 JSON을 브라우저에서 재귀 순회해 센 값입니다. 레거시 호출 여부는 BFF가 보낸 Server-Timing 헤더로 판단합니다."
      />
      <DemoDeepDiveCard title="Route Handler로 하나의 응답을 화면에 맞게 가공하기 (BFF)">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 개념</h5>
            <p>
              가이드의 &quot;데이터 조작&quot; 절: Route Handler는 데이터를 변환·<strong>필터링</strong>해 로직을 프런트엔드 밖에
              두고 내부 시스템을 노출하지 않으며, 무거운 처리를 서버로 옮겨 클라이언트의 배터리·데이터 사용량을 줄인다.
              보안 절의 &quot;응답에서 민감하거나 불필요한 데이터를 제거한다&quot;도 같은 작업이다. 여러 API를 합치는 취합은 형제 실습
              (order-aggregation)이 다루고, 여기서는 응답 <strong>하나</strong>를 줄이고 다듬는 데 집중한다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모의 파일 구조</h5>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-2.5 font-mono text-[11px] dark:bg-zinc-900">{`response-shaping/
├─ _lib/legacy-product.ts  # 레거시 본체 함수 (private folder, 서버에서만 import)
├─ legacy/route.ts         # 원본 봉투를 그대로 내보내는 대조군 경로
├─ shaping.ts              # FIELD_RULES: 가공 필드 ← 원본 경로 + 변환 (화면 매핑 표도 이 배열)
└─ bff/route.ts            # 검증 → 레거시 함수 직접 호출 → 봉투 해석 → shapeForMobile()`}</pre>
            <p className="mt-1.5">
              BFF는 <code>legacy/route.ts</code>를 다시 <code>fetch</code>하지 않고 같은 함수를 직접 호출한다. 서버의 fetch는 절대
              URL(배포 도메인)이 필요하고 HTTP 왕복이 하나 더 생기기 때문이다(가이드 Caveats). 실제 레거시가 다른 서버라면 이 함수가
              내부 URL로 fetch하게 되고, 그 주소와 토큰은 서버 코드에만 남는다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 가공 단계와 측정값 읽는 법</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li><strong>선택(allowlist)</strong>: 필요한 키만 골라 담는다. 원본에 새 내부 필드가 추가돼도 규칙에 없으면 나가지 않는다. 반대로 <code>delete raw.COST_PRC</code> 식의 제외 목록은 새 필드를 놓치기 쉽다.</li>
              <li><strong>평탄화·이름 변환</strong>: <code>DATA.PRICE_INFO.SALE_PRC</code> → <code>price</code>. 중첩 깊이가 1이 되어 클라이언트가 경로를 몰라도 된다.</li>
              <li><strong>파생값</strong>: 할인율·평점 반올림·재고 상태 라벨을 서버에서 계산하고, 재고 수량 원본은 보내지 않는다.</li>
              <li><strong>본문 크기 vs 선로 위 크기</strong>: 응답에 <code>Content-Encoding</code>(gzip 등)이 붙는 환경이면 encodedBodySize가 decodedBodySize보다 작아지고, 붙지 않으면 둘이 같다. 압축은 선로 위 바이트만 줄일 뿐, 브라우저가 파싱·보관하는 크기(decoded)와 노출되는 정보는 그대로라서 가공을 대신하지 못한다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>입력은 다른 시스템에 넘기기 전에 검증한다. 형식 오류는 400으로 끝내 레거시(DB)까지 가지 않게 한다.</li>
              <li>레거시의 &quot;HTTP 200 + 오류 코드&quot;는 표준 상태(404, 502)로 바꾸고, 서버 노드·스택은 응답이 아닌 서버 로그에만 남긴다.</li>
              <li>응답 헤더도 클라이언트에 보인다. 이 데모의 <code>Server-Timing</code>처럼 학습용 측정값 외에 내부 정보를 헤더로 흘리지 않는다.</li>
              <li>ID처럼 민감하지 않은 값은 GET 쿼리로 충분하지만, 위치·개인정보는 URL이 캐시·로그에 남으므로 POST 본문을 쓴다.</li>
              <li>Server Component 화면이라면 이 Route Handler를 부르지 말고 데이터 소스를 직접 호출해 같은 가공 함수를 쓴다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
