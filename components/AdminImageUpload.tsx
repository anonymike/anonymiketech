"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X, Loader } from "lucide-react"

interface AdminImageUploadProps {
  onImageUpdate?: (imageUrl: string | null) => void
}

export default function AdminImageUpload({ onImageUpdate }: AdminImageUploadProps) {
  const [adminImage, setAdminImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchAdminImage()
  }, [])

  const fetchAdminImage = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/image")
      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setAdminImage(data.url)
          onImageUpdate?.(data.url)
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin image:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    try {
      setUploading(true)
      setError(null)
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await res.json()
      setAdminImage(data.image.url)
      onImageUpdate?.(data.image.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = async () => {
    try {
      const res = await fetch("/api/admin/image", { method: "DELETE" })
      if (res.ok) {
        setAdminImage(null)
        onImageUpdate?.(null)
      }
    } catch (err) {
      setError("Failed to remove image")
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
        <span className="text-2xl">👤</span>
        Admin Profile Image
      </h3>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <>
          {/* Current Image Display */}
          {adminImage ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-emerald-400/50 hover:border-emerald-400 transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={adminImage}
                  alt="Admin profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all shadow-lg"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            /* Upload Area */
            <motion.div
              whileHover={{ borderColor: "#10b981" }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative p-8 border-2 border-dashed border-emerald-400/50 rounded-lg hover:border-emerald-400 transition-all cursor-pointer bg-emerald-400/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/30">
                  <Upload className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-300 font-semibold">Drop image here or click to select</p>
                  <p className="text-emerald-400/70 text-sm">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(e.target.files[0])
              }
            }}
            className="hidden"
          />

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Upload Status */}
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-emerald-400 text-sm"
            >
              <Loader className="w-4 h-4 animate-spin" />
              Uploading...
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
