import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const CONCEPTS = [
  {
    title: '이름 확인: 16.3.2에서도 experimental.staleTimes',
    body: '데모 제목의 experimental.staleTimes 표기는 16.3.2 기준으로 맞습니다. 설정 스키마(experimentalSchema)에 그대로 있고 기본값은 dynamic 0초, static 300초입니다. 폐기되지 않았지만, 공식 용어집은 route별 stale 시간을 cacheLife의 stale로 정하는 방식을 권장합니다.',
  },
  {
    title: '두 값이 적용되는 대상',
    body: 'dynamic은 정적으로 생성되지 않았고 완전히 prefetch되지도 않은 page 세그먼트에 쓰입니다. 기본 0초라 재방문마다 서버에 요청합니다. static은 정적 page, prefetch={true} 링크, router.prefetch 결과에 쓰이며 기본 5분입니다. 값은 빌드 시 클라이언트 라우터 코드(navigate-reducer)에 상수로 들어가고, static은 최소 30초가 강제됩니다.',
  },
  {
    title: 'cacheComponents와의 상호작용',
    body: "cacheComponents에서는 서버가 응답마다 x-nextjs-stale-time 헤더로 stale 시간을 보내고, 클라이언트는 헤더가 없을 때 staleTimes.static으로 대신합니다. 또 next.config에 cacheLife가 있고 default 프로필의 stale이 비어 있으면 staleTimes.static 값이 그 자리를 채웁니다(next/dist/server/config.js). 그래서 staleTimes.static을 바꾸면 기본 프로필을 쓰는 모든 'use cache'의 클라이언트 재사용 시간도 바뀝니다.",
  },
  {
    title: '이 설정이 바꾸지 않는 것',
    body: '공유 layout은 원래 이동마다 다시 받지 않고(partial rendering), 뒤로/앞으로 가기 복원도 별개입니다. 뒤로 가기 복원은 형제 데모 "Router Cache와 뒤로 가기 시 복원"이 다룹니다. 이 데모는 <Link>로 새로 진입할 때의 재사용 시간만 측정합니다.',
  },
]

export function VerificationFooter() {
  return (
    <DemoDeepDiveCard title="staleTimes 개념 정리" className="min-w-0 break-words">
      {CONCEPTS.map((concept) => (
        <section key={concept.title} className="space-y-1.5">
          <h3 className="font-semibold">{concept.title}</h3>
          <p className="leading-relaxed">{concept.body}</p>
        </section>
      ))}
      <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-3 text-[11px] leading-relaxed text-zinc-100">
        <code>{`router-cache-tuning/layout.tsx  (StaleTimesProvider: window.fetch 계측, 이동 중 유지)
 ├─ NavPanel        <Link> → static | dynamic
 ├─ {children}
 │   ├─ static/page.tsx   'use cache' 값 → staleTimes.static 대상
 │   └─ dynamic/page.tsx  <Suspense> + connection() → staleTimes.dynamic 대상
 └─ MeasurementBoard  이동별 RSC 요청 수 · 렌더 ID · 직전 응답 후 경과`}</code>
      </pre>
      <p className="text-zinc-500">Next.js 16.3.2 기준. 실측(기본값 상태)과 설정 예제·개념 확인(값을 바꾼 결과)을 구분해서 읽어 보세요.</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <a href="https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes" target="_blank" rel="noreferrer" className="underline underline-offset-4">
          staleTimes 공식 문서
        </a>
        <a href="https://nextjs.org/docs/app/api-reference/functions/cacheLife#client-cache-behavior" target="_blank" rel="noreferrer" className="underline underline-offset-4">
          cacheLife의 Client cache behavior
        </a>
      </div>
    </DemoDeepDiveCard>
  )
}
