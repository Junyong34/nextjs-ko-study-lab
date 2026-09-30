import { connection } from 'next/server'
import { RuntimeEnvLab } from './components/RuntimeEnvLab'
import { snapshotServerEnv } from './lib/serverEnv'

export default async function DemoPage() {
  // 프리렌더링은 여기서 멈추고, 아래 코드는 요청 시점에만 실행된다 (공식 문서의 런타임 환경변수 패턴).
  await connection()
  const serverSnapshot = snapshotServerEnv('server-render')
  return <RuntimeEnvLab serverSnapshot={serverSnapshot} />
}
