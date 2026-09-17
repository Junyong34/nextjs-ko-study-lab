import { MOCK_PRODUCTS } from '@study/demo-kit'

export const BASE_PATH = '/zone/baseline/functions/generate-static-params/basic-ssg'

/**
 * generateStaticParams()가 반환하는 실제 목록과 동일한 소스(MOCK_PRODUCTS.isBest)에서
 * 파생시켜, "카탈로그에 표시되는 뱃지"와 "빌드 타임에 실제 SSG되는 상품"이
 * 항상 같은 데이터를 가리키도록 한다.
 */
export const POPULAR_PRODUCT_IDS = MOCK_PRODUCTS.filter((product) => product.isBest).map(
  (product) => product.id,
)
