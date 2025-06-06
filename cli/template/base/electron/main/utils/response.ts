export const response = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ok: (data?: { code?: number; msg?: string; data?: any }) => {
    return {
      code: 200,
      msg: 'SUCCESS',
      data: null,
      ...data,
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (data?: { code?: number; msg?: string; data?: any }) => {
    return {
      code: 500,
      msg: 'ERROR',
      ...data,
    }
  },
}
