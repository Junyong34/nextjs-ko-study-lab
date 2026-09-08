'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { DemoDeepDiveCard, ExpectedActualPanel } from '@study/demo-kit'
export function VerificationFooter({ query, count, submitted }: { query: string; count: number; submitted: boolean }) {
  const pathname = usePathname()
  const params = useSearchParams()
  return <>
    <ExpectedActualPanel title="URL과 서버 검색어 비교"
      expected={<span>URL의 q에서 앞뒤 공백을 뺀 값과 서버 검색어가 같습니다. 결과가 없어도 정상 검색입니다.</span>}
      actual={<span className="break-all">{`실습 내부 URL: ${pathname}${params.size ? '?' + params.toString() : ''}\n서버 검색어: ${query || '(빈 값: 전체 상품)'}\n서버 검색 결과: ${count}건`}</span>}
      isMatched={submitted ? (params.get('q') ?? '').trim() === query : undefined}
      description={submitted ? '서버가 읽은 검색어를 현재 iframe URL과 비교합니다. 메모 유지 여부는 실습 화면에서 확인하세요.' : '검색을 제출하면 URL과 서버 검색어를 비교합니다.'} />
    <DemoDeepDiveCard title="Form 제출과 서버 검색">
      <p>문자열 action을 받은 next/form은 입력을 GET 쿼리로 전달합니다. 서버 페이지는 searchParams를 읽어 예시 상품을 검색합니다.</p>
      <p>검색 결과는 서버에서 만들고 공유 layout의 메모는 브라우저 상태로 남습니다. 전체 새로고침은 메모를 초기화합니다. 외부 주소창 대신 위 실습 내부 URL을 확인하세요.</p>
      <p>JavaScript를 사용하지 않는 환경에서는 HTML 폼 제출로 동작합니다. prefetch 여부와 JavaScript 미사용 동작은 이 검증 패널의 판정 범위에 포함하지 않습니다.</p>
    </DemoDeepDiveCard>
  </>
}
