import type { Metadata } from 'next'
import Link from 'next/link'
import { getDemoMetadata } from '@study/demos'

// 비교용 하위 라우트: 상위 페이지와 달리 `icons: null`을 두지 않는다.
// 루트 layout.tsx의 metadata.icons가 그대로 상속되므로, 부모 세그먼트의
// icon.tsx / apple-icon.tsx가 있어도 파일 기반 아이콘 링크가 주입되지 않는다.
export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/metadata-app-icons/dynamic-favicon/no-reset',
)

export default function NoResetPage() {
  return (
    <div className="space-y-3 p-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
      <p>
        이 하위 라우트는 <code>metadata.icons</code>를 초기화하지 않은 비교용 페이지입니다. 부모 세그먼트의
        <code> icon.tsx</code>는 그대로 있지만, 루트 레이아웃이 설정한 <code>icons</code>가 우선 적용됩니다.
      </p>
      <Link
        href="/zone/baseline/file-conventions/metadata-app-icons/dynamic-favicon"
        className="font-semibold text-zinc-900 underline dark:text-zinc-100"
      >
        실습 페이지로 돌아가기
      </Link>
    </div>
  )
}
