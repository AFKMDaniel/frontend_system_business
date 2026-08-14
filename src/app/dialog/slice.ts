import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@/app/providers/store'

import type { DialogPayload } from './types'

export type CurrentDialog = DialogPayload | null

type DialogState = {
  isOpen: boolean
  content: CurrentDialog
}

const initialState: DialogState = {
  isOpen: false,
  content: null,
}

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openDialog(state, { payload }: PayloadAction<DialogPayload>) {
      state.isOpen = true
      state.content = payload
    },
    closeDialog(state) {
      state.isOpen = false
    },
    clearDialogContent(state) {
      state.content = null
    },
  },
})

export const { openDialog, closeDialog, clearDialogContent } = dialogSlice.actions
export default dialogSlice.reducer

export const selectDialogIsOpen = (state: RootState) => state.dialog.isOpen
export const selectDialogContent = (state: RootState) => state.dialog.content
