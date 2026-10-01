import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BASE, findPhoto } from '../data'
import { PhotoArt } from '../components/PhotoArt'

// 상세 라우트: 같은 name의 큰 hero. loading.tsx를 두지 않아 이동과 같은 commit에서 렌더되어야 morph 쌍이 만들어진다.
export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const photo = findPhoto(id)
  if (!photo) notFound()

  return (
    <div className="space-y-3 text-xs">
      <Link href={BASE} transitionTypes={['zoom-out']} className="text-blue-600 hover:underline dark:text-blue-400">
        ← 목록으로
      </Link>
      <PhotoArt photo={photo} className="h-56 w-full rounded-lg" />
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{photo.title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{photo.caption}</p>
    </div>
  )
}
