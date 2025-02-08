import { supabase } from "./client"
import imageCompression from "browser-image-compression"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: ["application/pdf", "text/plain", "text/markdown"],
}

interface UploadOptions {
  onProgress?: (progress: number) => void
}

export async function uploadFile(
  file: File,
  bucket: string = "attachments",
  options: UploadOptions = {}
) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 20MB limit")
  }

  // Check file type
  const isImage = ALLOWED_FILE_TYPES.image.includes(file.type)
  const isDocument = ALLOWED_FILE_TYPES.document.includes(file.type)
  
  if (!isImage && !isDocument) {
    throw new Error("File type not supported")
  }

  let fileToUpload = file
  
  // Process image files
  if (isImage) {
    // Compress image if needed
    const compressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    fileToUpload = await imageCompression(file, compressionOptions)

    // Get image analysis from Edge Function
    const base64 = await fileToBase64(fileToUpload)
    const { data: aiData, error: aiError } = await supabase.functions.invoke("ai", {
      body: {
        action: "analyze_image",
        content: {
          base64Image: base64,
          mimeType: file.type,
        }
      }
    })
    if (aiError) throw aiError

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
    const path = `${bucket}/${filename}`

    // Upload file with metadata
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        duplex: "half",
        metadata: aiData.metadata,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      url: publicUrl,
      path,
      filename,
      type: file.type,
      size: fileToUpload.size,
      metadata: aiData.metadata,
    }
  }

  // Process document files
  if (isDocument) {
    const text = await fileToUpload.text()
    const { data: aiData, error: aiError } = await supabase.functions.invoke("ai", {
      body: {
        action: "analyze_document",
        content: text,
      }
    })
    if (aiError) throw aiError

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
    const path = `${bucket}/${filename}`

    // Upload file with metadata
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        duplex: "half",
        metadata: aiData.metadata,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      url: publicUrl,
      path,
      filename,
      type: file.type,
      size: fileToUpload.size,
      metadata: aiData.metadata,
    }
  }

  throw new Error("Unsupported file type")
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result as string
      resolve(base64.split(",")[1])
    }
    reader.onerror = error => reject(error)
  })
}

export async function deleteFile(path: string, bucket: string = "attachments") {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) throw error
}

export function getFileUrl(path: string, bucket: string = "attachments") {
  return supabase.storage
    .from(bucket)
    .getPublicUrl(path)
    .data.publicUrl
}
