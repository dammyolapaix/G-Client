import { render } from '@react-email/components'
import sendgrid from '@sendgrid/mail'
import nodemailer from 'nodemailer'

import { env } from '@/env/server'

type SendEmail = {
  to: string[]
  subject: string
  emailTemplate: React.ReactElement
}

class Email {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    secure: false,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  })

  send = async ({ emailTemplate, subject, to }: SendEmail) => {
    try {
      const html = await render(emailTemplate)

      const options = {
        from: env.EMAIL_FROM_EMAIL,
        to,
        subject,
        html,
      }

      if (env.NODE_ENV === 'production') {
        sendgrid.setApiKey(env.SENDGRID_API_KEY)

        await sendgrid.send(options)
      } else {
        await this.transporter.sendMail(options)
      }
    } catch (error) {
      console.error(error)
    }
  }
}

const email = new Email()

export default email
