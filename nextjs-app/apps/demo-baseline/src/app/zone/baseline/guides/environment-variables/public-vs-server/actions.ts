'use server'

export interface ServerEnvReadResult {
  storeName: string | undefined
  adminEmail: string | undefined
  readAt: string
}

/** 서버에서만 실행되며, 요청이 올 때마다 process.env를 새로 읽는다. */
export async function readServerEnvAction(): Promise<ServerEnvReadResult> {
  return {
    storeName: process.env.NEXT_PUBLIC_STORE_NAME,
    adminEmail: process.env.INTERNAL_ADMIN_EMAIL,
    readAt: new Date().toLocaleTimeString(),
  }
}
