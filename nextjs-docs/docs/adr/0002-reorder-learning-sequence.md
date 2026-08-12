# 학습 순서를 의존성 기준으로 재배열

Status: accepted

## 배경

[ADR 0001](./0001-mirror-official-sidebar-hierarchy.md)은 공식 사이드바의 계층과 순서를 그대로 미러링하기로 결정했다. 그 결과 Getting Started, Architecture처럼 공식 문서 자체가 순차적인 카테고리는 학습 순서로도 자연스럽게 기능했지만, Guides와 API Reference 하위 그룹 다수는 공식 사이드바가 알파벳순으로 나열되어 있어 "어느 것을 먼저 학습해야 하는가"라는 질문에 답을 주지 못했다.

## 결정

카테고리와 그 하위 메뉴에 실제 폴더 뎁스를 반영한 트리형 순번(`1.1`, `3.1.1` 등)을 부여한다. 순번을 정할 때는 다음 원칙을 따른다.

1. **의존성이 있는 항목**: 선행 개념을 먼저 배워야 하는 항목은 난이도·의존성 기준으로 재배열한다 (예: Guides의 캐싱·렌더링 개념 그룹을 앞으로, 마이그레이션·업그레이드를 뒤로).
2. **이미 순차적인 항목**: 공식 문서 자체가 이미 학습 순서를 반영하고 있으면(Getting Started, Architecture) 그대로 유지한다.
3. **독립적인 참조 목록**: 항목들이 서로 대체 가능하거나 필요할 때 찾아보는 참조형 목록이면(next.config.js 옵션, 개별 함수/훅, Testing 도구, Migrating 대상, Glossary 용어, Community 자료) 상위 그룹까지만 순번을 부여하고 그룹 내부 순서는 공식 문서 순서(대체로 알파벳)를 유지한다. 강제로 재배열하지 않는다.
4. **개별 md 파일명은 변경하지 않지만, 폴더명에는 번호를 붙인다**: 리프 `.md` 파일은 링크 부담이 커서 프리픽스를 붙이지 않고 각 `README.md`의 목록 표기에만 순번을 반영한다. 반면 카테고리·하위그룹 폴더(예: `1-getting-started`, `2-guides/2.44-testing`, `3-api-reference/3.1-file-conventions`)는 수가 적어 관리 가능하므로 번호 프리픽스를 붙여, 탐색기에서 폴더만 봐도 학습 순서가 보이게 한다.
5. **전체 통합 순번은 `PROGRESS.md`에서 관리**하며, 각 카테고리·하위그룹 `README.md`와 동일한 번호를 공유한다.

## 결과

- Guides 64개 항목을 테마 그룹(핵심 모델 → 캐싱 심화 → 데이터/폼 → 내비게이션/성능 → 스타일링 → 인증/보안 → 메타데이터/확장 → 아키텍처 패턴 → 테스트/디버깅 → 빌드/번들링 → 배포/운영 → 분석 → AI 도구 → 마이그레이션/업그레이드) 순으로 재배열했다.
- API Reference 하위 그룹 순서를 Directives 우선에서 File-system conventions → Components → Functions → Directives → Configuration → CLI → Adapters → Edge Runtime → Turbopack 순으로 조정했다 (실제로 자주 마주치는 순서를 앞에 배치).
- next.config.js(65개 옵션), Functions 내부 세부 순서 일부, Testing/Migrating/Upgrading/Client-side data fetching 하위 항목은 참조형 목록으로 판단해 원칙 3을 적용했다.
- ADR 0001의 "계층 미러링" 방침은 유지된다. 이번 결정은 계층 구조가 아니라 **학습 순서 표기**에만 관련된 수정이다.
