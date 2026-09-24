import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const list = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'
const pre = 'overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="revalidate = N 세그먼트의 stale-while-revalidate 수명 주기">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 핵심: 기다리게 하지 않고, 한 박자 늦게 새로 만든다</h5>
          <p>
            Cache Components를 켜지 않은 앱(이 데모 zone)에서 런타임 API를 쓰지 않는 page는 <code>next build</code> 때
            렌더링되어 저장됩니다. 여기에 <code>export const revalidate = 10</code>을 두면 저장된 결과에 &quot;10초 뒤
            낡음&quot;이라는 수명이 붙습니다. 낡은 뒤 들어온 첫 요청도 새 결과를 기다리지 않고 옛 결과를 곧바로 받으며(STALE),
            서버는 그 요청을 계기로 백그라운드에서 page를 다시 렌더링해 저장합니다. 10초마다 저절로 갱신되는 것이 아니라,
            <strong> 낡은 뒤 요청이 와야</strong> 재생성이 시작된다는 점이 핵심입니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>2. 시간축으로 본 흐름 (revalidate = 10)</h5>
          <pre className={pre}>
{`t=0      next build: 렌더 ID A 저장
t<10s    요청 → HIT     A   (저장본 그대로)
t=12s    요청 → STALE   A   (옛 결과 즉시 응답 + 백그라운드 재렌더 시작)
                              └ 재렌더 완료: 렌더 ID B 저장 (t≈12s)
                              └ 완료 전에 온 요청도 STALE A
t=14s    요청 → HIT     B   (여기서 처음 새 결과)
t>22s    첫 요청 → STALE B → 그 다음 요청부터 C ...`}
          </pre>
          <pre className={`${pre} mt-1.5`}>
{`segment-revalidate/
├─ layout.tsx          # 4단 레이아웃. revalidate 선언 없음
├─ isr-10s/page.tsx    # export const revalidate = 10
└─ static/page.tsx     # 선언 없음(기본 false) → 대조군`}
          </pre>
        </div>
        <div>
          <h5 className={h5}>3. 실측 근거 읽는 법</h5>
          <ul className={list}>
            <li>
              <strong>x-nextjs-cache</strong>: 저장본을 그대로 줬으면 HIT, 수명이 지난 저장본을 주면서 재생성을 시작했으면
              STALE입니다. 저장본이 아예 없을 때는 MISS가 나올 수 있습니다.
            </li>
            <li>
              <strong>cache-control</strong>: <code>s-maxage=10</code>으로 CDN 같은 공유 캐시에도 같은 수명을 알리고,{' '}
              <code>stale-while-revalidate=31535990</code>(1년 - 10초)로 수명이 지나도 옛 응답을 쓰며 재검증해도 된다고
              알립니다. 빌드 표의 Revalidate 10s / Expire 1y와 같은 값입니다. static/은
              revalidate가 없으므로 1년(<code>s-maxage=31536000</code>)입니다.
            </li>
            <li>
              <strong>렌더 후 경과</strong>: HIT 응답은 대개 10초 미만, STALE 응답은 10초 이상입니다. 브라우저·서버 시계
              차이만큼 오차가 있을 수 있어 판정에는 쓰지 않고 참고값으로만 보여줍니다.
            </li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>4. 실무 주의사항</h5>
          <ul className={list}>
            <li>
              <strong>next dev에서는 관측 불가</strong>: 개발 서버는 page를 요청마다 렌더링하고 캐시하지 않습니다. 이 데모를
              dev로 열면 두 page 모두 매번 새 ID가 나오는 것이 정상이며, 판정 기준도 실행 모드에 맞춰 바뀝니다.
            </li>
            <li>
              <strong>가장 짧은 값이 라우트 전체를 지배</strong>: 한 라우트의 layout과 page 중 가장 짧은 revalidate가 라우트
              전체 주기가 됩니다. 그래서 이 데모의 layout에는 값을 두지 않았습니다. 개별 fetch의 더 짧은 revalidate도 라우트
              주기를 앞당깁니다(fetch 옵션 쪽은 형제 실습 fetch-cache가 다룹니다).
            </li>
            <li>
              <strong>리터럴만 허용</strong>: <code>revalidate = 600</code>은 되지만 <code>60 * 10</code> 같은 식은 정적으로
              분석할 수 없어 유효하지 않습니다(공식 문서 기준). <code>0</code>은 요청마다 렌더링, <code>false</code>(기본)는 무기한입니다.
            </li>
            <li>
              <strong>런타임 API를 쓰면 무의미</strong>: <code>cookies()</code>·<code>headers()</code>·<code>searchParams</code>를
              쓰는 라우트는 요청마다 렌더링되므로 시간 기반 재생성이 적용되지 않습니다.
            </li>
            <li>
              <strong>Cache Components를 켠 앱</strong>: 이 설정은 제거되고 <code>use cache</code> + <code>cacheLife</code>로
              대체됩니다. 이 데모는 그 설정이 없는 zone 기준입니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
