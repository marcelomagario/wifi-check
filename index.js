import express from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
let lastPing = null
let isOffline = false

const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
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
  const diff = lastPing ? (now - lastPing) / 60000 : Infinity

  if (diff > 10 && !isOffline) {
    sendEmail('📡 Internet is down', `Last ping: ${new Date(lastPing).toISOString()}`)
    isOffline = true
  }

  if (diff <= 10 && isOffline) {
    sendEmail('✅ Internet is back', `Ping returned: ${new Date().toISOString()}`)
    isOffline = false
  }
}, 6 * 60 * 60 * 1000)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
