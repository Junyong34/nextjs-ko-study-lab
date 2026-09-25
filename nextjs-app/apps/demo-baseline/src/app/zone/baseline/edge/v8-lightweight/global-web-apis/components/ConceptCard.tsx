import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const TREE = `global-web-apis/
├─ page.tsx            # 화면 조립 (Node.js 런타임, 기본값)
├─ probe/route.ts      # export const runtime = 'edge' → edge-checks.ts
├─ stream/route.ts     # export const runtime = 'edge' → NDJSON 스트리밍
├─ edge-checks.ts      # Web API 11개 항목을 실제 호출
└─ web-std.ts          # sha256Hex·base64 — 브라우저와 Edge가 같은 코드 사용`

function H({ children }: { children: React.ReactNode }) {
  return <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">{children}</h5>
}

export function ConceptCard() {
  return (
    <DemoDeepDiveCard title="Edge Runtime이 제공하는 Web 표준 API">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <H>1. 문서가 말하는 지원 범위</H>
          <p>
            공식 Edge Runtime 문서의 Reference는 사용 가능한 API를 Network(<code>Request</code>, <code>Response</code>,{' '}
            <code>Headers</code>, <code>URLSearchParams</code>, <code>fetch</code> …), Encoding(<code>TextEncoder</code>,{' '}
            <code>TextDecoder</code>, <code>atob</code>, <code>btoa</code>, <code>TextEncoderStream</code> …), Streams(
            <code>ReadableStream</code>, <code>TransformStream</code> …), Crypto(<code>crypto</code>,{' '}
            <code>SubtleCrypto</code>), Web Standard(<code>AbortController</code>, <code>setTimeout</code>,{' '}
            <code>structuredClone</code>, <code>URL</code> …)로 나눠 나열합니다. 이 데모는 각 분류에서 대표 API를 골라
            edge Route Handler 안에서 <strong>실제로 호출한 결과</strong>를 그대로 돌려받습니다.
          </p>
        </div>

        <div>
          <H>2. 파일 구조</H>
          <pre className="overflow-x-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900">
            {TREE}
          </pre>
          <p className="mt-1.5">
            <code>web-std.ts</code>의 <code>sha256Hex()</code>는 브라우저 컴포넌트와 edge 라우트가 똑같이 import합니다. 두
            결과가 한 글자도 다르지 않다는 것이 &quot;Edge Runtime은 브라우저와 같은 Web 표준 API를 쓴다&quot;는 문장의 실측
            증거입니다.
          </p>
        </div>

        <div>
          <H>3. 스트리밍 응답</H>
          <p>
            <code>stream/route.ts</code>는 <code>ReadableStream</code>의 <code>pull()</code>에서 <code>setTimeout</code>으로
            400ms씩 쉬며 조각을 넣고, <code>TransformStream</code>이 NDJSON 한 줄로 바꾼 뒤{' '}
            <code>TextEncoderStream</code>이 바이트로 인코딩합니다. <code>new Response(stream)</code>으로 반환하면 브라우저는
            응답이 끝나기 전에 앞 청크부터 <code>reader.read()</code>로 받습니다. 도착 시각 간격이 서버의 대기 간격과
            비슷하면 중간에서 버퍼링되지 않았다는 뜻입니다. 문서는 스트리밍 지원이 배포 어댑터에 따라 다를 수 있다고
            적고 있으므로, 배포 환경에서도 이 간격을 다시 확인하는 것이 좋습니다.
          </p>
        </div>

        <div>
          <H>4. 주의사항</H>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              Next.js 16에서 <code>runtime = &apos;edge&apos;</code>는 deprecated입니다. 새 코드는 기본값(nodejs)을 쓰고, 이
              API들은 Node.js 런타임에도 똑같이 존재합니다.
            </li>
            <li>
              edge 세그먼트와 그것이 import하는 파일에는 <code>node:*</code> 모듈을 두지 않습니다. 이 데모의 edge 파일도
              Web 전역만 사용합니다. <code>eval</code>, <code>new Function(문자열)</code>은 Edge에서 동작하지 않습니다.
            </li>
            <li>
              <code>btoa</code>는 Latin-1 문자열만 받으므로 한글은 <code>TextEncoder</code>로 UTF-8 바이트를 만든 뒤
              인코딩해야 합니다(<code>web-std.ts</code>의 <code>base64FromUtf8</code>).
            </li>
            <li>
              로컬 <code>next dev</code>의 Edge 샌드박스에서는 <code>structuredClone</code> 결과가 다른 realm의 객체라{' '}
              <code>instanceof Date</code>가 false가 될 수 있습니다(이 데모에서 실측). 타입 판별은{' '}
              <code>Object.prototype.toString</code>처럼 realm에 무관한 방법을 씁니다.
            </li>
            <li>
              <code>fetch</code>도 지원 목록에 있지만, 이 데모는 외부 서비스 상태에 결과가 흔들리지 않도록 네트워크
              계열을 <code>Request</code>/<code>Response</code> 메모리 왕복으로 확인합니다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
