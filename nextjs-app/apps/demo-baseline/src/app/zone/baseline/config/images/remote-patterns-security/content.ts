export const content = {
  notApplied:
    '이 앱에서는 remotePatterns를 적용하지 않았습니다. 이 zone은 images.unoptimized: true라 /_next/image(이미지 최적화 API)가 없고, ' +
    'remotePatterns는 그 API가 받은 url 파라미터를 검사하는 설정이기 때문입니다. optimizer를 켜려면 unoptimized를 앱 전역에서 꺼야 하고, ' +
    '그러면 모든 <Image>의 src가 /_next/image로 바뀌는데 이 경로는 셸의 rewrites에 걸리지 않습니다(assetPrefix는 _next/static에만 붙음). ' +
    '그래서 아래에서는 현재 설정에서 측정할 수 있는 것만 실측하고, 적용 후 동작은 설정 예제·확인 절차·개념 확인으로 다룹니다.',
  examples: [
    {
      file: 'next.config.ts (별도 앱)',
      code: `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 객체 형식: 생략한 필드는 ** 로 암시되므로 가능한 한 전부 적는다
      {
        protocol: 'https',
        hostname: 'cdn.shop.example',
        port: '',
        pathname: '/products/**',
        search: '',
      },
      // URL 형식: 같은 뜻을 짧게 적는다
      new URL('https://cdn.shop.example/products/**'),
    ],
  },
}

export default nextConfig`,
      note: 'images.unoptimized를 두지 않은(기본값 false) 앱에서 씁니다. 두 항목 중 하나만 맞아도 허용됩니다.',
    },
    {
      file: '별도 앱에서 확인할 요청',
      code: `pnpm dev   # 또는 pnpm build && pnpm start

# 패턴에 맞는 URL → optimizer가 원본을 받아 변환 (원본 서버가 실제로 있어야 200)
curl -i "http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn.shop.example%2Fproducts%2Frunner.png&w=640&q=75"

# 패턴에 없는 URL → 원본을 받으러 가지 않고 바로 거절
curl -i "http://localhost:3000/_next/image?url=https%3A%2F%2Fevil.example%2Fa.png&w=640&q=75"
# HTTP/1.1 400 Bad Request
# "url" parameter is not allowed`,
      note: '셀프 호스팅(next start)의 오류 본문입니다. Vercel에서는 같은 거절이 INVALID_IMAGE_OPTIMIZE_REQUEST 오류 코드로 보입니다.',
    },
  ],
  procedure: [
    '새 앱(create-next-app)이나 별도 브랜치에서 images.unoptimized 없이 위 remotePatterns를 넣습니다.',
    '실제로 응답하는 이미지 호스트(직접 운영하는 CDN 등)로 hostname을 바꾸고 <Image src="https://…">를 렌더합니다. Network에서 /_next/image?url=… 요청이 200, Content-Type이 image/webp인지 봅니다.',
    'url 파라미터를 패턴 밖 호스트·http·다른 경로·쿼리 추가로 바꿔 직접 요청하고 400과 "url" parameter is not allowed를 확인합니다.',
    '패턴을 { hostname: \'**\' }로 넓혀 같은 요청이 통과하는지 비교한 뒤 원래대로 되돌립니다.',
  ],
  cautions: [
    "hostname: '**'나 필드 생략은 아무 호스트의 이미지를 내 서버가 대신 받아 변환하게 만듭니다. 변환 CPU·대역폭·캐시 저장 비용을 남이 쓰게 되고, 내부망 주소를 찔러 보는 SSRF 시도의 통로가 됩니다.",
    'images.domains는 Next.js 14부터 폐기됐습니다. protocol·port·pathname을 제한할 수 없으므로 remotePatterns로 옮깁니다.',
    '허용된 호스트가 리다이렉트로 응답하면 optimizer는 리다이렉트 위치를 remotePatterns로 다시 검사하지 않습니다. 필요하면 maximumRedirects를 줄입니다.',
    'images.unoptimized: true인 앱에서는 remotePatterns가 검사되지 않습니다. 브라우저가 원격 이미지를 직접 받기 때문에 원격 호스트 제한은 CSP(img-src) 같은 다른 수단으로 합니다.',
  ],
  concepts: [
    {
      title: '누가 원격 이미지를 내려받는가',
      body:
        'optimizer가 켜진 앱에서 <Image src="https://…">는 /_next/image?url=…로 바뀌고, 원본은 브라우저가 아니라 서버가 내려받습니다. ' +
        '그래서 url 파라미터를 열어 두면 누구나 내 서버에 임의 URL을 요청하게 시킬 수 있고, remotePatterns가 그 입구를 막습니다. ' +
        'unoptimized: true인 이 zone은 반대로 브라우저가 원본을 직접 받으므로, 실측 패널에서 /_next/image가 400이 아니라 404인 것과 <img src>가 원본 그대로인 것을 검증 패널에서 확인합니다.',
    },
    {
      title: '검사 순서와 실패 응답',
      body:
        'url 파라미터 검증(필수·길이·// 금지) → http/https만 허용 → remotePatterns(+ 폐기된 domains) 일치 → 원본 요청 시 사설 IP 차단(dangerouslyAllowLocalIP: false) 순서입니다. ' +
        '패턴에서 걸리면 원본 서버에 연결하지 않고 400을 돌려줍니다. 패턴은 protocol·port·search 정확 일치, hostname·pathname glob 일치를 모두 만족해야 합니다.',
    },
    {
      title: '와일드카드의 범위',
      body:
        '*는 서브도메인 한 단계나 경로 세그먼트 하나, **는 맨 앞 서브도메인 여러 단계나 끝의 경로 여러 단계입니다. 중간의 **는 지원하지 않습니다. ' +
        '개념 확인의 정답은 이 문서 규칙을 옮긴 판정 함수(lib/remote-pattern.ts)가 계산하며, 이 앱의 optimizer 응답이 아닙니다.',
    },
  ],
  references: [
    { label: 'next.config.js images 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/images' },
    { label: 'Image 컴포넌트 remotePatterns', url: 'https://nextjs.org/docs/app/api-reference/components/image#remotepatterns' },
  ],
}
