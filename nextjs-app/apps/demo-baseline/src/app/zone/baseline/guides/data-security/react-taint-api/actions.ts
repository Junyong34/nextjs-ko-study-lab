'use server'

import { getPaymentConfig } from './lib/taintedPaymentConfig'

// 네 액션 모두 "클라이언트로 무엇을 반환하는가"만 다르다. 차단 여부는 React의 직렬화 단계가 결정한다.

/** 마스킹된 값만 반환 — 시크릿이 경계를 넘지 않는 올바른 패턴. */
export async function returnMaskedAction() {
  const config = getPaymentConfig()
  return { merchantId: config.merchantId, maskedKey: `${config.secretKey.slice(0, 7)}****` }
}

/** 오염된 config 객체 참조를 그대로 반환 — taintObjectReference가 차단해야 한다. */
export async function returnTaintedObjectAction() {
  return getPaymentConfig()
}

/** 오염된 secretKey 문자열을 그대로 반환 — taintUniqueValue가 차단해야 한다. */
export async function returnTaintedValueAction() {
  return { value: getPaymentConfig().secretKey }
}

/** 시크릿을 문자열로 가공(파생)해 반환 — 파생 값은 추적되지 않아 taint를 우회한다. */
export async function returnDerivedValueAction() {
  return { value: `key=${getPaymentConfig().secretKey}` }
}
