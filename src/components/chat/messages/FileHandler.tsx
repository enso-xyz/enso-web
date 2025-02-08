import React, { useState, useRef } from "react"
import { toast } from "sonner"
import { FilePreview } from "./FilePreview"

interface FileHandlerProps {
  onFilesChange: (files: File[]) => void
  className?: string
}

export function FileHandler({ onFilesChange, className }: FileHandlerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const dropzoneRef = useRef<HTMLDivElement>(null)

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        await handleImageUpload(file)
      } else {
        await handleFileUpload(file)
      }
    }
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const newFiles = [...pendingFiles, file]
      setPendingFiles(newFiles)
      onFilesChange(newFiles)
      toast.success("Image ready to send")
    } catch (error) {
      toast.error("Failed to prepare image. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const newFiles = [...pendingFiles, file]
      setPendingFiles(newFiles)
      onFilesChange(newFiles)
      toast.success("File ready to send")
    } catch (error) {
      toast.error("Failed to prepare file. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...pendingFiles, ...files]
    setPendingFiles(newFiles)
    onFilesChange(newFiles)
  }

  const removeFile = (file: File) => {
    const newFiles = pendingFiles.filter(f => f !== file)
    setPendingFiles(newFiles)
    onFilesChange(newFiles)
  }

  return (
    <div className={className}>
      {pendingFiles.length > 0 && (
        <div className="mb-2">
          <FilePreview
            files={pendingFiles}
            onRemove={removeFile}
          />
        </div>
      )}

      <div
        ref={dropzoneRef}
        onDragEnter={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (dropzoneRef.current && !dropzoneRef.current.contains(e.relatedTarget as Node)) {
            setIsDragging(false)
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Hidden file inputs */}
        <input
          type="file"
          id="file-input"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="file"
          id="image-input"
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
        />

        {/* Upload progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-900/90 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white/40 transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }} 
                />
              </div>
              <span className="text-sm text-white/60">Uploading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 