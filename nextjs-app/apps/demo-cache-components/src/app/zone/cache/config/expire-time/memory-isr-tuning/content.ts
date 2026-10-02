// 설명형 콘텐츠. 이 앱은 expireTime을 설정하지 않았다 (기본값 31536000초 상태를 실측한다).
export const content = {
  scenario:
    '상품 목록 페이지를 15분마다 다시 만들도록 했습니다. 그런데 CDN은 트래픽이 뜸한 상품 페이지를 몇 달 전 버전으로 계속 내보낼 수 있습니다. 오래된 페이지를 내보낼 수 있는 기간의 상한을 1시간으로 줄이려면 무엇을 바꿔야 할까요?',
  notApplied:
    '이 앱에서는 expireTime을 바꾸지 않았습니다. 이유: zone 전체의 ISR 경로에 걸리는 전역 옵션이라 바꾸면 같은 zone의 다른 데모 응답 헤더와 서버 캐시 수명이 함께 바뀝니다. 위 측정은 설정하지 않았을 때의 기본값(31536000초 = 365일)이 헤더에 반영되는 모습입니다.',
  examples: [
    {
      file: 'next.config.ts',
      code: `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  // 초 단위. expire를 정하지 않은 ISR 경로의 expire 기본값이 된다.
  expireTime: 3600,
}

export default nextConfig`,
      note: '옛 이름 experimental.swrDelta로 적으면 16.3.2는 "has been moved" 경고와 함께 expireTime으로 옮깁니다. 새 코드는 최상위 expireTime을 씁니다.',
    },
    {
      file: '적용 후 기대 헤더 (next start)',
      code: `# cacheLife('default')  revalidate 900, expire 미지정
Cache-Control: s-maxage=900, stale-while-revalidate=2700

# cacheLife('hours')    revalidate 3600, expire 86400 (변화 없음)
Cache-Control: s-maxage=3600, stale-while-revalidate=82800`,
      note: 'stale-while-revalidate는 expire − revalidate입니다. cacheLife가 expire를 정한 경로는 expireTime의 영향을 받지 않습니다. revalidate가 expireTime 이상이면 stale-while-revalidate가 붙지 않습니다.',
    },
    {
      file: '별도 앱에서 확인할 명령',
      code: `pnpm build
pnpm exec next start --port 3100
curl -sI http://localhost:3100/products | grep -i cache-control`,
      note: '반드시 production 서버에서 확인합니다. next dev는 모든 페이지에 Cache-Control: no-cache, must-revalidate를 보내므로 expireTime이 보이지 않습니다.',
    },
  ],
  procedure: [
    '별도 앱(또는 브랜치)에서 expireTime 없이 빌드하고 next start로 띄운 뒤, ISR 경로의 Cache-Control을 기록합니다. 이 화면의 production 실측과 같은 값이어야 합니다.',
    'next.config.ts에 expireTime: 3600을 넣고 다시 빌드·실행해 같은 경로의 stale-while-revalidate가 3600 − revalidate로 줄었는지 확인합니다.',
    "cacheLife('hours')처럼 expire를 정한 경로와 connection()을 쓰는 동적 경로는 값이 바뀌지 않는지 비교합니다.",
  ],
  cautions: [
    'expireTime은 메모리 사용량 한도가 아닙니다. 서버 메모리 캐시 크기는 cacheMaxMemorySize가 정합니다.',
    '16.3.2 서버의 ISR 캐시도 expire가 지난 엔트리는 오래된 응답을 내보내지 않고 다시 렌더링한 뒤 응답합니다 (incremental-cache). 너무 짧게 잡으면 트래픽이 적은 페이지가 자주 느려집니다.',
    'Vercel처럼 CDN이 stale-while-revalidate를 직접 처리하는 플랫폼에서는 브라우저가 받는 헤더가 next start와 다를 수 있습니다. 16.3.2는 NEXT_PRIVATE_CDN_CONSUMED_SWR_CACHE_CONTROL 환경변수가 있으면 기본값을 비워 둡니다.',
  ],
  questions: [
    {
      prompt: "expireTime: 3600일 때 cacheLife('default')(revalidate 900, expire 미지정) 경로의 Cache-Control은?",
      choices: [
        's-maxage=900, stale-while-revalidate=2700',
        's-maxage=3600, stale-while-revalidate=900',
        's-maxage=900, stale-while-revalidate=3600',
      ],
      correct: 0,
      reason: 'expire 자리를 expireTime 3600이 채우고, stale-while-revalidate는 3600 − 900 = 2700입니다.',
    },
    {
      prompt: "expireTime: 3600으로 바꿨을 때 cacheLife('hours') 경로의 헤더는 어떻게 될까요?",
      choices: ['stale-while-revalidate가 0이 된다', '그대로 s-maxage=3600, stale-while-revalidate=82800', 's-maxage가 3600에서 900으로 바뀐다'],
      correct: 1,
      reason: "'hours' 프로필이 expire 86400을 이미 정했으므로 expireTime은 쓰이지 않습니다. 위 실측의 hours 대상이 같은 원리를 보여 줍니다.",
    },
    {
      prompt: 'next dev에서 같은 경로를 요청하면 어떤 헤더가 보일까요?',
      choices: [
        'next start와 같은 s-maxage와 stale-while-revalidate',
        'expireTime 값만 담긴 max-age',
        'Cache-Control: no-cache, must-revalidate',
      ],
      correct: 2,
      reason: '개발 서버는 캐시 헤더를 덮어씁니다. 그래서 이 화면은 NODE_ENV가 production이 아니면 판정 불가로 표시합니다.',
    },
  ],
  concepts: [
    {
      title: 'expireTime은 expire의 기본값이다',
      body: "경로의 revalidate가 양수이고 cacheLife 등에서 유한한 expire가 정해지지 않았을 때 Next.js가 expire = expireTime으로 채웁니다. 그 결과가 Cache-Control: s-maxage=revalidate, stale-while-revalidate=expire − revalidate입니다. 기본값은 31536000초(365일)입니다.",
    },
    {
      title: 'cacheComponents zone에서 적용되는 범위',
      body: "'use cache'와 cacheLife를 쓰는 이 zone에서도 같은 규칙이 적용됩니다. cacheLife('default')는 expire가 무한대라 expireTime이 채우고, 'hours'처럼 expire가 있는 프로필은 그대로 씁니다. connection() 같은 요청 시점 렌더링은 ISR 캐시 수명이 없어 대상이 아닙니다. 캐시 수명이 없는 완전 정적 페이지(이 데모 페이지 자체)는 revalidate가 false라 s-maxage=31536000만 붙고 stale-while-revalidate가 없습니다. 이 31536000은 expireTime이 아니라 고정된 1년 값입니다.",
    },
    {
      title: 'expireTime은 메모리 보존 기간이나 메모리 한도가 아니다',
      body: '"메모리 ISR 캐시 보존 기간"으로 이해하기 쉽지만 정확하지 않습니다. expireTime은 메모리 크기를 제한하지 않고, ISR 응답을 오래된 상태로 내보낼 수 있는 상한(CDN의 stale-while-revalidate와 서버 ISR 캐시의 expire)을 정합니다. 옛 이름은 experimental.swrDelta입니다.',
    },
  ],
  references: [
    { label: 'expireTime 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/expireTime' },
    { label: 'cacheLife 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/functions/cacheLife' },
  ],
}
