# Debugging

- 공식 문서: [Debugging](https://nextjs.org/docs/app/guides/debugging)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 클라이언트 코드와 서버 코드에 맞는 디버거 연결 방식을 선택한다.
- VS Code, WebStorm, 브라우저 DevTools에서 source map 기반 breakpoint를 사용한다.
- Node.js inspector와 오류 오버레이로 서버 오류의 실행 지점을 찾는다.

## 핵심 개념 및 설명

Next.js는 source map을 제공하므로 번들 결과가 아니라 작성한 소스 파일에 breakpoint를 걸 수 있다. 프런트엔드 코드는 브라우저 디버거가 맡고, Server Component와 Route Handler 같은 서버 코드는 Node.js inspector에 연결한다. Node.js에 attach할 수 있는 다른 디버거도 사용할 수 있다.

### VS Code로 디버깅하기

프로젝트 루트에 `.vscode/launch.json`을 만들고 서버, 클라이언트, full stack 구성을 나눈다.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev --inspect"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithChrome",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

Firefox를 쓰려면 Firefox Debugger 확장을 설치하고 `type: "firefox"`와 `webpack://_N_E` 경로 매핑을 추가한다. 포트가 `3000`이 아니면 URL을 바꾸고, 모노레포의 앱이 루트 밖에 있으면 서버와 full stack 구성에 `cwd`를 지정한다.

WebStorm에서는 `JavaScript Debug` 구성을 만들고 앱 URL을 지정한다. Node.js 앱과 브라우저 앱을 각각 디버그 모드로 실행한다.

### 브라우저 DevTools로 클라이언트 디버깅하기

개발 서버를 실행하고 Chrome의 Sources 탭이나 Firefox의 Debugger 탭을 연다. `debugger` 문에 도달하면 실행이 멈추며, 파일 검색으로 source map에 매핑된 소스에 breakpoint를 직접 걸 수도 있다. 클라이언트 소스 경로는 보통 `webpack://_N_E/./`로 시작한다.

[React Developer Tools](https://react.dev/learn/react-developer-tools)를 설치하면 컴포넌트 트리, props와 state, 렌더링 성능을 React 관점에서 검사할 수 있다.

### 서버 코드 디버깅하기

Node.js inspector를 켜서 개발 서버를 실행한다.

```bash
pnpm dev --inspect
```

Chrome에서는 `chrome://inspect`, Firefox에서는 `about:debugging`에서 Next.js 프로세스를 찾아 연결한다. 서버 소스 경로는 보통 `webpack://{application-name}/./`로 시작한다.

> **알아두면 좋은 점**: Docker처럼 localhost 밖에서 연결해야 한다면 `--inspect=0.0.0.0`을 사용할 수 있다. 디버깅 포트를 외부에 노출하므로 신뢰할 수 없는 네트워크에서는 열지 않는다.

시작 직전에 멈추려면 `NODE_OPTIONS=--inspect-brk next dev`, 디버거 연결을 기다리려면 `--inspect-wait`를 `NODE_OPTIONS`에 지정한다.

### 브라우저에서 서버 오류 검사하기

개발 오류 오버레이의 Next.js 버전 아래에 나타나는 Node.js 아이콘을 누르면 서버 프로세스 DevTools URL이 복사된다. 새 탭에서 URL을 열어 오류가 난 서버 소스를 검사한다.

공식 문서는 Windows에서 Fast Refresh가 지나치게 느릴 때 Windows Defender를 비활성화하라고 안내한다. 보안 정책상 전체 비활성화가 어렵다면 [Development Environment](./local-development.md)의 프로젝트 폴더 제외 절차를 검토한다.

### 추가 자료

| 자료 | 링크 |
|---|---|
| VS Code의 Node.js breakpoint | [공식 문서](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_breakpoints) |
| Chrome DevTools JavaScript 디버깅 | [공식 문서](https://developers.google.com/web/tools/chrome-devtools/javascript) |
| Firefox DevTools Debugger | [공식 문서](https://firefox-source-docs.mozilla.org/devtools-user/debugger/) |

## 예제 및 데모 설계

- Phase 2에서 Client Component 이벤트와 Route Handler에 각각 breakpoint를 건다.
- VS Code full stack 구성 하나로 서버 준비 후 Chrome이 열리는 과정을 확인한다.
- 의도적인 서버 오류를 만든 뒤 오류 오버레이의 Node.js 아이콘으로 inspector를 연다.

## 연습 문제

1. Server Component 코드를 브라우저 DevTools에서 검사하려면 개발 서버에 어떤 옵션을 전달해야 하는가?

   1. `--watch`
   2. `--inspect`
   3. `--headless`
   4. `--snapshot`

   <details><summary>정답 보기</summary>

   **정답: 2**. `--inspect`가 Node.js inspector를 열어 서버 코드에 디버거가 연결되도록 한다.

   </details>

2. 모노레포에서 Next.js 앱이 저장소 루트가 아닌 곳에 있을 때 VS Code 구성에 추가할 값은 무엇인가?

   1. `cwd`
   2. `baseURL`
   3. `moduleNameMapper`
   4. `coverageProvider`

   <details><summary>정답 보기</summary>

   **정답: 1**. `cwd`로 디버그 명령이 실행될 앱 디렉토리를 지정한다.

   </details>

## 챕터 요약

- 클라이언트 코드는 브라우저 디버거, 서버 코드는 Node.js inspector에 연결한다.
- source map 덕분에 작성한 소스 파일에서 breakpoint를 사용할 수 있다.
- VS Code는 서버, 클라이언트, full stack 구성을 나눠 실행할 수 있다.
- `--inspect=0.0.0.0`은 원격 연결을 허용하므로 노출 범위를 주의한다.
- 오류 오버레이의 Node.js 아이콘으로 서버 프로세스 검사 URL을 얻을 수 있다.
