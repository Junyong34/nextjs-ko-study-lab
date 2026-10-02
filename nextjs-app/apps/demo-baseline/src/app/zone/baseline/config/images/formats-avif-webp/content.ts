export const content = {
  notApplied:
    '이 앱에서는 images.formats를 적용하지 않았습니다. 이 zone은 images.unoptimized: true라 /_next/image(이미지 최적화 API)가 없고, ' +
    'formats는 그 API가 출력 포맷을 고를 때만 쓰이기 때문입니다. optimizer를 켜려면 unoptimized를 앱 전역에서 꺼야 하고, 그러면 모든 <Image>의 src가 ' +
    '/_next/image로 바뀌는데 이 경로는 셸의 rewrites에 걸리지 않습니다. 그래서 브라우저가 보내는 Accept와 실제 디코드 지원, 꺼진 optimizer의 응답은 실측하고, ' +
    'AVIF·WebP 변환 결과(Content-Type, 파일 크기, 인코딩 시간)는 실측할 수 없으므로 설정 예제·확인 절차·협상 계산으로 다룹니다.',
  examples: [
    {
      file: 'next.config.ts (별도 앱)',
      code: `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // 기본값은 ['image/webp']. AVIF를 받을 수 있는 브라우저에는 AVIF를 준다.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig`,
      note: 'images.unoptimized를 두지 않은(기본값 false) 앱에서 씁니다. 허용 값은 image/avif와 image/webp뿐입니다.',
    },
    {
      file: '별도 앱에서 확인할 요청',
      code: `pnpm build && pnpm start

# Accept에 따라 같은 URL의 Content-Type이 달라진다
curl -s -o /dev/null -D - -H "Accept: image/avif,image/webp,*/*" \\
  "http://localhost:3000/_next/image?url=%2Fhero.jpg&w=1080&q=75" | grep -i -E "content-type|vary"
curl -s -o /dev/null -D - -H "Accept: image/webp,*/*" \\
  "http://localhost:3000/_next/image?url=%2Fhero.jpg&w=1080&q=75" | grep -i -E "content-type|vary"
curl -s -o /dev/null -D - -H "Accept: image/png" \\
  "http://localhost:3000/_next/image?url=%2Fhero.jpg&w=1080&q=75" | grep -i -E "content-type|vary"`,
      note: '각각 image/avif, image/webp, image/jpeg(원본 포맷)이 기대값이고, 세 응답 모두 Vary: Accept가 붙습니다. 파일 크기는 -w "%{size_download}"로 비교합니다.',
    },
  ],
  procedure: [
    '별도 앱의 public/에 큰 JPEG(예: hero.jpg)를 두고 <Image src="/hero.jpg" width={1080} height={720}>를 렌더합니다.',
    'formats 없이(기본값) 빌드해 Network에서 /_next/image 응답의 Content-Type이 image/webp인지, 크기가 얼마인지 기록합니다.',
    "formats: ['image/avif', 'image/webp']로 바꿔 다시 빌드하고, 같은 요청의 Content-Type·크기·첫 요청 시간(캐시 전)과 두 번째 요청 시간(캐시 후)을 비교합니다.",
    "배열 순서를 ['image/webp', 'image/avif']로 바꿔도 Chrome의 결과가 바뀌는지 확인합니다. 이 화면의 협상 계산과 비교해 보세요.",
  ],
  cautions: [
    '공식 문서는 여전히 대부분의 경우 WebP를 권장합니다. AVIF는 인코딩이 약 50% 더 오래 걸리는 대신 WebP보다 약 20% 작습니다(문서 수치). 첫 요청은 느려지고, 캐시된 뒤의 요청은 빨라집니다.',
    '포맷을 둘 다 켜면 optimizer 캐시에 AVIF와 WebP가 따로 저장돼 저장 공간이 늘어납니다.',
    'Next.js 앞에 프록시·CDN을 두면 Accept 헤더를 Next.js까지 전달하고, 응답의 Vary: Accept를 지켜 캐시하도록 설정해야 합니다. 그렇지 않으면 AVIF가 지원하지 않는 브라우저에 전달될 수 있습니다.',
    '애니메이션 원본이나 Accept에 두 포맷이 모두 없는 요청은 원본 포맷을 유지합니다. 이 앱처럼 unoptimized: true이면 formats는 아무 효과가 없습니다.',
  ],
  concepts: [
    {
      title: '포맷은 요청마다 Accept로 정해진다',
      body:
        '같은 /_next/image URL이라도 브라우저가 보낸 Accept에 따라 응답 포맷이 달라집니다. 그래서 응답에 Vary: Accept가 붙습니다. ' +
        '측정에서 보았듯 <img> 요청과 fetch() 요청의 Accept는 다르고, next/image가 만드는 요청은 <img> 쪽입니다. ' +
        'Accept는 브라우저가 실제로 디코드할 수 있는 포맷을 알리는 신호이므로, 검증 패널은 Accept의 image/avif·image/webp 여부와 실제 디코드 결과가 맞는지 대조합니다.',
    },
    {
      title: '배열 순서에 대한 문서 설명과 16.3.2 소스',
      body:
        '공식 문서는 Accept가 여러 포맷과 일치하면 formats 배열의 첫 항목을 쓴다고 설명합니다. next@16.3.2의 image-optimizer는 @hapi/accept의 mediaType으로 고르는데, ' +
        '이 함수는 Accept 항목을 q값 → 타입 이름순으로 정렬합니다. 그래서 AVIF와 WebP의 q가 같은 Accept(현재 주요 브라우저)에서는 배열을 어떤 순서로 적어도 image/avif가 선택됩니다. ' +
        '배열 순서보다 "어떤 포맷을 배열에 넣었는가"와 Accept의 q값이 결과를 정합니다. 이 내용은 소스를 대조한 계산이며 이 앱에서 실측한 것이 아닙니다.',
    },
    {
      title: '실측할 수 없는 것',
      body:
        'AVIF·WebP로 변환된 파일 크기, 인코딩 시간, optimizer 캐시 동작은 optimizer가 꺼진 이 앱에서 나올 수 없어 측정하지 않았습니다. 화면의 디코드·인코드 결과는 브라우저 능력이고, 서버 변환 결과가 아닙니다.',
    },
  ],
  references: [
    { label: 'next.config.js images 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/images' },
    { label: 'Image 컴포넌트 formats', url: 'https://nextjs.org/docs/app/api-reference/components/image#formats' },
  ],
}
