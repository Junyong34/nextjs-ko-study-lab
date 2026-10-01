import Link from 'next/link'
import { BASE, PHOTOS } from './data'
import { PhotoArt } from './components/PhotoArt'

// 목록 라우트: 썸네일을 클릭하면 상세 라우트로 이동하며 같은 name의 요소가 확대 morph된다.
export default function PhotoListPage() {
  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {PHOTOS.map((photo) => (
        <li key={photo.id}>
          <Link href={`${BASE}/${photo.id}`} transitionTypes={['zoom-in']} className="block space-y-1.5 text-xs">
            <PhotoArt photo={photo} className="h-24 rounded-md" />
            <span className="block font-bold text-zinc-900 dark:text-zinc-100">{photo.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
