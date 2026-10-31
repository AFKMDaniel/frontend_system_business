import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

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
export const dialogReducer = dialogSlice.reducer

type DialogStateSelector = { dialog: DialogState }

export const selectDialogIsOpen = (state: DialogStateSelector) => state.dialog.isOpen
export const selectDialogContent = (state: DialogStateSelector) => state.dialog.content
