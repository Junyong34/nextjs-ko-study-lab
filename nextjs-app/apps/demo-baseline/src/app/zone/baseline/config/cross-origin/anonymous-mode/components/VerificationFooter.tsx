import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const CONCEPTS = [
  {
    title: '설정이 바꾸는 범위와 컴포넌트 prop',
    body: "next.config의 crossOrigin은 Next가 HTML에 넣는 태그에 crossorigin 속성을 붙이는 전역 설정입니다. 16.3.2 소스(dist/server/app-render)에서는 부트스트랩 <script>와 preinit 스크립트, CSS <link>, 폰트 preload에 이 값이 전달됩니다. 반면 위 실습의 <Script crossOrigin>은 그 컴포넌트 하나에만 속성을 붙입니다. 실습은 '속성의 의미'를 보여 줄 뿐, 설정을 켠 결과를 대신하지 않습니다.",
  },
  {
    title: '설정 없이도 crossorigin=""가 보이는 태그',
    body: "client 컴포넌트 청크의 <script async>는 React Flight가 preinit으로 넣습니다. 값은 client reference manifest의 moduleLoading.crossOrigin에서 오고, React는 'use-credentials'가 아닌 문자열을 모두 \"\"(anonymous)로 바꿉니다. 이 dev 빌드의 매니페스트 값은 \"none\"이라 설정 없이도 crossorigin=\"\"가 붙습니다. 같은 출처 요청이라 로드에는 영향이 없지만, assetPrefix로 다른 출처를 쓰면 이 청크도 CORS 헤더가 필요합니다. 설정을 켰을 때 이 값이 바뀌는지는 이 앱에서 확인하지 않았습니다.",
  },
  {
    title: '세 단계로 갈리는 브라우저 처리',
    body: '속성 없음 → no-cors 요청: 실행은 되지만 오류는 "Script error."로 가려짐. 속성 있음 + 서버 허용 없음 → CORS 검사 실패로 실행 전 차단(onError). 속성 있음 + Access-Control-Allow-Origin 허용 → 실행되고 오류 메시지·파일 경로가 그대로 보임. 서버가 받은 Sec-Fetch-Mode(no-cors / cors)와 Origin 헤더가 이 차이를 요청 쪽에서 보여 줍니다.',
  },
  {
    title: 'anonymous와 use-credentials',
    body: "anonymous는 쿠키 같은 자격 증명 없이 요청하므로 Access-Control-Allow-Origin: *로 충분합니다. use-credentials는 자격 증명을 포함하므로 *가 통하지 않고, 서버가 요청 Origin을 그대로 적고 Access-Control-Allow-Credentials: true를 함께 보내야 합니다.",
  },
  {
    title: '문서 설명과 소스의 차이(확인 필요)',
    body: '공식 문서는 이 옵션이 next/script가 만드는 <script>에 속성을 붙인다고 설명합니다. 그런데 16.3.2의 App Router용 next/script(dist/client/script.js)는 컴포넌트의 crossOrigin prop만 읽습니다. next/client 코드에서 설정값(process.env.__NEXT_CROSS_ORIGIN)을 읽는 곳은 Pages Router의 route-loader뿐입니다. 이 앱에서는 설정을 켜지 않았으므로 실제 동작은 별도 앱에서 확인해야 합니다.',
  },
]

export function VerificationFooter() {
  return (
    <DemoDeepDiveCard title="crossOrigin 개념 정리" className="min-w-0 break-words">
      {CONCEPTS.map((concept) => (
        <section key={concept.title} className="space-y-1.5">
          <h3 className="font-semibold">{concept.title}</h3>
          <p className="leading-relaxed">{concept.body}</p>
        </section>
      ))}
      <pre className="max-w-full overflow-x-auto rounded bg-zinc-950 p-3 text-[11px] leading-relaxed text-zinc-100">
        <code>{`이 페이지 (예: http://localhost:3001)
 └─ <Script src="http://127.0.0.1:3001/…/probe?cors=…" crossOrigin=…>
      └─ probe/route.ts  ── 응답 헤더: ACAO 없음 | * | Origin+Credentials
           └─ 브라우저 CORS 검사 → onLoad | onError
                └─ 실행 시 throw → window error: "Script error." | 상세 메시지`}</code>
      </pre>
      <p className="text-zinc-500">Next.js 16.3.2 기준. 실측(1·2단계)과 설정 예제·개념 확인(3·4단계)을 구분해서 읽어 보세요.</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <a href="https://nextjs.org/docs/app/api-reference/config/next-config-js/crossOrigin" target="_blank" rel="noreferrer" className="underline underline-offset-4">
          crossOrigin 공식 문서
        </a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin" target="_blank" rel="noreferrer" className="underline underline-offset-4">
          MDN crossorigin 속성
        </a>
      </div>
    </DemoDeepDiveCard>
  )
}
