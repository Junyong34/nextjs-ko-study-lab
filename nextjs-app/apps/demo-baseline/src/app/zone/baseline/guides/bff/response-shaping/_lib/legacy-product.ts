// 서버 전용 모듈: route.ts에서만 import한다. `_lib`는 private folder라 URL 라우트가 되지 않는다.
// 사내 레거시 상품 API의 "본체 로직"을 함수로 둔다.
//  - legacy/route.ts : 브라우저가 원본을 직접 받는 HTTP 경로 (가공 전 응답을 그대로 보여 주기 위한 대조군)
//  - bff/route.ts    : 같은 함수를 HTTP 없이 직접 호출한 뒤 모바일 카드 형태로 가공
// (가이드 Caveats: 서버에서 자기 Route Handler를 fetch하면 절대 URL + 추가 HTTP 왕복이 생기므로 함수로 직접 호출한다)
import type { LegacyEnvelope, LegacyProductData } from '../types'

interface CatalogSeed {
  name: string
  brand: string
  category: string[]
  listPrice: number
  salePrice: number
  costPrice: number
  totalQty: number
  reservedQty: number
  safetyQty: number
  options: string[]
  auditCount: number
  freeShip: boolean
  reviews: number[] // 1~5점 분포
}

// 레거시 DB에 있다고 가정한 상품 3건. 응답 크기는 이 데이터를 실제로 JSON 직렬화한 결과이며 화면에 고정값으로 적지 않는다.
const CATALOG: Record<string, CatalogSeed> = {
  'P-101': {
    name: '노이즈캔슬링 무선 이어폰 Pro',
    brand: 'SONIQ',
    category: ['디지털', '음향기기', '이어폰'],
    listPrice: 289000,
    salePrice: 239000,
    costPrice: 151000,
    totalQty: 140,
    reservedQty: 12,
    safetyQty: 20,
    options: ['미드나잇 블랙', '펄 화이트', '샌드 베이지', '딥 네이비'],
    auditCount: 24,
    freeShip: true,
    reviews: [3, 5, 21, 118, 402],
  },
  'P-102': {
    name: '경량 쿠셔닝 러닝화 270',
    brand: 'STRIDE',
    category: ['스포츠', '러닝', '러닝화'],
    listPrice: 159000,
    salePrice: 129000,
    costPrice: 64000,
    totalQty: 26,
    reservedQty: 9,
    safetyQty: 20,
    options: ['250', '255', '260', '265', '270', '275'],
    auditCount: 36,
    freeShip: true,
    reviews: [9, 11, 40, 210, 655],
  },
  'P-103': {
    name: '진공 단열 텀블러 500ml',
    brand: 'KEEPWARM',
    category: ['생활', '주방', '텀블러'],
    listPrice: 32000,
    salePrice: 32000,
    costPrice: 11800,
    totalQty: 8,
    reservedQty: 8,
    safetyQty: 10,
    options: ['스틸', '올리브'],
    auditCount: 12,
    freeShip: false,
    reviews: [1, 2, 6, 30, 88],
  },
}

const SVR_NODE = 'prd-api-03.corp.internal:8443'
const IMG_SIZES = [
  { TYPE: 'THUMB_S', W: 160, H: 160 },
  { TYPE: 'THUMB_M', W: 480, H: 480 },
  { TYPE: 'DETAIL', W: 1080, H: 1080 },
  { TYPE: 'ZOOM', W: 2160, H: 2160 },
  { TYPE: 'ORIGIN', W: 4000, H: 4000 },
] as const

const pad = (n: number, width = 2) => String(n).padStart(width, '0')

