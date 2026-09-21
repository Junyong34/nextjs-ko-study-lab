// Use an existing Playwright installation; start the baseline server separately.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  page.setDefaultTimeout(15000)
  const errors = []
  const documents = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('request', request => {
    if (request.resourceType() === 'document') documents.push(request.url())
  })
  const base = `${process.env.BASE_URL || 'http://localhost:3001'}/zone/baseline/file-conventions/loading/nested-segment-loading`
  const badge = page.locator('legend').filter({ hasText: '[검증]' })
  const startButton = page.getByRole('button', { name: '새 실행 시작 (신규 [run] 경로 생성)', exact: true })
  const parentActionButton = page.getByRole('button', { name: /^상위 조작/ })

  try {
    await page.goto(base)
    assert.equal(await page.locator('legend').count(), 4)
    assert.match(await badge.innerText(), /대기 중/)

    // --- 1회차 실행: 다섯 단계가 실제 순서대로 관측되어야 성공 ---
    await startButton.click()
    await page.waitForURL(/\/catalog\/[^/]+$/)
    const runUrl = page.url()
    const runPath = new URL(runUrl).pathname

    // [A] 상위 fallback이 실제로 마운트됐는지 확인 (카탈로그 완료 전에)
    await page.getByText('[A] catalog/loading.tsx').waitFor({ state: 'visible' })

    // 카탈로그 서버 지연(1800ms)이 끝나고 실제 목록이 마운트될 때까지 대기
    await page.getByText(/카탈로그 목록 \(catalog\/\[run\]\/page\.tsx/).waitFor({ state: 'visible' })

    // 상품 상세로 이동 (카탈로그 목록 안의 실제 상품 링크 — href가 현재 run 경로 하위인 것만 고른다)
    const productLinks = page.locator(`a[href^="${runPath}/"]`)
    assert.ok((await productLinks.count()) > 0, 'catalog list must render at least one product link')
    await productLinks.first().click()

    // [B] 하위 fallback이 보이는 동안 GNB의 [상위 조작] 버튼을 클릭한다.
    await page.getByText('[B] catalog/[run]/[product]/loading.tsx').waitFor({ state: 'visible' })
    await parentActionButton.click()

    // 상품 상세(1600ms 지연)가 끝나고 실제로 마운트될 때까지 대기
    await page.getByText(/상품 상세 \(catalog\/\[run\]\/\[product\]\/page\.tsx/).waitFor({ state: 'visible' })

    assert.match(await badge.innerText(), /검증 완료/)
    assert.deepEqual(errors, [], 'no console/page errors during a full run')
    assert.equal(documents.length, 1, 'catalog/product navigation stays client-side (no extra document reload)')

    // --- 2회차 실행: 이전 실행 기록이 새 실행의 증거로 인정되지 않아야 한다 ---
    await startButton.click()
    await page.waitForURL(/\/catalog\/[^/]+$/)
    const secondRunUrl = page.url()
    assert.notEqual(secondRunUrl, runUrl, 'starting again must create a new [run] path')
    // 새 실행 직후에는(카탈로그 fallback을 다시 관측하기 전) 이전 실행의 "검증 완료"가 그대로 남아있으면 안 된다.
    assert.doesNotMatch(await badge.innerText(), /검증 완료/, 'previous run result must not carry over to a fresh run')

    // --- 예제 초기화: 홈으로 실제 전체 새로고침(초기화) ---
    await page.getByRole('button', { name: '예제 초기화', exact: true }).click()
    await page.waitForURL(base)
    await page.getByText('아직 실행을 시작하지 않았습니다').waitFor({ state: 'visible' })
    assert.match(await badge.innerText(), /대기 중/)

    // --- 모바일 가로 넘침 확인 ---
    await page.setViewportSize({ width: 390, height: 844 })
    const size = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }))
    assert.ok(size.scroll <= size.client)

    assert.deepEqual(errors, [])
    console.log(JSON.stringify({
      result: 'PASS',
      checks: [
        'hydration',
        'parent fallback [A] observed before catalog ready',
        'child fallback [B] observed, parent action clickable during it',
        'full success verified in one run',
        'single document request across client-side navigations',
        'fresh run does not inherit previous run result',
        'reset returns home and clears state',
        'mobile',
      ],
      size,
      errors,
    }))
  } finally {
    await browser.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
