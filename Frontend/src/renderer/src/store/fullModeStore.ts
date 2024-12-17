import { create } from 'zustand'

export interface FullModeState {
  isFullMode: boolean
}

export interface FullModeActions {
  toggleFullMode: () => void
}

type FullModeStore = FullModeState & FullModeActions

const useFullModeStore = create<FullModeStore>((set) => ({
  isFullMode: false,
  toggleFullMode: () => set((state) => ({ isFullMode: !state.isFullMode }))
}))

export default useFullModeStore
