'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import { EXPECTED_BACKGROUND } from '../lib/judge'

const EXPECTED = [
  '• 서버 원본 HTML: registry 있음 → <head>의 <style data-registry="ssr">에 규칙이 있고, 첫 사용 요소보다 앞이며, 같은 규칙은 한 번만 실린다 (FOUC 없음).',
  '• 서버 원본 HTML: registry 없음 → <style>이 없고 클래스명만 있다 (FOUC 발생).',
  `• 하이드레이션 후: SSR 규칙은 재사용(재주입 없음), 클라이언트에서 새로 만든 규칙만 data-registry="client"로 추가되고, 배경색은 ${EXPECTED_BACKGROUND}.`,
].join('\n')

interface VerificationFooterProps {
  matched: boolean | undefined
  actual: string[]
}

export function VerificationFooter({ matched, actual }: VerificationFooterProps) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="Style Registry SSR 스타일 주입 검증"
        expected={EXPECTED}
        // 문자열끼리는 ExpectedActualPanel이 자동 비교(→ 불일치)하므로 ReactNode로 넘긴다
        actual={<span>{actual.length > 0 ? actual.join('\n') : '• 상호작용 대기 중 (실습 영역의 두 실측 버튼을 눌러 확인하세요.)'}</span>}
        isMatched={matched}
        description="서버 원본 HTML(Node fetch)과 하이드레이션 후 DOM(getComputedStyle, document.querySelectorAll)을 모두 실측해야 검증 완료가 됩니다."
      />
      <DemoDeepDiveCard title="Style Registry 패턴: 수집 → flush → 클라이언트 재사용">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 메커니즘</h5>
            <p>
              런타임 CSS-in-JS는 렌더 도중 규칙을 만든다. App Router는 서버 렌더가 스트리밍이라, 규칙을 모아 두었다가 올바른 시점에 HTML에 끼워 넣을
              통로가 필요하다. 그 통로가 <code>useServerInsertedHTML</code>이고, 규칙 수집·dedupe·flush를 맡는 객체가 registry다.
            </p>
            <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-950 p-2.5 font-mono text-[10px] leading-relaxed text-zinc-300">{`render  : <StyledBadge/> → registry.insert(css) → "sr-1x2y3z" (같은 css는 한 번만 등록)
server  : useServerInsertedHTML(() => <style data-registry="ssr">{registry.flush()}</style>)
client  : useInsertionEffect(() => registry.commit(document))
           └ SSR <style>에 이미 있는 규칙 → 재사용(adopt), 없는 규칙만 <style data-registry="client">로 주입`}</pre>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 이 데모와 head-style 데모의 차이</h5>
            <p>
              <code>functions/use-server-inserted-html/head-style</code>은 훅이 <code>{'<head>'}</code>와 스트리밍 청크에 삽입되는 위치를 보여 준다.
              여기서는 그 훅을 쓰는 <strong>registry 패턴 전체</strong>(렌더 중 수집 → 서버 flush → 클라이언트가 SSR 규칙을 재사용하고 새 규칙만 추가)를
              실측한다. 클래스명이 CSS 문자열의 해시라서 서버와 클라이언트가 같은 값을 만들어 하이드레이션이 어긋나지 않는다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>registry 인스턴스는 <code>useState</code> 지연 초기화로 요청(렌더)마다 새로 만든다. 모듈 전역으로 두면 요청 간 규칙이 섞인다.</li>
              <li>Provider는 Client Component여야 하고 루트 레이아웃 근처에 두어야 하위 트리 전체의 규칙을 모을 수 있다.</li>
              <li>실제 라이브러리(styled-components, Emotion)는 각자의 registry 구현이 있다. 이 데모는 원리를 보이기 위한 최소 구현이며, 제로 런타임 방식(Tailwind, CSS Modules)은 registry 자체가 필요 없다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
