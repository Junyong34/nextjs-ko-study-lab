'use client'

import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

const EXPECTED = [
  '• 진입 전: <video>에 src가 없고 preload="none"이며, 브라우저·서버 어디에도 영상 요청이 0건이다.',
  '• 진입 후(박스를 스크롤해 영상이 25% 이상 보인 뒤): 요청이 발생하고 Range 요청은 206으로 응답되며, readyState ≥ 2이고 muted 상태로 자동 재생된다(paused=false).',
  '• 비교군(즉시 로드)은 스크롤 없이도 요청이 발생한다 (실행한 경우에만 판정).',
].join('\n')

export function VerificationFooter({ matched, actual }: { matched: boolean | undefined; actual: string[] }) {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="영상 지연 로딩과 자동 재생 검증"
        expected={EXPECTED}
        // 문자열끼리는 ExpectedActualPanel이 자동 비교(→ 불일치)하므로 ReactNode로 넘긴다
        actual={<span>{actual.length > 0 ? actual.join('\n') : '• 상호작용 대기 중 (스크롤 전에 먼저 [현재 요청 수·재생 상태 측정]을 누르세요.)'}</span>}
        isMatched={matched}
        description="스크롤 전·후 두 번의 측정이 모두 있어야 검증 완료가 됩니다. 값은 video 요소 속성, Resource Timing, 서버 Route Handler 기록에서 읽습니다."
      />
      <DemoDeepDiveCard title="video 지연 로딩: src·preload 부여 시점과 muted autoplay">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 핵심 메커니즘</h5>
            <p>
              <code>&lt;video preload="none"&gt;</code>에 <code>src</code>를 주지 않으면 브라우저는 영상 자원을 요청하지 않는다. IntersectionObserver가 뷰포트
              진입을 알려 주면 그때 <code>src</code>와 <code>preload="auto"</code>를 부여하고, <code>muted</code> 상태로 <code>play()</code>를 호출한다.
              브라우저 autoplay 정책은 muted 영상의 자동 재생을 허용하므로 <code>muted</code>가 빠지면 재생이 거부될 수 있다.
            </p>
            <pre className="mt-1.5 overflow-x-auto rounded bg-zinc-950 p-2.5 font-mono text-[10px] leading-relaxed text-zinc-300">{`const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) setEntered(true)       // 한 번만 진입을 감지
}, { threshold: 0.25 })

<video src={entered ? url : undefined}
       preload={entered ? 'auto' : 'none'}
       muted loop playsInline />                    // 진입 후 video.play()`}</pre>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 영상 자산과 Range 요청</h5>
            <p>
              <code>public/</code> 대신 Route Handler(<code>video/route.ts</code>)가 base64 상수를 디코딩해 mp4 바이너리로 응답한다. 이 파일은 moov 박스가 뒤쪽에 있어
              브라우저가 <code>Range</code> 헤더로 필요한 구간만 요청하고, 서버는 <code>206 Partial Content</code>와 <code>Content-Range</code>로 답한다.
              실서비스에서는 Vercel Blob 같은 스토리지가 이 역할을 맡는다.
            </p>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 주의사항</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>서버 렌더 HTML에 영상 URL이 들어 있으면 지연 로딩이 무의미하다. 이 데모는 run id를 마운트 후에 만들어 초기 HTML에 URL을 싣지 않는다.</li>
              <li>CLS를 막으려면 영상 영역의 크기(<code>aspect-video</code> 등)를 미리 확보한다.</li>
              <li>외부 플랫폼 영상은 <code>&lt;iframe loading="lazy"&gt;</code>와 Suspense 스트리밍 패턴이 대안이다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
