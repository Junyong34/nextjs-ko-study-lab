export type Transport = 'http-host' | 'fetch-host' | 'fetch-forwarded'

export interface Scenario {
  id: string
  title: string
  transport: Transport
  /** 보내려는 호스트 */
  host: string
  /** 기대하는 테넌트 id. 없으면 null */
  expectTenant: string | null
  /** 서버가 우리가 보낸 값을 그대로 받아야 하는가 (fetch 의 Host 는 무시되므로 false) */
  expectHonored: boolean
  note: string
}

export const TRANSPORT_LABEL: Record<Transport, string> = {
  'http-host': 'node:http · Host 헤더',
  'fetch-host': 'fetch · Host 헤더',
  'fetch-forwarded': 'fetch · x-forwarded-host 헤더',
}

export const SCENARIOS: Scenario[] = [
  { id: 'acme', title: 'acme 서브도메인', transport: 'http-host', host: 'acme.localhost:3001', expectTenant: 'acme', expectHonored: true, note: '첫 라벨 acme → 등록된 테넌트' },
  { id: 'globex', title: 'globex 서브도메인', transport: 'http-host', host: 'globex.localhost:3001', expectTenant: 'globex', expectHonored: true, note: '같은 라우트인데 Host 만 달라 다른 테넌트' },
  { id: 'umbrella', title: '미등록 서브도메인', transport: 'http-host', host: 'umbrella.localhost:3001', expectTenant: null, expectHonored: true, note: '라벨은 umbrella, 설정이 없어 테넌트 없음' },
  { id: 'apex', title: '루트 도메인', transport: 'http-host', host: 'localhost:3001', expectTenant: null, expectHonored: true, note: '서브도메인이 없어 테넌트 없음' },
  { id: 'fetch-host', title: 'fetch 로 Host 지정', transport: 'fetch-host', host: 'acme.localhost:3001', expectTenant: null, expectHonored: false, note: 'Node fetch 는 Host 를 덮어쓰지 못한다' },
  { id: 'forwarded', title: 'x-forwarded-host 사용', transport: 'fetch-forwarded', host: 'initech.localhost:3001', expectTenant: 'initech', expectHonored: true, note: 'fetch 로도 전달 가능한 우회 규약' },
]

export const getScenario = (id: string) => SCENARIOS.find((s) => s.id === id)
