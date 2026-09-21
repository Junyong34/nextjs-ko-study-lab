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
  const base = `${process.env.BASE_URL || 'http://localhost:3001'}/zone/baseline/file-conventions/layout/state-preservation`
  try {
    await page.goto(base)
    const input = page.locator('#state-preservation-query')
    const record = page.getByRole('button', { name: '현재 입력값·경로를 기준으로 기록', exact: true })
    const badge = page.locator('legend').filter({ hasText: '[검증]' })
    await page.waitForFunction(() => [...document.querySelectorAll('button')].some(
      element => element.textContent.includes('현재 입력값·경로를 기준으로 기록') && !element.disabled,
    ))
    assert.deepEqual(errors, [], 'SSR hydration must match')
    assert.match(await badge.innerText(), /대기 중/)
    assert.equal(await page.locator('legend').count(), 4)
    await input.fill('무선 키보드')
    await record.click()
    assert.match(await badge.innerText(), /대기 중/)

    for (const [label, segment] of [['전자기기', 'electronics'], ['패션', 'fashion']]) {
      await page.getByRole('link', { name: `${label} 카테고리로 이동`, exact: true }).click()
      await page.waitForURL(`${base}/${segment}`)
      await page.waitForFunction(() => [...document.querySelectorAll('legend')].some(
        element => element.textContent.includes('검증 완료'),
      ))
      assert.equal(await input.inputValue(), '무선 키보드')
      assert.equal(await page.getByRole('region', { name: `${label} 카테고리`, exact: true }).count(), 1)
    }
    assert.equal(documents.length, 1, 'Link changes routes without a document reload')
    await input.fill('다른 검색어')
    assert.match(await badge.innerText(), /불일치/)
    await input.fill('무선 키보드')
    assert.match(await badge.innerText(), /검증 완료/)
    await page.getByRole('button', { name: '예제 초기화', exact: true }).click()
    assert.equal(await input.inputValue(), '')
    assert.match(await badge.innerText(), /대기 중/)

    await input.fill('재실행')
    await record.click()
    await page.getByRole('link', { name: '도서 카테고리로 이동', exact: true }).click()
    await page.waitForURL(base)
    await page.waitForFunction(() => [...document.querySelectorAll('legend')].some(
      element => element.textContent.includes('검증 완료'),
    ))
    await page.reload()
    await input.waitFor()
    assert.equal(await input.inputValue(), '')
    assert.match(await badge.innerText(), /대기 중/)
    await page.setViewportSize({ width: 390, height: 844 })
    const size = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth,
    }))
    assert.ok(size.scroll <= size.client)
    assert.deepEqual(errors, [])
    console.log(JSON.stringify({ result: 'PASS', checks: [
      'hydration', 'two real routes without document reload', 'preservation and mismatch',
      'reset and repeat', 'full reload resets state', 'mobile',
    ], size, errors }))
  } finally {
    await browser.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
