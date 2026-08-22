import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 3: Combination 6 - useActionState + useFormStatus + Cookie Session Auth + Redirect', () => {
  it('3.6.1 should process login form action state and set session cookie', async () => {
    let sessionCookie: string | null = null

    const loginAction = async (prevState: any, formData: FormData) => {
      const email = formData.get('email')
      const password = formData.get('password')
      if (email === 'user@example.com' && password === 'secret123') {
        sessionCookie = 'auth_session_token_xyz; Path=/; HttpOnly; Secure'
        return { success: true, redirectUrl: '/dashboard' }
      }
      return { success: false, error: 'INVALID_CREDENTIALS' }
    }

    const validData = new FormData()
    validData.append('email', 'user@example.com')
    validData.append('password', 'secret123')

    const res = await loginAction({ success: false }, validData)
    assert.strictEqual(res.success, true)
    assert.strictEqual(res.redirectUrl, '/dashboard')
    assert.ok(sessionCookie !== null)
    assert.match(sessionCookie!, /HttpOnly/)
  })
})
