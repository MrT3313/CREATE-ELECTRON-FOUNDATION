import { nanoid } from 'nanoid'

export const SESSION_ID = nanoid()

export const electronLogMessageFormat = '{h}:{i}:{s} [{processType}{scope}] [{level}] > {text}';