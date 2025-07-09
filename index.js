import express from 'express'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'

dotenv.config()

const app = express()
let lastPing = null
let isOffline = false

// Configurar AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const ses = new AWS.SES()

function sendEmail(subject, text) {
  console.log(`Email: ${subject} - ${text}`)
  
  const params = {
    Source: process.env.CONTACT_EMAIL_SOURCE,
    Destination: {
      ToAddresses: [process.env.CONTACT_EMAIL_DESTINATION]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: text,
          Charset: 'UTF-8'
        }
      }
    }
  }
  
  ses.sendEmail(params).promise()
    .then(data => {
      console.log('Email sent successfully!')
    })
    .catch(error => {
      console.error('Error while sending email:', error.message)
    })
}

app.get('/heartbeat', (req, res) => {
  lastPing = Date.now()
  res.sendStatus(200)
})

setInterval(() => {
  const now = Date.now()
  const heartbeatTimeout = parseInt(process.env.HEARTBEAT_TIMEOUT_MINUTES)
  
  if (!lastPing) {
    if (!isOffline) {
      sendEmail('📡 Internet is down', 'No ping received')
      console.log(`[${new Date().toISOString()}] Internet is down. No ping received`)
      isOffline = true
    }
    return
  }
  
  const diff = (now - lastPing) / 60000

  if (diff > heartbeatTimeout && !isOffline) {
    sendEmail('Internet is down', `Last ping: ${new Date(lastPing).toISOString()}`)
    console.log(`[${new Date().toISOString()}] Internet is down. Last ping: ${new Date(lastPing).toISOString()}`)
    isOffline = true
  }

  if (diff <= heartbeatTimeout && isOffline) {
    sendEmail('Internet is back', `Ping returned: ${new Date().toISOString()}`)
    console.log(`[${new Date().toISOString()}] Internet is back.`)
    isOffline = false
  }
}, parseInt(process.env.CHECK_INTERVAL_MINUTES) * 60 * 1000)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
