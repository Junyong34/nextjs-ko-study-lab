'use server'

/**
 * Server Action:
 * 일반 서버 함수는 RSC 경계를 통과할 수 없지만,
 * 'use server'로 선언된 Server Action은 고유 Action ID로 직렬화되어
 * Client Component의 Props로 안전하게 전달 및 실행될 수 있습니다.
 */
export async function executeServerTask(input: string) {
  const processedAt = new Date().toLocaleTimeString('ko-KR')
  return {
    success: true,
    result: `서버 액션 처리 완료: "${input}" (서버 시각: ${processedAt})`,
  }
}
