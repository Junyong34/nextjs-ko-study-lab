export const content = {
  notApplied:
    '이 앱에서는 experimental.staleTimes를 적용하지 않았습니다. 이 값은 빌드 시점에 클라이언트 라우터 번들에 박히는 전역 설정이라, 켜면 같은 zone의 모든 데모(특히 Client Cache를 관찰하는 다른 캐시 데모)의 이동 동작이 바뀝니다. 그래서 위에서는 기본값 상태를 실측했고, 값을 바꾼 결과는 아래 예제와 절차로 별도 앱에서 확인하세요.',
  examples: [
    {
      file: 'next.config.ts',
      code: "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = {\n  experimental: {\n    staleTimes: {\n      dynamic: 30, // 동적 세그먼트를 30초 동안 재사용\n      static: 180, // 정적·prefetch={true} 결과를 180초 동안 재사용 (최소 30)\n    },\n  },\n}\n\nexport default nextConfig",
      note: '16.3.2에서도 여전히 experimental 아래에 있습니다(next/dist/server/config-schema.js의 experimentalSchema). static은 30 미만이면 설정 검증에서 거부됩니다.',
    },
    {
      file: 'route 단위 대안 (cacheComponents 사용 시 권장)',
      code: "import { cacheLife } from 'next/cache'\n\nasync function getCatalog() {\n  'use cache'\n  cacheLife({ stale: 120, revalidate: 600, expire: 3600 })\n  // ...\n}",
      note: "공식 용어집은 route별 stale 시간을 cacheLife의 stale로 정하는 방식을 권장합니다. 서버가 x-nextjs-stale-time 응답 헤더로 값을 보내고, 클라이언트는 최소 30초를 적용합니다.",
    },
    {
      file: '별도 앱에서 확인할 명령',
      code: "pnpm build\npnpm exec next start --port 3100\n# 브라우저 Network에서 RSC 요청(?_rsc=)과 x-nextjs-stale-time 헤더 확인",
      note: 'dev 서버는 prefetch를 하지 않으므로 staleTimes 효과는 production 빌드에서만 확인됩니다.',
    },
  ],
  procedure: [
    '설정 전, production 빌드에서 이 데모처럼 정적 page와 동적 page를 <Link>로 왕복하며 RSC 요청 수를 기록합니다.',
    'staleTimes.dynamic을 30으로 바꿔 다시 빌드하고, 30초 안에 동적 page로 돌아갈 때 요청이 사라지는지, 30초 뒤에는 다시 나가는지 봅니다.',
    'staleTimes.static을 바꾸면 정적 page 응답의 x-nextjs-stale-time 값과 재요청 시점이 함께 바뀌는지 확인합니다.',
  ],
  cautions: [
    '값을 늘리면 다른 사용자가 바꾼 데이터나 서버 갱신이 그 시간 동안 화면에 늦게 반영됩니다. Server Action의 revalidateTag/updateTag/refresh는 Client Cache를 즉시 비웁니다.',
    '공유 layout은 이 설정과 관계없이 이동마다 다시 받지 않습니다(partial rendering). 뒤로/앞으로 가기 복원도 이 설정과 별개입니다.',
    "cacheLife('default')의 stale을 따로 정하지 않으면 staleTimes.static 값이 그 자리를 채웁니다. 기본 프로필을 쓰는 모든 'use cache'의 클라이언트 재사용 시간도 함께 바뀝니다.",
  ],
  questions: [
    {
      prompt: '설정이 없을 때(16.3.2 기본값) 동적 page로 <Link> 재방문하면?',
      choices: ['30초 동안은 요청 없이 재사용된다', 'dynamic 기본값이 0초라 매번 서버에 RSC 요청을 보낸다', '5분 동안 재사용된다'],
      correct: 1,
      reason: 'v15부터 dynamic 기본값이 0초입니다. 위 실측에서도 동적 page 재방문마다 요청이 나가고 렌더 ID가 바뀌었습니다.',
    },
    {
      prompt: '정적 page를 재방문할 때 렌더 ID는 같았지만 RSC 요청이 1건 나갔다면?',
      choices: ["서버의 'use cache' 결과를 다시 받은 것이고 클라이언트 캐시 재사용은 아니다", '클라이언트 캐시가 재사용됐다는 증거다', 'staleTimes.static이 0으로 설정됐다는 뜻이다'],
      correct: 0,
      reason: '요청이 나갔다면 Client Cache를 쓰지 않은 것입니다. 같은 값은 서버 캐시에서 왔습니다. 클라이언트 재사용은 요청 0건으로 판단합니다.',
    },
    {
      prompt: '이 데모의 zone처럼 cacheComponents: true일 때 route마다 다른 클라이언트 재사용 시간을 주려면?',
      choices: ['staleTimes를 route마다 다르게 쓴다', "'use cache' 함수 안에서 cacheLife의 stale을 지정한다", 'Link의 prefetch prop에 초 단위 값을 넣는다'],
      correct: 1,
      reason: 'staleTimes는 앱 전체에 한 값만 적용됩니다. route나 함수 단위는 cacheLife의 stale로 정하며 x-nextjs-stale-time 헤더로 전달됩니다.',
    },
  ],
}
