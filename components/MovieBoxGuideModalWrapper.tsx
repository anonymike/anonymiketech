"use client"

import { useMovieBoxModal } from "@/lib/use-moviebox-modal"
import MovieBoxGuideModal from "./MovieBoxGuideModal"

export default function MovieBoxGuideModalWrapper() {
  const { isOpen, closeModal } = useMovieBoxModal()

  return <MovieBoxGuideModal isOpen={isOpen} onClose={closeModal} />
}
