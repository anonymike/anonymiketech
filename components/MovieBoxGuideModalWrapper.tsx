"use client"

import dynamic from "next/dynamic"

const MovieBoxGuideModal = dynamic(() => import("./MovieBoxGuideModal"), { ssr: false })

import { useMovieBoxModal } from "@/lib/use-moviebox-modal"

export default function MovieBoxGuideModalWrapper() {
  const { isOpen, closeModal } = useMovieBoxModal()

  return <MovieBoxGuideModal isOpen={isOpen} onClose={closeModal} />
}
