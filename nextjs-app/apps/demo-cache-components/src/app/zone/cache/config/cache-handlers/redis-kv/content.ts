// 설명형 콘텐츠. 이 앱은 cacheHandlers를 설정하지 않았고 Redis도 없다.
// 아래 코드는 별도 앱에서 실행할 예제이며, 이 화면이 실행하는 코드는 probe/route.ts뿐이다.
export const content = {
  scenario:
    '상품 상세를 \'use cache\'로 캐시한 쇼핑몰을 컨테이너 3대로 늘렸습니다. 한 컨테이너에서 재고 태그를 무효화했는데 다른 컨테이너는 계속 예전 재고를 보여 줍니다. 무엇을 바꿔야 할까요?',
  notApplied:
    '이 앱에서는 cacheHandlers를 적용하지 않았습니다. 이유: 설정은 zone 전체에 걸리는 전역 옵션이라 켜는 순간 같은 zone의 다른 데모(특히 \'use cache: remote\'를 쓰는 directives/use-cache/remote-redis-cache)의 저장소가 함께 바뀌고, 연결할 Redis 서버도 없습니다. 위 실측은 설정하지 않았을 때의 기본 메모리 핸들러 동작입니다.',
  examples: [
    {
      file: 'next.config.ts',
      code: `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Next.js 16부터 최상위 옵션이다.
  // experimental.cacheHandlers로 적으면 경고와 함께 최상위로 옮겨진다.
  cacheHandlers: {
    // 지정하지 않은 default('use cache')는 내장 메모리 LRU를 그대로 쓴다.
    remote: require.resolve('./cache-handlers/redis-handler.js'),
  },
}

export default nextConfig`,
      note: "핸들러 키는 지시어 이름과 짝을 이룹니다. default는 'use cache', remote는 'use cache: remote', 직접 붙인 이름(예: sessions)은 'use cache: sessions'가 사용합니다. 'use cache: private'는 핸들러를 쓰지 않습니다.",
    },
    {
      file: 'cache-handlers/redis-handler.js (별도 앱, redis 패키지 필요)',
      code: `const { createClient } = require('redis')

const client = createClient({ url: process.env.REDIS_URL })
const ready = client.connect()
const tagTimes = new Map() // refreshTags()가 Redis에서 받아 오는 태그 무효화 시각

module.exports = {
  async get(cacheKey, softTags) {
    await ready
    const raw = await client.get(\`entry:\${cacheKey}\`)
    if (!raw) return undefined
    const { bytes, ...meta } = JSON.parse(raw)
    if (Date.now() > meta.timestamp + meta.revalidate * 1000) return undefined
    const tags = [...meta.tags, ...softTags]
    if (tags.some((tag) => (tagTimes.get(tag) ?? 0) > meta.timestamp)) return undefined
    const value = new Blob([Buffer.from(bytes, 'base64')]).stream()
    return { ...meta, value }
  },
  async set(cacheKey, pendingEntry) {
    await ready
    const { value, ...meta } = await pendingEntry // 아직 렌더링 중일 수 있어 반드시 await
    const bytes = Buffer.from(await new Response(value).arrayBuffer()).toString('base64')
    await client.set(\`entry:\${cacheKey}\`, JSON.stringify({ ...meta, bytes }), { EX: meta.expire })
  },
  async refreshTags() {
    const tags = await client.sMembers('revalidated-tags')
    if (tags.length === 0) return
    const times = await client.mGet(tags.map((tag) => \`tag:\${tag}\`))
    tags.forEach((tag, i) => tagTimes.set(tag, Number(times[i])))
  },
  async getExpiration(tags) {
    return Math.max(...tags.map((tag) => tagTimes.get(tag) ?? 0), 0)
  },
  async updateTags(tags) {
    const now = Date.now()
    const tx = client.multi()
    for (const tag of tags) {
      tx.set(\`tag:\${tag}\`, String(now)).sAdd('revalidated-tags', tag)
      tagTimes.set(tag, now)
    }
    await tx.exec()
  },
}`,
      note: '공식 문서의 인터페이스(get/set/refreshTags/getExpiration/updateTags)를 Redis에 옮긴 학습용 골격입니다. 연결 실패 시 get()이 undefined를 돌려주는 방어 코드, 부분 쓰기 처리, 큰 엔트리의 메모리 사용은 운영 전에 보강해야 합니다.',
    },
  ],
  procedure: [
    '별도 앱에서 cacheHandlers 없이 next build 후 next start --port 3101과 --port 3102로 두 인스턴스를 띄웁니다. 두 서버의 같은 \'use cache\' 응답에서 cacheId가 서로 다르고, 한쪽에서 태그를 무효화해도 다른 쪽 값이 그대로인지 확인합니다.',
    'Redis(예: docker run -p 6379:6379 redis)를 띄우고 REDIS_URL을 지정한 뒤 위 핸들러를 remote에 등록하고 해당 함수를 \'use cache: remote\'로 바꿉니다. 다시 빌드한 두 인스턴스에서 cacheId가 같아지는지 확인합니다.',
    '한 인스턴스에서 revalidateTag를 호출한 뒤 다른 인스턴스의 다음 요청이 새 값을 받는지 봅니다. refreshTags()가 요청 전에 Redis의 태그 시각을 읽어 오기 때문입니다.',
  ],
  cautions: [
    "'use cache: private'는 핸들러를 거치지 않습니다. 사용자별 데이터를 공유 저장소에 넣으려고 cacheHandlers를 설정하는 것은 잘못된 기대입니다.",
    'get()에서 던진 예외는 프레임워크가 잡지 않아 렌더 오류가 됩니다. Redis 장애 시 undefined(캐시 miss)를 돌려주도록 감싸세요.',
    'Static export에서는 cacheHandlers를 쓸 수 없습니다. 어댑터 환경은 공식 문서 표에서 Platform-specific이므로 배포 플랫폼 문서에서 지원 여부를 확인합니다.',
  ],
  questions: [
    {
      prompt: "cacheHandlers를 설정하지 않은 앱을 next start 프로세스 2개로 띄웠습니다. 같은 'use cache' 함수의 결과는 어떻게 될까요?",
      choices: [
        '두 프로세스가 .next 디렉토리를 통해 같은 엔트리를 공유한다',
        '프로세스마다 메모리 LRU에 따로 저장되어 서로 보지 못하고, 재시작하면 사라진다',
        '첫 번째로 계산한 프로세스가 다른 프로세스에 결과를 전송한다',
      ],
      correct: 1,
      reason: '기본 핸들러는 프로세스 메모리의 LRU와 프로세스 안의 태그 목록을 씁니다. 위 실측의 PID와 프로세스 시작 시각이 그 저장 위치를 가리킵니다.',
    },
    {
      prompt: "cacheHandlers에 remote 키만 지정했습니다. 'use cache'로 표시한 함수는 어디에 저장될까요?",
      choices: [
        'remote에 지정한 핸들러',
        '저장되지 않는다 (default 키가 필수)',
        '내장 메모리 LRU 핸들러',
      ],
      correct: 2,
      reason: "'use cache'는 default 핸들러를 씁니다. 지정하지 않은 키는 내장 메모리 LRU가 맡습니다. 공유 저장소로 보내려면 default를 지정하거나 함수를 'use cache: remote'로 바꿉니다.",
    },
    {
      prompt: '여러 인스턴스에서 태그 무효화를 맞추려면 어떤 메서드가 공유 저장소를 읽어야 할까요?',
      choices: ['refreshTags()', 'set()', '없다. revalidateTag가 모든 인스턴스에 자동으로 전파된다'],
      correct: 0,
      reason: 'updateTags()가 무효화 시각을 공유 저장소에 쓰고, 각 인스턴스는 요청 전에 refreshTags()로 그 시각을 읽어 옵니다. 기본 핸들러의 refreshTags()는 아무것도 하지 않습니다.',
    },
  ],
  concepts: [
    {
      title: '핸들러는 저장 위치를 바꿀 뿐이다',
      body: "'use cache'의 키 계산, cacheLife 수명, cacheTag 태그는 그대로입니다. cacheHandlers는 그 엔트리를 어디에 두고 태그 무효화를 어떻게 공유할지만 정합니다. 기본값은 프로세스 메모리 LRU(cacheMaxMemorySize 기본 50MB)입니다.",
    },
    {
      title: '이 화면의 실측과 남은 확인',
      body: "probe는 같은 프로세스(PID)에서 cacheId가 유지되고 무효화 직후에만 바뀌는 것을 보여 줍니다. 인스턴스가 여러 개일 때 서로 못 보는 현상은 이 앱 하나로는 재현하지 않았습니다. 확인 절차의 1번을 별도 앱에서 실행하세요. 데모 이름의 redis-kv는 학습 주제이며, 이 화면은 Redis에 연결하지 않습니다.",
    },
    {
      title: '이름 정정: experimental.cacheHandlers → cacheHandlers',
      body: 'Next.js 15 시절 실험 옵션이던 experimental.cacheHandlers는 16.0.0에서 최상위 cacheHandlers가 되었습니다. 16.3.2에서 예전 위치에 적으면 "has been moved" 경고와 함께 최상위로 옮겨집니다. 새 코드는 최상위에 적습니다.',
    },
  ],
  references: [
    { label: 'cacheHandlers 공식 문서', url: 'https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers' },
    { label: "'use cache: remote' 공식 문서", url: 'https://nextjs.org/docs/app/api-reference/directives/use-cache-remote' },
    { label: 'How Revalidation Works', url: 'https://nextjs.org/docs/app/guides/how-revalidation-works' },
  ],
}
