import 'server-only'
import type { Locale } from './locales'

/**
 * 서버에서만 실행되는 아주 작은 사전. JSON 사전 분리·번들 검증은 dictionary-translation 실습이 다룬다.
 * 여기서는 "경로의 [lang]이 서버 렌더링 결과를 바꾼다"는 것만 보이면 되므로 문자열만 둔다.
 */
const dictionaries = {
  ko: {
    heading: '상품 목록',
    addToCart: '장바구니 담기',
    back: '목록으로',
    currency: 'KRW',
    products: { '101': '러닝화 에어 라이트', '102': '방수 트레킹 재킷', '103': '데일리 백팩' },
    prices: { '101': 129000, '102': 189000, '103': 79000 },
  },
  en: {
    heading: 'Products',
    addToCart: 'Add to Cart',
    back: 'Back to list',
    currency: 'USD',
    products: { '101': 'Air Light Running Shoes', '102': 'Waterproof Trekking Jacket', '103': 'Daily Backpack' },
    prices: { '101': 99, '102': 149, '103': 59 },
  },
  ja: {
    heading: '商品一覧',
    addToCart: 'カートに入れる',
    back: '一覧へ戻る',
    currency: 'JPY',
    products: { '101': 'エアライト ランニングシューズ', '102': '防水トレッキングジャケット', '103': 'デイリーバックパック' },
    prices: { '101': 14800, '102': 21800, '103': 8900 },
  },
} satisfies Record<Locale, unknown>

export const PRODUCT_IDS = ['101', '102', '103'] as const
export type ProductId = (typeof PRODUCT_IDS)[number]

export const getDictionary = async (lang: Locale) => dictionaries[lang]

export const formatPrice = (lang: Locale, value: number) =>
  new Intl.NumberFormat(lang, { style: 'currency', currency: dictionaries[lang].currency, maximumFractionDigits: 0 }).format(value)
