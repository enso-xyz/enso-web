import { Logo } from "@/components/ui/logo"

interface InviteEmailProps {
  inviterName: string
  inviteLink: string
}

export function InviteEmail({ inviterName, inviteLink }: InviteEmailProps) {
  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>
        
        <div className="space-y-6 text-center">
          <h1 className="text-2xl font-light text-white/90">
            {inviterName} invited you to chat on enso
          </h1>
          
          <p className="text-base text-white/60 font-extralight">
            Join the conversation in a minimal, intelligent chat experience.
          </p>

          <div className="relative">
            <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-[#178bf1]/20 via-transparent to-[#178bf1]/20 blur-lg" />
            <a
              href={inviteLink}
              className="relative block w-full py-3 px-4 bg-zinc-900/90 backdrop-blur-sm rounded-lg border border-white/10 text-white/80 font-light text-center hover:bg-zinc-900/70 transition-colors"
            >
              Join Chat
            </a>
          </div>

          <p className="text-sm text-white/40 font-extralight">
            or copy this link:
            <br />
            <span className="text-white/60">{inviteLink}</span>
          </p>
        </div>
      </div>
    </div>
  )
} 