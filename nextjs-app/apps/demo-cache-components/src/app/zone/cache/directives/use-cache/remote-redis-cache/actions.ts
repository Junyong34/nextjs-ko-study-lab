'use server'

import { updateTag } from 'next/cache'
import { outerRemoteCallsPrivate } from './nesting'
import { formatServerTime, type NestingViolationProbe, type StatsCategory } from './types'

/**
 * 중첩 규칙 위반을 실제로 실행해 Next.js가 던지는 에러를 그대로 관측한다.
 * 문서가 "Error!"라고만 적어 둔 것을 여기서는 실제 에러 이름·메시지·digest로 확인한다.
 */
export async function triggerNestingViolation(): Promise<NestingViolationProbe> {
  const checkedAt = formatServerTime(new Date())
  try {
    await outerRemoteCallsPrivate()
    return { ok: true, checkedAt }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    const digest = 'digest' in err && typeof (err as { digest?: unknown }).digest === 'string'
      ? (err as { digest: string }).digest
      : null
    return { ok: false, name: err.name, message: err.message, digest, checkedAt }
  }
}

/**
 * getDefaultCategoryStats / getRemoteCategoryStats가 이 category에 붙인 태그를 모두 무효화한다.
 * Server Action 안에서는 next@16.3.2가 read-your-own-writes를 보장하는 updateTag()를 쓴다
 * (revalidateTag()는 프로필 인자가 필수가 됐고, Server Action 밖에서 쓰는 용도로 문서가 구분한다).
 * 두 태그를 각각 무효화하는 것 자체가 "두 지시어 모두 cacheTag로 무효화할 수 있다"는
 * 공식 문서 설명("Good to know" 항목)을 그대로 실행하는 것이다.
 */
export async function revalidateCategoryTags(category: StatsCategory): Promise<void> {
  updateTag(`cache-remote-redis-cache:default:${category}`)
  updateTag(`cache-remote-redis-cache:remote:${category}`)
}
