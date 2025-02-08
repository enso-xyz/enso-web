"use client"

import React from "react"
import { User } from "@supabase/supabase-js"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import { getSupabaseClient } from "@/lib/supabase/client"

interface ProfileSettingsProps {
  user: User | null
  onSave: () => void
}

export function ProfileSettings({ user, onSave }: ProfileSettingsProps) {
  const [fullName, setFullName] = React.useState(user?.user_metadata?.full_name || "")

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      const supabase = getSupabaseClient()
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`${user.id}/${Date.now()}`, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(uploadData.path)

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (updateError) throw updateError
      toast.success("avatar updated")
      onSave()
    } catch (error) {
      console.error("Failed to upload avatar:", error)
      toast.error("failed to upload avatar")
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-zinc-800 flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.email || ""}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-light text-white/40">
                {user?.email?.[0].toUpperCase()}
              </span>
            )}
          </div>
          <label className="absolute -right-2 -top-2 rounded-full bg-zinc-800 p-2 text-white/60 transition-colors hover:text-white/80 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadAvatar}
              className="hidden"
            />
            <Upload className="h-4 w-4" />
          </label>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-light text-white/40">
            email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="mt-1 w-full rounded-lg border border-white/5 bg-zinc-800/50 px-4 py-2 text-sm font-light text-white/60"
          />
        </div>
        <div>
          <label className="text-xs font-light text-white/40">
            full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="enter your full name"
            className="mt-1 w-full rounded-lg border border-white/5 bg-zinc-800/50 px-4 py-2 text-sm font-light text-white/90 placeholder:text-white/20"
          />
        </div>
      </div>
    </div>
  )
} 