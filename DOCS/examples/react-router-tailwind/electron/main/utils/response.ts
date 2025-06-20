interface ResponseOk<T = unknown> {
  code?: number
  msg?: string
  data?: T
}

interface ResponseError {
  code?: number
  msg?: string
}

export const response = {
  ok: <T = unknown>(data?: ResponseOk<T>) => ({
    code: 200,
    msg: 'SUCCESS',
    data: null,
    ...data,
  }),

  error: (data?: ResponseError) => ({
    code: 500,
    msg: 'ERROR',
    ...data,
  }),
}
