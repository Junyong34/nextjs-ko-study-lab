import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const TREE = `app/layout.tsx                         → <html lang="ko"><body>  (루트, 수정 안 함)
└─ zone/baseline/file-conventions/layout/
   └─ root-and-nested/layout.tsx       → data-layout (모든 데모 경로)
      ├─ page.tsx                      → /
      ├─ electronics/page.tsx          → /electronics
      └─ clothing/layout.tsx           → data-layout (/clothing 이하)
         ├─ page.tsx                   → /clothing
         ├─ bottoms/page.tsx           → /clothing/bottoms
         └─ tops/layout.tsx            → data-layout (/clothing/tops)
            └─ page.tsx                → /clothing/tops`

const RENDERED = `<html lang="ko">                 ← app/layout.tsx
  <body>                         ← app/layout.tsx
    <div data-layout="root-and-nested/layout.tsx">
      <div data-layout="root-and-nested/clothing/layout.tsx">
        <div data-layout="root-and-nested/clothing/tops/layout.tsx">
          <section data-page="root-and-nested/clothing/tops/page.tsx">`

/** 4단 [개념 정리]: 루트 layout의 계약과 중첩 layout이 감싸는 순서·범위 */
export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="루트 layout과 중첩 layout의 감싸는 구조">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 루트 layout의 필수 계약</h5>
          <p>
            <code>app</code> 디렉터리에는 루트 layout이 반드시 있어야 하고, 루트 layout은 <code>{'<html>'}</code>과{' '}
            <code>{'<body>'}</code>를 정의해야 합니다. 이 앱에서는 <code>src/app/layout.tsx</code>가{' '}
            <code>{'<html lang="ko">'}</code>를 반환하고 <code>metadata.title.template</code>을 선언합니다.{' '}
            <code>{'<title>'}</code>·<code>{'<meta>'}</code>를 직접 쓰지 않고 Metadata API로 두므로, 하위 page가 정한 제목이
            template에 끼워져 <code>{'<head>'}</code>에 title 하나로 들어갑니다.
          </p>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 파일 위치 = 적용 범위, 폴더 깊이 = 감싸는 순서</h5>
          <p>
            layout은 자기 폴더의 page와 그 아래 모든 하위 경로를 감쌉니다. 중첩 layout은 html/body를 다시 만들지 않고 바로 위
            layout의 <code>children</code> 자리에 들어가므로, 바깥에서 안쪽 순서는 폴더 깊이와 같습니다. 옆 폴더(
            <code>electronics</code>)나 형제 폴더(<code>bottoms</code>)에는 적용되지 않습니다.
          </p>
          <pre className="mt-2 overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-2.5 font-mono text-[10.5px] leading-snug dark:border-zinc-800 dark:bg-zinc-900">
            {TREE}
          </pre>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 이 데모가 읽는 값</h5>
          <p>
            각 layout은 서버 컴포넌트로 자기 파일 경로를 <code>data-layout</code> 속성으로 렌더합니다. page 안의 클라이언트
            컴포넌트가 마운트된 뒤 <code>parentElement</code>를 따라 올라가며 data-layout 요소와 body·html을 만나는 순서대로
            기록하므로, 표에 나오는 목록은 실제로 렌더된 DOM 구조입니다. 예를 들어 /clothing/tops의 HTML은 아래와 같습니다.
          </p>
          <pre className="mt-2 overflow-x-auto rounded border border-zinc-200 bg-zinc-50 p-2.5 font-mono text-[10.5px] leading-snug dark:border-zinc-800 dark:bg-zinc-900">
            {RENDERED}
          </pre>
        </div>
        <div>
          <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>중첩 layout에서 <code>{'<html>'}</code>/<code>{'<body>'}</code>를 다시 반환하면 문서 구조가 깨집니다. 문서 뼈대는 루트 layout에만 둡니다.</li>
            <li>
              위에 layout.tsx가 없는 layout은 모두 루트 layout이 됩니다(다중 루트 layout, route groups로 분리). 이 데모는 앱의 단일
              루트 layout 아래 중첩 layout만 다룹니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
