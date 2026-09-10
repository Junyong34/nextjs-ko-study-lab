export type DemoRole = 'customer' | 'admin'

export const ROLE_COOKIE_NAME = 'forbidden_demo_role'

export const TRIGGER_403_BASE_PATH = '/zone/baseline/functions/forbidden/trigger-403'
export const ADMIN_SETTLEMENTS_PATH = `${TRIGGER_403_BASE_PATH}/admin/settlements`
