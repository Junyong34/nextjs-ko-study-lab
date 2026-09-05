# GitHub Issue Triage Runbook

이 문서는 유지관리자용 초기 분류 기준입니다. 공개 이슈의 세부정보를 다른 댓글이나 문서에 재인용하지 않습니다.

## 선행 조건

Issue Form을 기본 브랜치에 공개하기 전에 다음 상태를 확인합니다.

- GitHub 라벨 catalog가 아래 표와 일치합니다.
- Private Vulnerability Reporting이 활성화되어 있습니다.
- 저장소 owner/admin인 주 담당자와 가능한 경우 백업 담당자가 Security alerts와 이메일 알림을 구독합니다.
- 비특권 테스트 계정으로 민감정보가 없는 private report를 한 번 제출하고, 지정 담당자의 실제 수신과 비공개 정리까지 확인합니다.
- 공개 보안 노출을 조정할 권한과 담당자를 확인합니다. 권한이 없으면 Issue Form 공개를 중단합니다.

## 라벨 catalog

Form이 자동으로 붙이는 라벨은 저장소에 먼저 존재해야 합니다. 라벨 이름을 바꾸면 Form과 이 문서를 함께 갱신합니다.

| 차원 | 라벨 | 사용 기준 |
| --- | --- | --- |
| 종류 | `kind:documentation` | 학습 문서 오류 |
| 종류 | `kind:bug` | 예제·데모·사이트 동작 오류 |
| 종류 | `kind:feature` | 기능 제안 |
| 종류 | `kind:question` | 저장소 학습·데모 질문 |
| 영역 | `area:nextjs-docs` | `nextjs-docs/` 원본 문서 |
| 영역 | `area:nextjs-app` | `nextjs-app/` 데모 사이트 |
| 영역 | `area:repository` | 루트 정책·구성·운영 |
| 단계 | `phase:1` | 문서화 단계 |
| 단계 | `phase:2` | 데모 앱 단계 |
| 단계 | `phase:cross-cutting` | 두 컨텍스트 또는 루트에 걸친 작업 |
| 상태 | `status:needs-triage` | 새 이슈의 초기 상태 |
| 상태 | `status:needs-info` | 확인에 필요한 근거가 부족한 상태 |
| 상태 | `status:deferred` | Phase Gate 또는 시점 때문에 보류한 상태 |
| 종료 | `duplicate` | 기존 이슈와 중복 |
| 종료 | `invalid` | 저장소 범위나 제출 기준에 맞지 않음 |
| 종료 | `wontfix` | 검토했으나 진행하지 않음 |

`phase:*`는 적용 단계 분류이며 실행 허가가 아닙니다. `area:*`는 영향을 받는 저장소 영역입니다.

## 초기 triage 순서

1. **보안 노출:** 본문·댓글·첨부에 취약점 세부정보, 토큰·credential, 개인정보가 있는지 확인합니다.
2. **중복:** open·closed 이슈를 검색하고 동일한 원본 이슈를 확인합니다.
3. **정보 충족:** Form의 대상, 현재·기대 결과, 재현·공식 근거를 확인합니다. 부족하면 `status:needs-info`를 붙이고 필요한 항목을 구체적으로 요청합니다.
4. **범위:** 기본 브랜치 또는 식별 가능한 배포 URL에서 확인되는지 판단합니다. 로컬 WIP·미병합 커밋만을 근거로 한 공개 사이트 버그는 보류합니다.
5. **Phase Gate:** 문서화 작업은 Phase 1 기준으로 처리하고, 앱 작업은 현재 공개 상태와 저장소 규칙을 확인합니다. Phase 2는 이미 착수됐으며, 공개 상태는 `nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md`를 따릅니다.
6. **분류:** `area:*`, `phase:*`를 보완하고 `status:needs-triage`를 제거합니다. 접수는 구현 일정이나 채택을 보장하지 않는다는 점을 댓글에 남깁니다.
7. **결론:** 정보 요청, 접수, 보류, 중복 또는 범위 밖 종료 중 하나를 기록합니다.

## 종료 기준

- **중복:** 원본을 가리키는 `Duplicate of #N` 댓글을 남기고 `duplicate`를 붙인 뒤 종료합니다.
- **정보 부족:** `status:needs-info`를 붙이고 필요한 근거를 요청합니다. 평가할 정보가 끝내 오지 않으면 사유를 남기고 종료합니다.
- **보류:** `status:deferred`와 보류 이유를 남깁니다. Phase Gate를 이슈 등록만으로 우회하지 않습니다.
- **범위 밖·미진행:** 정책 링크와 간단한 이유를 남기고 `invalid` 또는 `wontfix`를 붙인 뒤 종료합니다.
- **접수:** `status:needs-triage`를 제거하고 영역·단계 라벨과 검토 결과를 남깁니다. 접수는 일정 확정이 아닙니다.

## 보안 노출 대응

1. 취약점 내용을 재인용하거나 새로운 댓글·로그에 복사하지 않습니다.
2. 신고자에게 [보안 정책](./SECURITY.md)의 Private Vulnerability Reporting으로 이동하도록 안내합니다.
3. 지정된 owner/admin이 본문·댓글별로 가능한 숨김·편집·잠금·삭제 조치를 판단합니다. 실행한 조치와 실행자를 private incident 기록에 남깁니다.
4. 토큰·credential은 즉시 revoke·rotate하고, 개인정보는 지정된 privacy escalation 채널로 전달합니다. 개인정보를 일반 Issue 댓글이나 로그에 복사하지 않습니다.
5. 전송된 알림, 참조, 외부 cache 가능성을 확인하고 회수할 수 없는 흔적을 사후 점검에 기록합니다.
6. 공개 노출을 최소화할 권한자가 없으면 자체 처리로 종결하지 않고 Issue Form 공개를 중단합니다.

## 이메일 피드백 전환

기존 이메일 FeedbackModal은 유지합니다. 공개적으로 추적할 수 있는 오류·제안·질문이 이메일로 들어오면 민감정보 여부를 먼저 확인하고, 발신자에게 적합한 Form을 안내합니다. 발신자 동의가 있고 내용에서 민감정보를 제거할 수 있을 때만 유지관리자가 요약 Issue를 만들고 이메일에 canonical Issue 링크를 남깁니다.
