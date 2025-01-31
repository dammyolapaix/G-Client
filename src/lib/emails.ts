import { render } from '@react-email/components'
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
    secure: env.NODE_ENV === 'production',
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  })

  send = async ({ emailTemplate, subject, to }: SendEmail) => {
    const html = await render(emailTemplate)

    await this.transporter.sendMail({
      from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
  }
}

const email = new Email()

export default email
