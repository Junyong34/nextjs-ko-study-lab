import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

const WORKSPACE_ROOT = path.resolve(process.cwd())
const NEXTJS_APP_ROOT = path.join(WORKSPACE_ROOT, 'nextjs-app')
const MANIFEST_PATH = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos-manifest.json')

interface ManifestEntry {
  url: string
  title: string
  doc: string
  zone: string
  status: string
}

const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'))
const gettingStartedDemos = manifest.filter(d => d.doc.startsWith('1-getting-started/'))

console.log('============================================================')
console.log('   CHALLENGER 2: Milestone M1 UI Label & Interaction Audit  ')
console.log('============================================================\n')

let passCount = 0
let failCount = 0
const issues: string[] = []

function check(demoUrl: string, description: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✅ PASS: [${demoUrl}] ${description}`)
    passCount++
  } catch (err: any) {
    console.error(`  ❌ FAIL: [${demoUrl}] ${description}`)
    console.error(`     Error: ${err.message}`)
    issues.push(`[${demoUrl}] ${description}: ${err.message}`)
    failCount++
  }
}

// 1. Check Demo 8 (server-client-components/serialization)
check('server-client-components/serialization', 'Guide steps must not quote phantom tabs, phantom buttons, or fabricated stock decrement observation', () => {
  const p = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/page.tsx')
  const content = fs.readFileSync(p, 'utf-8')
  
  if (content.includes('탭 확인') || content.includes('탭 실행')) {
    throw new Error('Guide card quotes phantom tabs ("탭 확인", "탭 실행") which do not exist in the playground component.')
  }
  if (content.includes('실시간 재고 차감')) {
    throw new Error('Guide card quotes phantom button "[Server Action 실행: 실시간 재고 차감]". Actual button is "전달받은 Server Action Props 실행".')
  }
  if (content.includes('15개에서 14개로')) {
    throw new Error('Guide card observation fabricates stock decrement from 15 to 14, but server action only returns a string log.')
  }
})

// 2. Check Demo 21 (metadata-and-og-images/static-and-dynamic-metadata)
check('metadata-and-og-images/static-and-dynamic-metadata', 'Guide steps must not quote phantom product selection dropdowns or non-existent static metadata toggle tabs', () => {
  const p = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/metadata-and-og-images/static-and-dynamic-metadata/page.tsx')
  const content = fs.readFileSync(p, 'utf-8')

  if (content.includes('나이키 알파플라이 3 (동적 generateMetadata)] 선택')) {
    throw new Error('Guide card quotes phantom product selector "[1. 나이키 알파플라이 3 (동적 generateMetadata)] 선택". Playground only has og:title/og:description text inputs.')
  }
  if (content.includes('3. 고정 메타데이터 (정적 export const metadata)] 대조')) {
    throw new Error('Guide card quotes phantom comparison tab "[3. 고정 메타데이터 (정적 export const metadata)] 대조" which does not exist.')
  }
})

// 3. Check Demo 22 (metadata-and-og-images/opengraph-image)
check('metadata-and-og-images/opengraph-image', 'Guide steps must not quote phantom submit buttons or non-existent input placeholders', () => {
  const p = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/metadata-and-og-images/opengraph-image/page.tsx')
  const content = fs.readFileSync(p, 'utf-8')

  if (content.includes('상품 또는 기획전 제목을 입력하세요...')) {
    throw new Error('Guide card quotes phantom placeholder "[상품 또는 기획전 제목을 입력하세요...] 입력". Input labels are "뱃지 텍스트", "메인 헤드라인".')
  }
  if (content.includes('OG 이미지 동적 생성 실행 (ImageResponse)] 클릭')) {
    throw new Error('Guide card quotes phantom submit button "[OG 이미지 동적 생성 실행 (ImageResponse)] 클릭". Canvas updates reactively.')
  }
})

// 4. Check Demo 23 (route-handlers/rest-api-crud)
check('route-handlers/rest-api-crud', 'Guide steps must match actual 4 toolbar buttons instead of phantom tabs and submit buttons', () => {
  const p = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/route-handlers/rest-api-crud/page.tsx')
  const content = fs.readFileSync(p, 'utf-8')

  if (content.includes('탭 선택') || content.includes('REST API 요청 발송')) {
    throw new Error('Guide card quotes phantom tabs and button "[REST API 요청 발송]". Actual UI has direct buttons ("GET 전체 목록 조회", "POST 상품 등록 (+1)", "PATCH 1번 상품 품절 처리", "DELETE 2번 상품 삭제").')
  }
})

// 5. Check Demo 18 (css/css-modules)
check('css/css-modules', 'Guide steps must not quote phantom tab "[CSS 클래스 해시 검사기] 탭 클릭"', () => {
  const p = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/css/css-modules/page.tsx')
  const content = fs.readFileSync(p, 'utf-8')

  if (content.includes('[CSS 클래스 해시 검사기] 탭 클릭')) {
    throw new Error('Guide card quotes phantom tab "[CSS 클래스 해시 검사기] 탭 클릭". UI renders static side-by-side cards without tabs.')
  }
})

// 6. Check Demo 25 (proxy/rewrite-and-headers)
check('proxy/rewrite-and-headers', 'Guide steps must accurately quote button labels and tab names', () => {
  const p = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/proxy/rewrite-and-headers/page.tsx')
  const content = fs.readFileSync(p, 'utf-8')

  if (content.includes('실험군 (Bucket B - 신규 UI)')) {
    throw new Error('Guide card quotes "[실험군 (Bucket B - 신규 UI)]", but actual button text is "실험군 (Variant B)".')
  }
  if (content.includes('[2. 프록시 헤더 주입] 탭 확인')) {
    throw new Error('Guide card quotes "[2. 프록시 헤더 주입] 탭 확인", but actual tab button label is "헤더 주입".')
  }
})

// 7. Check Demo 11 (mutating-data/server-action-revalidate)
check('mutating-data/server-action-revalidate', 'Guide step must not quote phantom button [+ 장바구니 상품 추가]', () => {
  const p = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate/page.tsx')
  const content = fs.readFileSync(p, 'utf-8')

  if (content.includes('[+ 장바구니 상품 추가]')) {
    throw new Error('Guide card quotes phantom action "[+ 장바구니 상품 추가]". Table only supports quantity +/- and cart reset.')
  }
})

// 8. Check Demo 5 (linking-and-navigating/soft-navigation)
check('linking-and-navigating/soft-navigation', 'Guide step must not quote phantom button [스크롤 아래로 이동 ↓]', () => {
  const p = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/layout.tsx')
  const content = fs.readFileSync(p, 'utf-8')

  if (content.includes('[스크롤 아래로 이동 ↓] 버튼')) {
    throw new Error('Guide card quotes phantom button "[스크롤 아래로 이동 ↓] 버튼". Scrolling is manual.')
  }
})

console.log('\n============================================================')
console.log(`Summary: ${passCount} Passed, ${failCount} Failed`)
console.log('============================================================\n')

if (failCount > 0) {
  console.log('VERDICT: REJECT')
  console.log('Discrepancies must be remediated in Worker M1 iteration.\n')
} else {
  console.log('VERDICT: APPROVE\n')
}
