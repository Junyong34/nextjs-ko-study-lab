/**
 * 클래스 문자열을 이어 붙입니다.
 *
 * 일부러 `tailwind-merge`를 쓰지 않습니다. 충돌 병합은 클래스 문자열을 예측할 수 없게
 * 바꾸는데, 이 저장소는 렌더된 DOM의 클래스 집합을 회귀 검증에 쓰고 있습니다.
 * 충돌은 병합으로 감추지 말고 호출부에서 없애는 편이 낫습니다.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
