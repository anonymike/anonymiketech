import { create } from "zustand"

interface MovieBoxModalStore {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useMovieBoxModal = create<MovieBoxModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))
