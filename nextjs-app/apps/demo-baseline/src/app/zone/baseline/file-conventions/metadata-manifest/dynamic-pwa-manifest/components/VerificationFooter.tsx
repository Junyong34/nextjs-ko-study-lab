'use client'
import React from 'react'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
import { MANIFEST_ENDPOINT, resolveThemePreset } from '../theme-presets'
import type { ManifestFetchResult } from '../types'

export interface VerificationFooterProps {
  /** 실습 화면에서 마지막으로 고른(=쿠키에 저장 요청한) 프리셋 id */
  selectedPresetId: string
  /** 실제 GET /manifest.webmanifest 응답을 fetch한 결과. 아직 없으면 null */
  fetchResult: ManifestFetchResult | null
  hasFetched: boolean
  isFetching: boolean
}

export function VerificationFooter({
  selectedPresetId,
  fetchResult,
  hasFetched,
  isFetching,
}: VerificationFooterProps) {
  const selectedPreset = resolveThemePreset(selectedPresetId)
  const actualThemeColor = fetchResult?.manifest?.theme_color ?? null
  const actualBackgroundColor = fetchResult?.manifest?.background_color ?? null
  const statusOk = fetchResult?.status === 200
  const themeColorMatches = actualThemeColor === selectedPreset.themeColor
  const isMatched = statusOk && themeColorMatches

  const expected =
    `• GET ${MANIFEST_ENDPOINT} → 200 · Content-Type: application/manifest+json\n` +
    `• theme_color: "${selectedPreset.themeColor}" (${selectedPreset.label} 프리셋, 쿠키에 저장 요청한 값)\n` +
    `• background_color: "${selectedPreset.backgroundColor}"`

  const actual = fetchResult
    ? `• 상태: ${fetchResult.status ?? '요청 실패'} · Content-Type: ${fetchResult.contentType ?? '(없음)'}\n` +
      `• theme_color: ${actualThemeColor ? `"${actualThemeColor}"` : '(파싱 실패 또는 없음)'}\n` +
      `• background_color: ${actualBackgroundColor ? `"${actualBackgroundColor}"` : '(파싱 실패 또는 없음)'}\n` +
      `• fetch 시각: ${fetchResult.fetchedAt}`
    : ''

  return (
    <div className="space-y-4">
      {hasFetched && fetchResult ? (
        <ExpectedActualPanel
          title="manifest.ts 프리셋 → 실제 manifest.webmanifest 응답 대조"
          expected={expected}
          actual={actual}
          isMatched={isMatched}
          description={
            isFetching
              ? '재요청 중입니다...'
              : isMatched
                ? '고른 테마 프리셋과 실제 서버 응답의 theme_color/background_color가 일치합니다. cookies()로 저장한 값이 다음 요청에서 그대로 반영됐습니다.'
                : '고른 프리셋과 마지막으로 받아온 응답이 다릅니다. 프리셋을 바꾼 뒤 [manifest.webmanifest 다시 요청]을 눌러 실제 응답을 다시 확인하세요 — 쿠키를 저장한다고 화면이 자동으로 갱신되지는 않습니다.'
          }
        />
      ) : (
        <ExpectedActualPanel
          title="manifest.ts 프리셋 → 실제 manifest.webmanifest 응답 대조"
          expected={expected}
          actual="대기 중: 아직 실제 응답을 받아오지 못했습니다."
          description="테마 프리셋을 고르고 실제 요청을 보내면, 서버가 쿠키를 읽어 계산한 진짜 JSON이 여기에 표시됩니다."
        />
      )}

      <DemoDeepDiveCard title="manifest.ts 파일 컨벤션과 request-time API">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. manifest.ts는 app 루트 전용 파일 컨벤션이다</h5>
            <p>
              Next.js는 <code>manifest.(js|ts)</code>를 <code>app</code> 디렉터리 <strong>루트</strong>에 있을 때만
              <code>/manifest.webmanifest</code> 특수 라우트로 인식한다. 이 데모 폴더처럼 중첩 세그먼트에 같은 이름의
              파일을 두면 라우팅되지 않는다 — Next.js 소스(
              <code>node_modules/next/dist/lib/metadata/is-metadata-route.js</code>)의 매니페스트 정규식이 경로 시작
              위치에 고정돼 있고, 이 저장소에서 <code>next dev</code>로 직접 요청해 404를 실측했다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 그래서 이 데모가 실제로 서빙하는 방법</h5>
            <p>
              같은 폴더의 <code>manifest.webmanifest/route.ts</code>(진짜 Route Handler 파일 컨벤션)가 위 <code>manifest.ts</code>의
              default export 함수를 그대로 <code>import</code>해 호출한다. 검증 패널의 값을 다시 계산하거나 흉내 내지
              않고, 실제 라우트 응답을 <code>fetch</code>한 결과를 그대로 보여준다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. request-time API가 캐시를 끈다</h5>
            <p>
              공식 문서는 &quot;manifest.js는 request-time API나 dynamic 설정을 쓰지 않는 한 기본적으로 캐시되는 특수
              Route Handler&quot;라고 안내한다. 이 데모의 <code>manifest()</code> 함수는 내부에서 <code>cookies()</code>를
              호출하므로, 매 요청마다 쿠키를 다시 읽어 <code>theme_color</code>/<code>background_color</code>를
              재계산한다 — <code>force-dynamic</code> 같은 별도 옵션 없이도 request-time API 사용만으로 다이나믹하게 동작한다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>실제 서비스에서는 이 파일을 그대로 <code>app/manifest.ts</code>로 옮기면 된다(시그니처가 동일하다).</li>
              <li><code>public/manifest.json</code> 같은 정적 파일과 <code>app/manifest.ts</code>를 루트에 동시에 두면 충돌하므로 하나만 남긴다.</li>
              <li>이 페이지의 Metadata API <code>manifest</code> 필드(<code>page.tsx</code>)가 <code>&lt;link rel=&quot;manifest&quot;&gt;</code>를 이 페이지의 head에 실제로 주입한다 — 브라우저 개발자 도구의 Elements 탭에서 확인할 수 있다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
