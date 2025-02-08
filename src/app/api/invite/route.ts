import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase/server'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email, chatId } = await req.json()
    
    // Get current user using server-side client
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return Response.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Generate invite link
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${chatId}`

    // Send email with HTML template
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Enso <noreply@enso.chat>',
      to: email,
      subject: `${profile.full_name || profile.email.split('@')[0]} invited you to chat on enso`,
      html: `
        <div>
          <h1>You've been invited to chat!</h1>
          <p>${profile.full_name || profile.email.split('@')[0]} has invited you to chat on Enso.</p>
          <p>Click the link below to join:</p>
          <a href="${inviteLink}">${inviteLink}</a>
        </div>
      `
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return Response.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error in invite endpoint:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 