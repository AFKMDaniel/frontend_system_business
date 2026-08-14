import { createElement } from 'react'
import type { AnimationEvent, ReactNode } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/providers/store'
import { Dialog, DialogContent } from '@/shared/ui/dialog'

import type { DialogId, DialogPropsMap } from '../../types'
import {
  clearDialogContent,
  closeDialog,
  selectDialogContent,
  selectDialogIsOpen,
} from '../../slice'
import { dialogRegistry } from '../../model'

function renderDialog<K extends DialogId>(id: K, props?: DialogPropsMap[K]): ReactNode {
  const Content = dialogRegistry[id]
  return createElement(Content, props)
}

export function DialogHost() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectDialogIsOpen)
  const content = useAppSelector(selectDialogContent)

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (!isOpen && event.target === event.currentTarget) {
      dispatch(clearDialogContent())
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dispatch(closeDialog())
      }}
    >
      <DialogContent onAnimationEnd={handleAnimationEnd}>
        {content ? renderDialog(content.id, content.props) : null}
      </DialogContent>
    </Dialog>
  )
}
