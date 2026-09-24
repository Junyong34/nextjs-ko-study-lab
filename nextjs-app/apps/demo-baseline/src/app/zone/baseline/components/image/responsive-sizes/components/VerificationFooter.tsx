'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { CaseVerdict, SizesPreset } from '../types'

interface VerificationFooterProps {
  preset: SizesPreset
  verdicts: (CaseVerdict | null)[]
}

function join(verdicts: CaseVerdict[], pick: 'expected' | 'actual') {
  return verdicts
    .map((v) => `[${v.title}]${pick === 'actual' ? (v.matched ? ' 일치' : ' 불일치') : ''}\n${v[pick]}`)
    .join('\n\n')
}

export function VerificationFooter({ preset, verdicts }: VerificationFooterProps) {
  const ready = verdicts.every((v): v is CaseVerdict => v !== null)
  const done = ready ? (verdicts as CaseVerdict[]) : []
  const isMatched = ready ? done.every((v) => v.matched) : undefined

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={`sizes 프리셋 "${preset.label}" — 렌더된 <img> 3개의 DOM 실측 대조`}
        expected={<span>{ready ? join(done, 'expected') : '• 세 이미지의 load 이벤트를 기다리는 중'}</span>}
        actual={<span>{ready ? join(done, 'actual') : '• 측정 중…'}</span>}
        isMatched={isMatched}
        description="Expected는 공식 문서 components/image.md의 fill·sizes·unoptimized·deviceSizes/imageSizes 절과 HTML srcset 선택 규칙에서 도출한 값, Actual은 getAttribute('srcset'|'sizes'), currentSrc, naturalWidth, getBoundingClientRect, 그리고 currentSrc를 새 Image로 다시 읽은 파일 폭입니다. 창 크기를 바꾸면 다시 측정합니다."
      />
      <DemoDeepDiveCard title="fill은 레이아웃, sizes는 srcset 선택 힌트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. fill — 부모를 채우는 absolute 이미지</h5>
            <p>
              <code>fill</code>은 <code>&lt;img&gt;</code>에 <code>position:absolute; inset:0; width:100%; height:100%</code>를 inline으로 넣는다.
              그래서 부모에 <code>position: relative</code>(또는 fixed/absolute)와 크기(여기서는 <code>aspect-[2/1] w-full</code>)가 있어야 하고,
              렌더 박스는 부모 박스와 같아진다. 잘림·비율은 <code>object-fit</code>으로 정한다. 크기를 모르니 브라우저에 폭을 알려 줄 방법이 <code>sizes</code>뿐이다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. sizes — 다운로드 전에 브라우저가 쓰는 폭 예고</h5>
            <p>
              브라우저는 CSS 레이아웃이 끝나기 전에 이미지를 고른다. <code>sizes</code>의 미디어 조건을 평가해 슬롯 폭을 얻고, 슬롯 폭 × DPR 이상인
              <code> w</code> 후보(또는 그에 인접한 후보)를 받는다. sizes를 생략하면 fill 이미지도 <code>100vw</code>로 가정해 3열 카드에 화면 전체 폭 파일을 받는다.
              반대로 실제보다 작게 적으면(10vw 프리셋) 작은 후보를 골라 흐려진다 — 이때 <code>naturalWidth</code>(밀도 보정값)가 렌더 박스보다 작아지는 것을 볼 수 있다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 최적화가 켜진 next/image의 srcset 모양 (문서 기준)</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>sizes 없음: <code>1x, 2x</code> 같은 제한된 srcset — 고정 크기 이미지용. C가 이 형태를 네이티브로 쓴 것이다.</li>
              <li>sizes 있음: <code>640w, 750w, …</code> 같은 전체 srcset. 후보 폭은 <code>deviceSizes</code>(기본 640~3840)와 <code>imageSizes</code>(기본 32~384)를 합친 목록에서 온다.</li>
              <li>B는 그 기본값 15개를 모두 w 후보로 적고 sizes만 바꾼다. next/image가 실제로 어떤 부분집합을 고르는지는 문서가 규정하지 않으므로 여기서 재현하지 않는다.</li>
            </ul>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 이 앱에서 A에 srcset이 없는 이유 — unoptimized의 영향</h5>
            <p>
              데모 zone은 <code>next.config.ts</code>에 <code>images: {'{ unoptimized: true }'}</code>를 둔다(<code>/_next/image</code>가 셸 rewrites를 타지 못해서).
              문서의 unoptimized 절대로 이때 원본은 &quot;as-is&quot;로 제공되어, A의 DOM에는 <code>srcset</code>·<code>sizes</code> 속성이 없고 currentSrc에도 폭 파라미터가 없다.
              실측해 보면 컴포넌트에 <code>loader</code> prop을 넘겨도 호출되지 않는다(전역 설정이 우선 — next 소스
              <code> next/dist/shared/lib/get-img-props.js</code>에서 확인 가능하지만 이 데모는 그 모듈을 import하지 않는다).
              그래서 sizes가 후보 선택에 미치는 영향은 B·C의 네이티브 <code>&lt;img&gt;</code>로 본다. 폭별 파일은 <code>photo/route.ts</code>가 요청 폭을 intrinsic width로 갖는
              SVG로 응답한다 — 래스터 리사이즈나 포맷 변환은 없으므로 바이트 절감이 아니라 &quot;어떤 후보를 골랐는가&quot;만 관찰한다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">5. 주의</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>셸에서 볼 때 <code>vw</code>는 셸 창이 아니라 데모 iframe의 폭이다.</li>
              <li>정확한 선택 규칙은 브라우저 재량이다. 이미 받은 큰 후보는 창을 줄여도 재사용할 수 있어, 검증은 &quot;필요값 바로 아래 후보 이상&quot;을 허용 범위로 본다.</li>
              <li>sizes는 실제 CSS 레이아웃과 같게 써야 한다. 브레이크포인트(여기서는 md = 768px)가 바뀌면 sizes도 함께 고친다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
