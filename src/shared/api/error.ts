import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

interface FastApiValidationItem {
  loc?: unknown[]
  msg?: string
  type?: string
}

interface FastApiErrorBody {
  detail?: FastApiValidationItem[] | string
  message?: string
}

export type ApiError =
  | { kind: 'validation'; status: number; message: string; fields: Record<string, string> }
  | { kind: 'http'; status: number; message: string }
  | { kind: 'network'; status: 'FETCH_ERROR'; message: string }
  | { kind: 'timeout'; status: 'TIMEOUT_ERROR'; message: string }
  | { kind: 'parse'; status: 'PARSING_ERROR'; message: string }
  | { kind: 'custom'; status: 'CUSTOM_ERROR'; message: string }

const ROOT_LOCS = ['body', 'query', 'path', 'header', 'cookie'] as const

function fieldNameFromLoc(loc: unknown[]): string {
  const parts = loc.filter(
    (part): part is string => typeof part === 'string' && part.trim().length > 0,
  )
  const leaf = parts.filter((part) => !ROOT_LOCS.includes(part as (typeof ROOT_LOCS)[number]))
  return leaf.length > 0 ? leaf.join('.') : parts.join('.')
}

function parseHttpError(status: number, data: unknown): ApiError {
  if (typeof data === 'string' && data.trim()) {
    return { kind: 'http', status, message: data }
  }

  if (typeof data === 'object' && data !== null) {
    const body = data as FastApiErrorBody

    if (Array.isArray(body.detail)) {
      const fields: Record<string, string> = {}
      const messages: string[] = []

      for (const item of body.detail) {
        if (typeof item?.msg !== 'string' || !item.msg.trim()) continue
        messages.push(item.msg)
        const field = fieldNameFromLoc(item.loc ?? [])
        if (field) fields[field] = item.msg
      }

      if (messages.length > 0) {
        return { kind: 'validation', status, message: messages.join('; '), fields }
      }
    }

    if (typeof body.detail === 'string' && body.detail.trim()) {
      return { kind: 'http', status, message: body.detail }
    }

    if (typeof body.message === 'string' && body.message.trim()) {
      return { kind: 'http', status, message: body.message }
    }
  }

  return { kind: 'http', status, message: `Request failed (${status})` }
}

export async function parseResponseError(response: Response): Promise<ApiError> {
  try {
    const data: unknown = await response.json()
    return parseHttpError(response.status, data)
  } catch {
    return { kind: 'http', status: response.status, message: `Request failed (${response.status})` }
  }
}

export function normalizeApiError(error: FetchBaseQueryError): ApiError {
  if (typeof error.status === 'number') {
    return parseHttpError(error.status, error.data)
  }

  switch (error.status) {
    case 'FETCH_ERROR':
      return { kind: 'network', status: 'FETCH_ERROR', message: error.error || 'Network error' }
    case 'TIMEOUT_ERROR':
      return {
        kind: 'timeout',
        status: 'TIMEOUT_ERROR',
        message: error.error || 'Request timed out',
      }
    case 'PARSING_ERROR':
      return {
        kind: 'parse',
        status: 'PARSING_ERROR',
        message: error.error || 'Failed to parse response',
      }
    case 'CUSTOM_ERROR':
      return { kind: 'custom', status: 'CUSTOM_ERROR', message: error.error || 'Request failed' }
  }
}

export function isValidationError(error: unknown): error is Extract<ApiError, { kind: 'validation' }> {
  return typeof error === 'object' && error !== null && (error as ApiError | null)?.kind === 'validation'
}
