# AGENTS.md

## 커밋 작성 규칙

커밋 메시지는 다음 형식을 사용합니다.

```text
[$GIT_BRANCH_NAME][prefix]: title

- code update message
```

- `$GIT_BRANCH_NAME`: 현재 작업 중인 Git 브랜치 이름
- `prefix`: 변경 사항의 성격을 나타내는 접두사
- `title`: 변경 내용을 간결하게 요약한 제목
- `code update message`: 변경한 내용을 설명하는 본문

### Prefix 목록

| Prefix | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `add` | 모듈 및 라이브러리 추가 |
| `fix` | 오류 및 오타 수정 |
| `docs` | 마크다운 및 문서 작업 |
| `refactor` | 코드 리팩토링 |
| `perf` | 성능 개선 |
| `test` | 테스트 코드 관련 작업 |
| `build` | 빌드 시스템 관련 작업 |
| `ci` | CI 관련 설정 작업 |
| `revert` | 이전 작업 취소 |

### 작성 예시

```text
[feature/login][feat]: 로그인 기능 추가

- 로그인 폼과 인증 요청 로직을 추가했습니다.
```
