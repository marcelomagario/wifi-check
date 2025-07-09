import express from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
let lastPing = null
let isOffline = false

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

function sendEmail(subject, text) {
  transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject,
    text
  })
}

app.get('/heartbeat', (req, res) => {
  lastPing = Date.now()
  res.sendStatus(200)
})

setInterval(() => {
  const now = Date.now()
  const heartbeatTimeout = parseInt(process.env.HEARTBEAT_TIMEOUT_MINUTES) || 10
  const diff = lastPing ? (now - lastPing) / 60000 : Infinity

  if (diff > heartbeatTimeout && !isOffline) {
    sendEmail('📡 Internet is down', `Last ping: ${new Date(lastPing).toISOString()}`)
    console.log(`[${new Date().toISOString()}] Internet is down. Last ping: ${new Date(lastPing).toISOString()}`)
    isOffline = true
  }

  if (diff <= heartbeatTimeout && isOffline) {
    sendEmail('✅ Internet is back', `Ping returned: ${new Date().toISOString()}`)
    console.log(`[${new Date().toISOString()}] Internet is back.`)
    isOffline = false
  }
}, (parseInt(process.env.CHECK_INTERVAL_HOURS) || 6) * 60 * 60 * 1000)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
