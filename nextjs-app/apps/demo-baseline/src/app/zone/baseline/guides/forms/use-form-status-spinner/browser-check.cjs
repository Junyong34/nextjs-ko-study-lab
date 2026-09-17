// Run with PLAYWRIGHT_MODULE pointing to an existing Playwright installation.
// BASE_URL defaults to the baseline development server; no requests are mocked.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } })
  page.setDefaultTimeout(12000)
  const posts = []
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('response', response => {
    if (response.request().method() === 'POST') {
      posts.push({ status: response.status(), action: !!response.request().headers()['next-action'] })
    }
  })
  try {
    const origin = process.env.BASE_URL || 'http://localhost:3001'
    await page.goto(`${origin}/zone/baseline/guides/forms/use-form-status-spinner`)
    // Wait for hydration, including the child's first idle observation.
    await page.waitForTimeout(700)
    const badge = page.locator('legend').filter({ hasText: '[검증]' })
    assert.match(await badge.innerText(), /대기 중/)

    async function submit(quantity) {
      await page.getByLabel('주문 수량', { exact: true }).fill(quantity)
      await page.getByRole('button', { name: '예시 주문 접수', exact: true }).click()
      await page.waitForFunction(() => document.querySelector('button[type=submit]')?.disabled === true)
      assert.match(await page.locator('form').innerText(), /pending=true/)
      assert.match(await page.locator('body').innerText(), /폼 밖: pending=false/)
      assert.match(await badge.innerText(), /대기 중/)
      await page.waitForFunction(() => document.querySelector('button[type=submit]')?.disabled === false)
      await page.waitForFunction(() => [...document.querySelectorAll('legend')].some(
        element => element.textContent.includes('[검증]') && element.textContent.includes('검증 완료'),
      ))
    }

    await submit('2')
    await page.getByText('예시 주문 접수 완료', { exact: true }).waitFor()
    await submit('0')
    assert.match(await page.locator('body').innerText(), /서버 접수 거절/)
    assert.equal(await page.getByText('예시 주문 접수 완료', { exact: true }).count(), 0)
    await submit('1.5')
    await submit('3')
    await page.getByText('예시 주문 접수 완료', { exact: true }).waitFor()

    // A tampered DOM snapshot must not pass as an observed matching submission.
    // React restores this controlled value; the actual response remains untouched.
    await page.locator('input[name=productId]').evaluate(element => { element.value = 'unknown-product' })
    await Promise.all([
      page.waitForResponse(response => response.request().method() === 'POST'),
      page.getByRole('button', { name: '예시 주문 접수', exact: true }).click(),
    ])
    await page.waitForFunction(() => document.querySelector('button[type=submit]')?.disabled === false)
    assert.match(await badge.innerText(), /불일치/)

    await page.getByRole('button', { name: '예제 초기화', exact: true }).click()
    assert.match(await badge.innerText(), /대기 중/)
    await submit('2')
    assert.equal(posts.length, 6)
    assert.ok(posts.every(post => post.status === 200 && post.action))
    assert.deepEqual(errors, [])
    console.log(JSON.stringify({ result: 'PASS', checks: [
      'idle → pending/data/disabled → idle', 'request IDs across repeat submissions',
      'expected quantity rejection', 'tampered input snapshot mismatches', 'reset and repeat',
    ], posts, errors }, null, 2))
  } finally {
    await browser.close()
  }
}

main().catch(error => { console.error(error); process.exitCode = 1 })
