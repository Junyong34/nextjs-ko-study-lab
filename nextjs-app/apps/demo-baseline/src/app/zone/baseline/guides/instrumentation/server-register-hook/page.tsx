import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { RegisterHookLab } from './components/RegisterHookLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instrumentation/server-register-hook')

// register()가 남긴 값은 이 페이지가 아니라 api/node·api/edge·api/fail Route Handler가 응답할 때 읽는다.
// 같은 snapshot을 페이지 렌더 시점에 읽는 관점은 file-conventions/instrumentation/server-boot-log 데모가 다룬다.
export default function DemoPage() {
  return <RegisterHookLab />
}
