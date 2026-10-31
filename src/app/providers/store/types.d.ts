// Global store types, derived from the app-level store.
// Kept global so lower layers (including `shared`) can type Redux APIs
// without importing from `app/`.
declare global {
  type RootState = import('./index').RootState
  type AppDispatch = import('./index').AppDispatch
}

export {}
