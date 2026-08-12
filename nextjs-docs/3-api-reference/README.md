# API Reference

> Next.js 공식 문서의 **API Reference** 메뉴를 기능별 참조 문서로 연결하기 위한 설계용 목차입니다.

- 공식 문서: [API Reference](https://nextjs.org/docs/app/api-reference)
- 상위 목차: [Next.js 학습 문서](../README.md)

## 하위 카테고리

> 공식 사이드바는 알파벳순이지만, 학습 순서는 의존성·난이도 기준으로 재배열했습니다 ([ADR 0002](../docs/adr/0002-reorder-learning-sequence.md)).

- 3.1 [File-system conventions](./3.1-file-conventions/README.md) (Metadata Files, Route Segment Config 하위 그룹 포함)
- 3.2 [Components](./3.2-components/README.md)
- 3.3 [Functions](./3.3-functions/README.md)
- 3.4 [Directives](./3.4-directives/README.md)
- 3.5 [Configuration](./3.5-config/README.md)
- 3.6 [CLI](./3.6-cli/README.md)
- 3.7 [Adapters](./3.7-adapters/README.md)
- 3.8 [Edge Runtime](./edge.md)
- 3.9 [Turbopack](./turbopack.md)

## 문서 작성 규칙

- 개념 설명과 API 계약을 분리합니다.
- 최소 예제와 실패 사례를 함께 설계합니다.
- 화면 데모가 적합하지 않은 API는 입력·출력·로그 중심으로 검증합니다.
- 하위 항목이 서로 독립적인 참조 목록(예: next.config.js 옵션, 개별 함수)인 경우 그룹까지만 순번을 부여하고 항목 순서는 공식 문서를 유지합니다.
