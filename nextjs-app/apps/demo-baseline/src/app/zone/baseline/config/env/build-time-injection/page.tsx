import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { ENV_FIELD_KEY, ENV_FIELD_VALUE } from '@/config/demo-next-config/env-build-time'
import { BuildTimeLab } from './components/BuildTimeLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/env/build-time-injection')

export default function DemoPage() {
  // 선언값과 식별자 문자열은 서버에서 props로 넘긴다. 클라이언트 번들에 리터럴로 넣으면 청크 검색이 자기 자신을 찾게 된다.
  return <BuildTimeLab expectedValue={ENV_FIELD_VALUE} rawIdentifier={`process.env.${ENV_FIELD_KEY}`} />
}
