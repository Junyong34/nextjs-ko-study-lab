// revalidatePath는 브라우저 주소가 아니라 "이 앱의 라우트 파일 구조"를 기준으로 동작한다.
// 셸은 /zone/cache/:path* 를 같은 경로 그대로 이 zone으로 rewrite하고(목적지 경로 = 원본 경로),
// 이 앱에는 basePath가 없으며 assetPrefix는 정적 자산(_next/static)에만 붙는다.
// 따라서 revalidatePath에 넘길 경로는 app/ 아래 폴더 구조 그대로인 /zone/cache/... 이다.
export const BASE_PATH = '/zone/cache/functions/revalidate-path/dynamic-route'
export const PRODUCT_IDS = ['1', '2', '3'] as const
export const LITERAL_TARGET_ID = '1'

export const productPath = (id: string) => `${BASE_PATH}/products/${id}`
// 다이나믹 세그먼트를 포함한 라우트 "패턴" — 폴더 이름 그대로 [id]를 적는다.
export const PRODUCT_PATTERN = `${BASE_PATH}/products/[id]`

// iframe(상품 페이지) → 부모(허브) postMessage 식별자
export const SNAPSHOT_MESSAGE = 'functions-revalidate-path-dynamic-route:snapshot'
