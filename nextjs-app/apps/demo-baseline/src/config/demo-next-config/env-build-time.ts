import type { DemoConfigPart } from './types'

// 이 모듈은 단일 데모가 소유한다. source/경로는 반드시 해당 데모 경로로 한정한다.
// config/env/build-time-injection 데모의 실제 검증 대상 (next.config env 필드).
// env 필드는 source가 없고 앱 전체에 적용된다. 그래서 키를 DEMO_ENVFIELD_ 접두사로 한정하고 값은 무해한 학습용 문자열로 둔다.
// 값을 바꾸면 dev 서버를 재시작해야 반영된다. 이 값은 시크릿이 아니다.
export const ENV_FIELD_KEY = 'DEMO_ENVFIELD_BUILD_LABEL'
export const ENV_FIELD_VALUE = 'envfield-inlined-v1'

export const demoConfig: DemoConfigPart = {
  env: { [ENV_FIELD_KEY]: ENV_FIELD_VALUE },
}
