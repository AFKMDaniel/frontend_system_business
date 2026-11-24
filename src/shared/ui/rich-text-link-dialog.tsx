import { useState } from 'react'

import { useTranslation } from '@/shared/i18n'
import { useAppDispatch } from '@/shared/lib/hooks'
import { resolveLinkDialog, type LinkDialogResult } from '@/shared/lib/utils'
import { closeDialog } from '@/shared/model'
import { Button } from '@/shared/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export type RichTextLinkDialogProps = {
  requestId: string
  url: string
  hasExistingLink: boolean
}

export function RichTextLinkDialog({ requestId, url, hasExistingLink }: RichTextLinkDialogProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(url)

  const finish = (result: LinkDialogResult) => {
    resolveLinkDialog(requestId, result)
    dispatch(closeDialog())
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const trimmed = value.trim()
    finish(trimmed ? { type: 'apply', url: trimmed } : { type: 'remove' })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('richText.linkTitle')}</DialogTitle>
        <DialogDescription>{t('richText.linkDescription')}</DialogDescription>
      </DialogHeader>
      <form id="rich-text-link-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
        <Label htmlFor="rich-text-link-url">{t('richText.linkUrlLabel')}</Label>
        <Input
          id="rich-text-link-url"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://"
          autoFocus
        />
      </form>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={() => finish(null)}>
          {t('richText.linkCancel')}
        </Button>
        {hasExistingLink && (
          <Button type="button" variant="outline" onClick={() => finish({ type: 'remove' })}>
            {t('richText.linkRemove')}
          </Button>
        )}
        <Button type="submit" form="rich-text-link-form">
          {t('richText.linkApply')}
        </Button>
      </DialogFooter>
    </>
  )
}