function buildProduct(id: string, seed: CatalogSeed): LegacyProductData {
  const num = id.slice(2)
  const reviewCount = seed.reviews.reduce((a, b) => a + b, 0)
  const scoreSum = seed.reviews.reduce((acc, cnt, i) => acc + cnt * (i + 1), 0)

  return {
    PRD_NO: id,
    PRD_INFO: {
      PRD_NM: seed.name,
      BRAND_NM: seed.brand,
      CTGRY_PATH: seed.category,
      DESC_HTML: `<div class="prd-desc"><h2>${seed.name}</h2>${seed.category
        .map((c) => `<p>${c} 카테고리 인기 상품입니다. 상세 스펙과 사용 안내는 상세 이미지를 참고해 주세요.</p>`)
        .join('')}<ul><li>제조사: ${seed.brand}</li><li>A/S: 구매일로부터 1년</li><li>원산지: 상세페이지 참조</li></ul></div>`,
      SEO: {
        TITLE: `${seed.brand} ${seed.name} 최저가`,
        KEYWORDS: [seed.brand, ...seed.category, seed.name],
        CANONICAL: `https://shop.example.com/products/${id}`,
      },
    },
    PRICE_INFO: {
      LIST_PRC: seed.listPrice,
      SALE_PRC: seed.salePrice,
      COST_PRC: seed.costPrice,
      MARGIN_RT: Math.round(((seed.salePrice - seed.costPrice) / seed.salePrice) * 1000) / 10,
      PRICE_POLICY_ID: `PP-2026-${num}-B2C`,
      CURRENCY_CD: 'KRW',
    },
    STOCK_INFO: {
      WH_CD: 'WH-ICN-A',
      WH_INTERNAL_SKU: `WHS-${num}-000`,
      TOT_QTY: seed.totalQty,
      RSV_QTY: seed.reservedQty,
      SAFETY_QTY: seed.safetyQty,
    },
    SUPPLIER: {
      SUPPLIER_CD: `SUP-${num}7`,
      SUPPLIER_NM: `${seed.brand} 코리아`,
      CONTRACT_NO: `CT-2025-${num}-0042`,
      SETTLE_ACCT: `국민 000-12-${num}4567`,
    },
    IMG_LIST: IMG_SIZES.map((s) => ({ ...s, URL: `https://img.example.com/prd/${id}/${s.TYPE.toLowerCase()}.jpg` })),
    OPT_LIST: seed.options.map((opt, i) => ({
      OPT_CD: `${id}-O${pad(i + 1)}`,
      OPT_NM: opt,
      ADD_PRC: 0,
      STOCK_QTY: Math.floor(seed.totalQty / seed.options.length),
      WH_INTERNAL_SKU: `WHS-${num}-${pad(i + 1, 3)}`,
    })),
    REVIEW_SUMMARY: {
      AVG_SCORE: scoreSum / reviewCount,
      CNT: reviewCount,
      SCORE_DIST: seed.reviews,
    },
    SHIP_POLICY: {
      FREE_SHIP_YN: seed.freeShip ? 'Y' : 'N',
      SHIP_FEE: seed.freeShip ? 0 : 3000,
      RETURN_ADDR: '인천광역시 중구 공항물류로 00 A동 반품센터',
    },
    AUDIT_LOG: Array.from({ length: seed.auditCount }, (_, i) => ({
      ACT_DTM: `2026${pad((i % 9) + 1)}${pad((i % 27) + 1)}1${pad(i % 10, 1)}3000`,
      ADMIN_ID: `admin.${['kim', 'lee', 'park'][i % 3]}`,
      ACT_CD: ['PRICE_UPD', 'STOCK_ADJ', 'DESC_UPD'][i % 3],
      BEFORE_VAL: String(seed.salePrice + (i + 1) * 1000),
      AFTER_VAL: String(seed.salePrice + i * 1000),
    })),
    INTERNAL_MEMO: `공급사 ${seed.brand} 단가 재협상 예정. 원가 인상 시 판매가 동결 여부 MD 확인 필요.`,
    REG_DTM: '20250302101500',
    UPD_DTM: '20260917143210',
    USE_YN: 'Y',
    DEL_YN: 'N',
  }
}

/**
 * 레거시 상품 조회. 입력 검증을 하지 않아 잘못된 ID도 그대로 "DB 조회"를 시도하고,
 * 실패하면 HTTP 상태 대신 RESULT_CD와 내부 스택을 봉투에 담아 돌려준다.
 */
export function getLegacyProduct(id: string): LegacyEnvelope {
  const traceId = `TRC-${Date.now().toString(36)}`
  if (!/^P-\d+$/.test(id)) {
    return {
      RESULT_CD: 'E500',
      RESULT_MSG: 'ORA-01722: invalid number',
      SVR_NODE,
      TRACE_ID: traceId,
      ERR_STACK:
        'java.sql.SQLSyntaxErrorException: ORA-01722\n\tat com.corp.prd.dao.ProductDao.selectById(ProductDao.java:118)\n\tat com.corp.prd.api.ProductController.get(ProductController.java:52)',
    }
  }
  const seed = CATALOG[id]
  if (!seed) {
    return { RESULT_CD: 'E404', RESULT_MSG: 'NO DATA FOUND', SVR_NODE, TRACE_ID: traceId }
  }
  return { RESULT_CD: '0000', RESULT_MSG: 'SUCCESS', SVR_NODE, TRACE_ID: traceId, DATA: buildProduct(id, seed) }
}
