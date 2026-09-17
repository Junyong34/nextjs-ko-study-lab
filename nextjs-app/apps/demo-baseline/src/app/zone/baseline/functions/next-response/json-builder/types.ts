export const VALID_STATUS_CODES = [200, 201, 400, 404, 422, 500] as const

export type ValidStatusCode = (typeof VALID_STATUS_CODES)[number]

/** 화이트리스트에 없는 값을 클라이언트가 요청했을 때 서버가 대체하는 기본 상태 코드 */
export const FALLBACK_STATUS_CODE: ValidStatusCode = 200

/** 화이트리스트 밖 값을 일부러 요청해 서버의 상태 코드 검증을 관찰하는 실습용 상수 */
export const INVALID_PROBE_STATUS = 999

export interface StatusOption {
  code: ValidStatusCode
  label: string
}

export const STATUS_OPTIONS: StatusOption[] = [
  { code: 200, label: '200 OK (성공)' },
  { code: 201, label: '201 Created (생성)' },
  { code: 400, label: '400 Bad Request (검증실패)' },
  { code: 404, label: '404 Not Found (리소스없음)' },
  { code: 422, label: '422 Unprocessable (도메인오류)' },
  { code: 500, label: '500 Internal Server Error' },
]

export interface JsonBuilderResponseState {
  /** 클라이언트가 요청한 상태 코드 (화이트리스트 밖 값도 그대로 기록) */
  requestedStatus: number | null
  /** 서버가 실제로 반환한 HTTP 상태 코드 */
  httpStatus: number | null
  /** x-study-response-builder 응답 헤더 값 */
  builderHeader: string | null
  /** x-custom-header-auth 응답 헤더 값 */
  authHeader: string | null
  isSuccess: boolean
}
