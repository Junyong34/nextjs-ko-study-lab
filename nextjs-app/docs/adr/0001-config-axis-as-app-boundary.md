---
status: accepted
date: 2026-08-18
---

# 전역 설정 충돌을 앱 경계로 삼고 Multi-Zones로 결합한다

학습 문서가 가르쳐야 할 개념 중 상당수(`cacheComponents`, `partialPrefetching`, `output: 'export'`, `proxy`·`basePath`)가 **앱 전역 설정**이라 한 `next.config` 안에 공존할 수 없다. 그래서 "하나의 `next.config`로 동시에 성립하는 데모들의 묶음"을 하나의 앱으로 삼고, 그렇게 나뉜 앱들을 Multi-Zones(셸의 `rewrites` + zone별 `assetPrefix`)로 한 도메인에 결합한다. 학습 카테고리는 앱 경계가 아니다 — 카테고리로 나누면 앱을 나눌 기술적 이유가 없을 뿐 아니라, 한 카테고리 안에서 켠 상태와 끈 상태를 둘 다 보여줘야 하는 상황에 바로 무너진다.

## Considered Options

- **학습 카테고리 5개를 앱 5개로**: 문서 사이드바 구조([ADR 0001 of nextjs-docs](../../../nextjs-docs/docs/adr/0001-mirror-official-sidebar-hierarchy.md))와 대칭이라 직관적이지만, 같은 결과를 한 앱의 라우트로 100% 얻을 수 있어 앱을 나눌 이유가 되지 못한다. 설정 충돌도 해결하지 못한다.
- **데모를 라이브러리 패키지로 만들어 셸이 import (빌드타임 결합)**: `cacheComponents`는 컴포넌트가 아니라 앱 전역 설정이므로 import로는 재현되지 않는다. 이 선택지는 설정 충돌 앞에서 원리적으로 불가능하다.
- **앱 1개로 시작해 충돌이 생길 때마다 분리 (YAGNI)**: 합리적이지만, 충돌이 이미 다섯 축이나 식별돼 있어 "생길 때"가 곧 착수 직후다. 사후 분리 비용이 사전 설계 비용보다 크다.

## Consequences

- zone 수만큼 배포 단위가 늘고, zone 추가 시 셸의 `rewrites`와 환경변수를 함께 손봐야 한다.
- zone 경계를 넘는 이동은 hard navigation이 되며, 그 링크에는 `<Link>`가 아닌 `<a>`를 써야 한다.
- 부수 효과로 이 사이트 자체가 [2.43 Multi-zones](../../../nextjs-docs/2-guides/multi-zones.md)의 살아 있는 데모가 된다. 그 문서의 데모를 따로 만들 필요가 없다.
- 충돌 축 5개를 모두 설계에 기록하되, 앱은 `shell`·`demo-baseline`·`demo-cache-components` 3개부터 만든다. 이 3개로 Multi-Zones 구조 전체가 검증되고, 나머지는 같은 패턴의 반복이라 구조적 위험이 없다.
