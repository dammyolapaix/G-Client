import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { format } from 'date-fns'

import { env } from '@/env/server'

interface Props {
  learnerName: string
  courseName: string
  amount: number
  dueDate: string
  paymentLink: string
}

const baseUrl = env.BASE_URL

export default function InvoiceEmail({
  learnerName,
  courseName,
  amount,
  dueDate,
  paymentLink,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>G-Client Course Invoice</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Img
                src={`${baseUrl}/g-client-white-logo.png`}
                width="75"
                height="45"
                alt="G-Client's Logo"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>Course Invoice</Heading>
              <Text style={mainText}>Dear {learnerName},</Text>
              <Text style={mainText}>
                This is an invoice for the course: {courseName}. The amount due
                is GHS {amount}. Please complete your payment by{' '}
                {format(new Date(dueDate), 'PPP')}.
              </Text>
              <Section style={buttonSection}>
                <Button href={paymentLink} style={button}>
                  Pay Now
                </Button>
              </Section>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                If you did not request to enroll in this course, please ignore
                this email or contact support.
              </Text>
            </Section>
          </Section>
          <Text style={footerText}>
            © {new Date().getFullYear()} G-Client, Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#fff',
  color: '#212121',
}

const container = {
  padding: '20px',
  margin: '0 auto',
  backgroundColor: '#eee',
}

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '15px',
}

const button = {
  backgroundColor: '#01589A',
  borderRadius: '6px',
  color: '#fff',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
}

const imageSection = {
  backgroundColor: '#01589A',
  display: 'flex',
  padding: '20px 0',
  alignItems: 'center',
  justifyContent: 'center',
}

const coverSection = { backgroundColor: '#fff' }

const upperSection = { padding: '25px 35px' }

const lowerSection = { padding: '25px 35px' }

const buttonSection = {
  textAlign: 'center' as const,
  marginTop: '25px',
}

const footerText = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  padding: '0 20px',
  textAlign: 'center' as const,
}

const mainText = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
}

const cautionText = {
  ...mainText,
  margin: '0px',
  color: '#666',
}
