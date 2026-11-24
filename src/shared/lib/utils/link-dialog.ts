export type LinkDialogResult = { type: 'apply'; url: string } | { type: 'remove' } | null

type LinkDialogResolver = (result: LinkDialogResult) => void

const pendingRequests = new Map<string, LinkDialogResolver>()

/**
 * Registers a pending link-dialog request and returns its id together with a
 * promise that resolves once the dialog reports a result (or is dismissed).
 */
export function createLinkDialogRequest(): {
  requestId: string
  result: Promise<LinkDialogResult>
} {
  // A pending request can only linger when its dialog was dismissed without a
  // result (X, Escape, overlay). Settle it as cancelled before starting a new one.
  for (const resolve of pendingRequests.values()) {
    resolve(null)
  }
  pendingRequests.clear()

  const requestId = crypto.randomUUID()

  const result = new Promise<LinkDialogResult>((resolve) => {
    pendingRequests.set(requestId, resolve)
  })

  return { requestId, result }
}

export function resolveLinkDialog(requestId: string, result: LinkDialogResult) {
  const resolve = pendingRequests.get(requestId)

  if (!resolve) {
    return
  }

  pendingRequests.delete(requestId)
  resolve(result)
}
