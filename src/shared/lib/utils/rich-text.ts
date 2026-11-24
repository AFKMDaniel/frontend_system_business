/**
 * Whether markdown content has no visible content.
 */
export function isEmptyRichText(value: string | null | undefined): boolean {
  return !value?.trim()
}
