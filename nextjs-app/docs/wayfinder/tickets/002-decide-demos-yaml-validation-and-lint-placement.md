# [T02] demos.yaml 검증 방식 및 URL lint 위치 결정

- **라벨**: `wayfinder:grilling`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Open (Frontier)
- **차단 중**: [T05. @study/demos 패키지 구성 및 유효성 검사기 구현](./005-setup-packages-demos.md)

## Question

1. **`demos.yaml`의 타입 및 유효성 검증 수단**:
   - `Zod` 스키마 런타임 검증 + TypeScript 타입 추론 (`z.infer`)
   - `JSON Schema` (에디터 자동완성 중심)
   - 아예 `demos.ts`로 전환할 것인가, 아니면 YAML의 빠른 가독성과 grep 편의성을 유지할 것인가?
2. **문서 URL 규칙(번호 제거 미러링) lint의 배치 위치**:
   - `@study/docs`의 `build` 스크립트 (md 파일 훑는 김에 검사)
   - `@study/demos`의 `lint` 스크립트 (모든 데모/문서 정합성 lint를 한곳에서 집약)

### 결정 기준
- 오타(`zone: cahce`)나 중복 URL을 빌드/린트 시점에 즉각 잡을 수 있는가?
- YAML의 사람 친화적 장점을 유지하면서 완벽한 타입 안전성을 확보할 수 있는가?
