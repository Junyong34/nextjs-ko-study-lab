import type { ProbeTarget, TermsDoc, TermsLang } from './types'

export const BASE_PATH = '/zone/baseline/guides/public-pages/terms-ssg'

/** 브라우저에서 동의 여부를 기록하는 쿠키 (데모 접두사 사용) */
export const AGREED_COOKIE = 'terms-ssg-agreed'

/**
 * 약관 원문 저장소. 실제 서비스라면 CMS·DB에서 읽겠지만, 이 데모는 외부 네트워크 없이
 * 모듈 상수로 둔다. 핵심은 "사용자와 무관하게 lang/version만으로 내용이 결정된다"는 점이다.
 */
export const TERMS_DOCS: TermsDoc[] = [
  {
    lang: 'ko',
    version: '2025-07',
    title: '서비스 이용약관 (구버전)',
    effectiveDate: '2025-07-01',
    articles: [
      { heading: '제1조 (목적)', body: '이 약관은 회사가 제공하는 온라인 쇼핑 서비스의 이용 조건과 절차를 정합니다.' },
      { heading: '제2조 (청약 철회)', body: '회원은 상품을 받은 날부터 7일 이내에 청약을 철회할 수 있습니다.' },
    ],
  },
  {
    lang: 'ko',
    version: '2026-03',
    title: '서비스 이용약관',
    effectiveDate: '2026-03-01',
    articles: [
      { heading: '제1조 (목적)', body: '이 약관은 회사가 제공하는 온라인 쇼핑 서비스의 이용 조건과 절차를 정합니다.' },
      { heading: '제2조 (청약 철회)', body: '회원은 상품을 받은 날부터 7일 이내에 청약을 철회할 수 있습니다.' },
      { heading: '제3조 (정기 배송)', body: '정기 배송 상품은 다음 결제일 3일 전까지 해지하면 다음 회차부터 청구되지 않습니다.' },
    ],
  },
  {
    lang: 'en',
    version: '2026-03',
    title: 'Terms of Service',
    effectiveDate: '2026-03-01',
    articles: [
      { heading: 'Article 1 (Purpose)', body: 'These terms govern the use of the online shopping service provided by the company.' },
      { heading: 'Article 2 (Withdrawal)', body: 'Members may withdraw an order within 7 days of receiving the goods.' },
      { heading: 'Article 3 (Subscriptions)', body: 'Subscriptions cancelled 3 days before the next billing date are not charged again.' },
    ],
  },
]

/** 가장 최신 버전 (with-cookies 대조 라우트와 링크 기본값에 사용) */
export const LATEST_VERSION = '2026-03'

export function findTerms(lang: string, version: string): TermsDoc | undefined {
  return TERMS_DOCS.find((d) => d.lang === lang && d.version === version)
}

export const documentHref = (lang: TermsLang | string, version: string) => `${BASE_PATH}/documents/${lang}/${version}`
export const withCookiesHref = (version: string) => `${BASE_PATH}/with-cookies/${version}`

/**
 * 실측 대상. 앞의 셋은 generateStaticParams가 반환하는 조합이고,
 * 뒤의 둘은 저장소에 없는 조합(없는 버전, 한국어에만 있는 버전의 영문판)이다.
 */
export const PROBE_TARGETS: ProbeTarget[] = [
  ...TERMS_DOCS.map((d) => ({
    key: `${d.lang}-${d.version}`,
    href: documentHref(d.lang, d.version),
    label: `documents/${d.lang}/${d.version}`,
    kind: 'prebuilt' as const,
  })),
  { key: 'ko-2019-01', href: documentHref('ko', '2019-01'), label: 'documents/ko/2019-01', kind: 'unknown' },
  { key: 'en-2025-07', href: documentHref('en', '2025-07'), label: 'documents/en/2025-07', kind: 'unknown' },
  {
    key: 'with-cookies',
    href: withCookiesHref(LATEST_VERSION),
    label: `with-cookies/${LATEST_VERSION}`,
    kind: 'runtime-api',
  },
]

/** 한 번의 실측에서 URL마다 보낼 요청 수 */
export const SAMPLES_PER_TARGET = 3
