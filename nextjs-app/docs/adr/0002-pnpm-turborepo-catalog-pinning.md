---
status: accepted
date: 2026-08-18
---

# pnpm workspaces + Turborepo를 쓰고, 기준 버전은 catalog에 정확 고정한다

여러 zone이 같은 Next.js 버전을 쓰도록 **도구가 강제**해야 하는데, pnpm의 `catalog:`가 이를 문법 수준에서 보장한다 — 루트 `pnpm-workspace.yaml`에 `next: 16.3.1`을 한 번 적고 각 앱이 `"next": "catalog:"`로 참조하면 버전이 갈라질 수가 없다. Turborepo는 zone 여러 개의 dev 서버를 한 명령으로 띄우고(Multi-Zones는 rewrites 목적지가 살아 있어야 개발이 되므로 필수), `dependsOn: ["^build"]`로 `nextjs-docs`의 md 변경이 셸의 빌드 캐시를 정확히 무효화하게 한다. 워크스페이스 루트는 저장소 루트에 두어 `nextjs-docs`를 `@study/docs` 패키지로 편입한다.

버전은 캐럿 없이 **정확히** 고정한다.

## Considered Options

- **npm workspaces + Turborepo**: catalog가 없다. `overrides`로 흉내 낼 수 있지만 그것은 의존성 충돌 해결 장치이지 버전 선언 장치가 아니라 의도가 드러나지 않는다.
- **Nx**: 기능은 더 넓지만 Nx 고유 개념(프로젝트 그래프, executor, generator)을 함께 배워야 한다. 이 저장소의 주제는 Next.js이며, zone 3~6개 규모에서 그 학습 비용은 회수되지 않는다.
- **캐럿 범위(`^16.3.0`)**: lockfile이 있으니 재현성은 확보되지만, `nextjs-docs/README.md`가 규정한 "버전이 올라가면 값을 갱신하고 관련 완료 문서를 재검토 대상으로 표시한다"는 규칙이 **발동하지 않는다.** 버전 고정의 목적은 설치 재현성보다 문서 정합성이다.
- **`nextjs-app/`을 독립 워크스페이스 루트로**: Phase 1/2 분리는 더 깔끔하지만 `nextjs-docs`가 워크스페이스 밖이 되어, md를 고쳐도 turbo가 셸의 빌드 캐시를 무효화하지 못한다. 원인이 코드에 없어 추적이 어려운 종류의 문제다.

## Consequences

- 기준 버전을 올리는 일은 항상 `pnpm-workspace.yaml`의 눈에 보이는 diff가 되고, 그 커밋에서 `nextjs-docs/README.md` 갱신과 완료 문서 재검토 판단이 함께 일어난다.
- `nextjs-docs`에 `package.json`과 매니페스트 생성 스크립트가 생긴다. 문서만 있던 디렉토리에 빌드 산출물 개념이 들어오는 것은 이 결정의 대가다.
- `@study/docs`에 build 태스크가 없으면 md 변경이 캐시를 무효화하지 못한다. 임시 우회는 `globalDependencies`이지만 md 한 줄 수정이 모든 zone의 캐시를 날린다.
