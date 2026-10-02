import { CurrentAddress } from '../components/CurrentAddress'
import { BASE } from '../lib/cases'

// 슬래시 정규화 대상이 되는 실제 페이지. 끝 슬래시 URL로 들어와도 308을 따라온 뒤의 주소를 보여 준다.
export default function CatalogPage() {
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="font-bold text-zinc-900 dark:text-zinc-100">러닝화 카탈로그</h2>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        url-normalization/catalog/page.tsx 가 그린 실제 페이지입니다.
      </p>
      <CurrentAddress />
      <a href={BASE} className="inline-block text-xs underline underline-offset-4">
        실습 화면으로 돌아가기
      </a>
    </div>
  )
}
