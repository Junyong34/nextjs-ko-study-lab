export const content = {
  notApplied:
    '이 앱의 next.config.ts에는 logging 설정이 없습니다. logging은 같은 dev 서버를 쓰는 모든 데모의 터미널 출력을 바꾸므로 켜지 않았습니다. 아래 실측은 "설정 없음" 상태에서 이 페이지가 실제로 보낸 fetch입니다.',
  examples: [
    {
      file: 'next.config.ts (별도 앱)',
      code: "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = {\n  logging: {\n    fetches: {\n      fullUrl: true,\n    },\n  },\n}\n\nexport default nextConfig",
      note: 'fetches 객체가 있어야 fetch 로그가 찍힙니다. fullUrl은 그중 URL을 자를지 말지만 정합니다.',
    },
    {
      file: 'app/products/page.tsx (별도 앱)',
      code: "export default async function Page() {\n  const res = await fetch(\n    'http://localhost:3100/api/catalog?category=runnin..shoes&sizes=250,255,260&sort=price-asc&utm_source=newsletter',\n    { cache: 'no-store' },\n  )\n  const data = await res.json()\n  return <pre>{JSON.stringify(data, null, 2)}</pre>\n}",
      note: '서버 컴포넌트의 fetch만 대상입니다. 브라우저에서 실행된 fetch는 dev 서버 터미널에 이 형식으로 찍히지 않습니다.',
    },
    {
      file: '별도 앱에서 실행할 명령',
      code: 'pnpm exec next dev --port 3100\n# 브라우저에서 http://localhost:3100/products 열기',
      note: 'logging은 next dev 전용입니다. next build && next start로는 같은 줄을 볼 수 없습니다.',
    },
  ],
  procedure: [
    '별도 앱에서 logging을 지운 채 /products를 엽니다. 터미널에는 " GET /products 200 in …" 요청 줄만 있고 그 아래 │ 로 시작하는 fetch 줄이 없습니다.',
    'logging: { fetches: {} }로 바꾸고 dev 서버를 다시 시작합니다. 요청 줄 아래에 " │ GET http://localhost:3100/api/catalog?category=runnin.." 처럼 잘린 URL과 (cache skip), 다음 줄에 "Cache skipped reason: (cache: no-store)"가 찍힙니다.',
    'fullUrl: true를 추가하고 다시 시작합니다. 같은 자리에 쿼리스트링까지 전부 찍히는지 확인합니다. 바뀌는 것은 터미널 표시뿐이고 실제로 전송되는 URL은 같습니다.',
  ],
  cautions: [
    'fullUrl: true는 쿼리스트링 속 토큰·이메일 같은 값도 그대로 터미널에 남깁니다. 공유 화면이나 CI 로그에 붙여 넣기 전에 확인하세요.',
    '이 페이지처럼 같은 앱의 Route Handler를 fetch하면 받는 쪽 요청도 " GET /…/api/catalog?… 200 in …" 요청 줄로 따로 찍힙니다. 이 줄은 incomingRequests 로그라서 fetches 설정과 무관합니다. │ 로 들여쓴 fetch 줄과 구분하세요.',
    'next.config.ts를 바꾸면 dev 서버를 다시 시작해야 합니다. 프로덕션 로그 수집 용도로는 instrumentation이나 별도 로거를 쓰세요.',
  ],
  questions: [
    {
      prompt: 'next.config.ts에 logging 설정이 전혀 없을 때 서버 fetch는 dev 터미널에 어떻게 보일까요?',
      choices: ['잘린 URL로 한 줄 찍힌다', 'fetch 줄이 찍히지 않는다', '전체 URL로 찍힌다'],
      correct: 1,
      reason: 'logging.fetches 객체가 있어야 fetch 줄을 출력합니다. 설정이 없으면 캐시 경고가 있을 때만 URL이 표시됩니다.',
    },
    {
      prompt: 'logging: { fetches: { fullUrl: true } }를 켠 앱을 next start로 실행하면?',
      choices: ['터미널에 전체 URL이 찍힌다', 'fetch 로그가 찍히지 않는다', '응답 헤더에 URL이 실린다'],
      correct: 1,
      reason: 'fetch 로그는 dev 서버가 요청을 마칠 때 출력합니다. 프로덕션 서버에는 이 출력 경로가 없습니다.',
    },
  ],
  concepts: [
    {
      title: '출력 조건은 두 단계입니다',
      body: 'logging.fetches가 있어야 fetch 줄이 생기고, fullUrl은 48자를 넘는 URL을 "호스트 16자 + 경로 24자 + 쿼리 16자"로 자를지 정합니다. 위 실측 URL은 이 기준을 넘으므로 fullUrl 여부에 따라 표시가 달라집니다.',
    },
    {
      title: '로그와 실제 요청은 별개입니다',
      body: '잘린 로그를 보고 쿼리가 빠졌다고 판단하면 안 됩니다. Route Handler가 돌려준 receivedSearch처럼 받는 쪽에서 확인하면 실제로 전달된 URL을 알 수 있습니다.',
    },
    {
      title: '요청 흐름',
      body: '브라우저 → page.tsx 렌더(서버) → fetch(api/catalog?…) → Route Handler 응답 → 렌더 완료 → dev 서버가 요청 줄과 fetch 줄을 터미널에 출력. 이 화면은 앞부분만 측정하고 터미널 출력은 읽지 않습니다.',
    },
  ],
  references: [
    { label: 'logging 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/logging' },
    { label: 'fetch 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/functions/fetch' },
  ],
}
