import { notFound } from 'next/navigation'

// 예전 동작(미매칭 슬롯이면 404)을 유지하고 싶을 때 문서가 안내하는 패턴이다.
export default function Default() {
  notFound()
}
