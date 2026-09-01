import { siteConfig } from './config'

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'ko',
  }
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
}

/** 문서/데모 상세 페이지 공통 2단계 브레드크럼(홈 → 현재 페이지). 카테고리 계층을 반영한 세분화는 후속 과제로 남긴다 */
export function buildBreadcrumbJsonLdFor(page: { title: string; url: string }) {
  return buildBreadcrumbJsonLd([
    { name: siteConfig.shortName, url: '/' },
    { name: page.title, url: page.url },
  ])
}

export function buildLearningResourceJsonLd(input: { title: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: input.title,
    description: input.description,
    url: `${siteConfig.url}${input.url}`,
    inLanguage: 'ko',
    learningResourceType: 'Guide',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}
