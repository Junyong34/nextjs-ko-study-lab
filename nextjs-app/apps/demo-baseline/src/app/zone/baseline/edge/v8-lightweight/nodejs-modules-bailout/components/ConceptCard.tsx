import { DemoDeepDiveCard } from '@study/demo-kit'

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="Edge Runtime과 Node.js 전용 모듈">
      <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          Next.js에는 서버 런타임이 둘 있습니다. 기본값 <code>nodejs</code>는 모든 Node.js API(<code>fs</code>, <code>net</code>,
          <code>child_process</code> 등)를 쓸 수 있고, <code>edge</code>는 fetch·Request·Response·Web Crypto·스트림 같은
          제한된 Web API 집합만 제공합니다. 공식 문서(Edge Runtime)도 &quot;Edge Runtime은 모든 Node.js API를 지원하지 않으며
          일부 패키지가 동작하지 않을 수 있다&quot;고 밝힙니다.
        </p>
        <p>
          이 실습의 <code>probe.ts</code>는 두 Route Handler가 함께 쓰는 코드이고, 차이는 <code>node/route.ts</code>의
          <code>runtime = &apos;nodejs&apos;</code>와 <code>edge/route.ts</code>의 <code>runtime = &apos;edge&apos;</code> 한 줄뿐입니다.
          위 결과에서 <code>NEXT_RUNTIME</code>이 각각 nodejs·edge로 찍히고, node에서만 fs 로드와 파일 읽기가 성공합니다.
        </p>
        <pre className="overflow-x-auto rounded bg-zinc-100 p-2 font-mono text-[11px] dark:bg-zinc-900">{`// 정적 import는 edge 세그먼트 번들에 Node 모듈 참조를 넣는다
import fs from 'node:fs'          // 빌드 경고/배포 거부의 원인

// 이 데모: specifier를 변수로 두고 번들러 분석을 끈 동적 import를 try/catch로 감싼다
const specifier = 'node:fs'
const mod = await import(/* turbopackIgnore: true */ specifier)`}</pre>
        <ul className="list-disc space-y-1 pl-4">
          <li>
            <strong>번들 시점과 실행 시점은 다르다.</strong> 이 데모는 앱 전체 빌드가 깨지지 않도록 실행 시점 실패만 관찰합니다.
            그래서 edge의 에러 문구는 &quot;A dynamic import callback was not specified.&quot;입니다. 같은 파일에서 리터럴
            <code>import(&apos;node:fs&apos;)</code>를 쓰면 dev에서 &quot;Native module not found: node:fs&quot;로 잡혔지만,
            <code>next build</code>는 이 저장소에서 실행하지 않아 결과를 확인하지 못했습니다.
          </li>
          <li>
            <strong>없는 파일은 다른 실패입니다.</strong> 드롭다운에서 없는 파일을 고르면 node는 <code>ENOENT</code>로 실패합니다.
            모듈이 막힌 것(<code>moduleBlocked</code>)과 모듈은 있지만 파일이 없는 것을 구분해서 보세요.
          </li>
          <li>
            <strong>대안.</strong> 파일 IO·TCP 드라이버(<code>pg</code>, <code>mysql2</code>)·Node crypto 의존 라이브러리가 필요한 라우트는
            <code>runtime = &apos;nodejs&apos;</code>로 두고, edge에서는 fetch 기반 HTTP 드라이버와 Web Crypto(<code>jose</code> 등)를 씁니다.
          </li>
          <li>
            <strong>deprecated.</strong> Next.js 16 기준 <code>runtime = &apos;edge&apos;</code>는 deprecated이며 Proxy에서는 이 옵션을 쓸 수 없습니다. 새 코드는
            <code>runtime</code> export를 두지 않고 기본 Node.js를 씁니다.
          </li>
        </ul>
      </div>
    </DemoDeepDiveCard>
  )
}
