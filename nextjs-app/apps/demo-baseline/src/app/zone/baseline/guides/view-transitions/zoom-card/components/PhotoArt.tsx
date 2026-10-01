import { ViewTransition } from 'react'
import { MORPH_CLASS, photoVtName, type Photo } from '../data'

// 목록 썸네일과 상세 hero가 같은 name을 가지므로 브라우저가 둘을 하나의 요소로 morph한다.
// default="none": 이 요소가 관련 없는 전환에서 혼자 crossfade하지 않게 한다. share는 반드시 함께 지정한다.
export function PhotoArt({ photo, className }: { photo: Photo; className: string }) {
  return (
    <ViewTransition name={photoVtName(photo.id)} share={MORPH_CLASS} default="none">
      <div className={className} style={{ background: photo.gradient }} role="img" aria-label={photo.title} />
    </ViewTransition>
  )
}
