import Link from 'next/link'

export default function InstantPrefetchDetailPage() {
  return (
    <div className="space-y-3 p-6 text-sm text-zinc-800 dark:text-zinc-200">
      <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
        상품 상세 (실제 서브 라우트)
      </h1>
      <p>
        이 페이지는 <code>instant-prefetch/detail/page.tsx</code>로 존재하는 실제 Next.js 라우트
        세그먼트입니다. 이전 화면의 <code>{'<Link href=".../instant-prefetch/detail">'}</code>가
        실제로 이동시키는 목적지이며, 탭 전환을 흉내 낸 것이 아니라 진짜 클라이언트 사이드
        전환(soft navigation)이 일어난 결과입니다.
      </p>
      <Link
        href="/zone/baseline/file-conventions/route-segment-config/instant-prefetch"
        className="inline-block rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
      >
        ← 실습 화면으로 돌아가기
      </Link>
    </div>
  )
}
