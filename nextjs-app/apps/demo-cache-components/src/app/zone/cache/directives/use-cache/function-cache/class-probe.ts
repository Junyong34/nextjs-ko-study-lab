'use cache'
// 파일 수준 'use cache': 이 파일에서 export되는 async 함수는 모두 캐시 함수가 된다.

class PriceSummary {
  constructor(
    readonly category: string,
    readonly createdAt: string,
  ) {}
  label() {
    return `${this.category} 요약`
  }
}

/** 클래스 인스턴스를 그대로 반환한다. 공식 문서상 지원되지 않는 반환 타입이다. */
export async function getSummaryInstance(category: string) {
  return new PriceSummary(category, new Date().toISOString())
}
