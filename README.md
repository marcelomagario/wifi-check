# Wi-Fi Connectivity Notification

A Node.js application that monitors internet connectivity of a remote device (Galaxy A5 2016) and sends email notifications when the connection goes down or comes back online, using AWS EC2 and AWS SES.

## Features

- **Internet Monitoring:** Continuously monitors connectivity through heartbeat requests from your device.
- **Email Notifications:** Sends email alerts when internet connection is lost or restored, using AWS SES.
- **REST API:** Provides a `/heartbeat` endpoint for external monitoring.
- **Configurable:** Uses environment variables for easy configuration.
- **Low Cost:** Can run 24/7 on AWS Free Tier (t2.micro + SES).

## How it Works

The application runs a monitoring loop that:
1. Expects regular heartbeat requests to the `/heartbeat` endpoint from your Galaxy A5 2016 (or any device).
2. If no heartbeat is received for more than the configured timeout, it sends an "Internet is down" email.
3. When connectivity is restored, it sends an "Internet is back" email.

## Architecture

![Architecture Diagram](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fz1cvs04trrfl12cn9fad.png)

## Prerequisites

- Node.js (v20 or higher)
- AWS EC2 instance (t2.micro or t3.micro recommended for Free Tier)
- AWS SES (Simple Email Service) with sender and recipient emails verified in the **same region as your EC2**
- Environment variables set up

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd wifi-check
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=3000
   HEARTBEAT_TIMEOUT_MINUTES=2
   CHECK_INTERVAL_MINUTES=1

   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   CONTACT_EMAIL_SOURCE=your_verified_email@gmail.com
   CONTACT_EMAIL_DESTINATION=recipient_email@gmail.com

   # SMTP variables below are legacy and not required anymore
   # SMTP_USER=your_email@gmail.com
   # SMTP_PASS=your_password
   # SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   # SMTP_PORT=587
   ```

   > **IMPORTANT:** The sender email must be verified in AWS SES in the **same region** as your EC2 instance. If SES is in sandbox mode, the recipient must also be verified.

## Usage

Start the application:
```sh
node index.js
```

The server will start on the configured port and begin monitoring internet connectivity.

### Heartbeat Endpoint

Send periodic requests from your device to keep the connection alive:
```sh
curl http://<ec2-public-ip>:3000/heartbeat
```

## Common Issues & Solutions

- **Email address is not verified:**  
  Make sure both sender and recipient emails are verified in the same AWS SES region as your EC2 instance.

- **Emails go to spam:**  
  - Avoid using Gmail as the sender. Prefer a custom domain with SPF/DKIM configured.
  - Mark emails as “Not spam” in your inbox.
  - Improve email content to look less like automated spam.

- **Region mismatch:**  
  - Both your EC2 and SES must be in the same region, and emails must be verified in that region.

- **Free Tier:**  
  - t2.micro/t3.micro and up to 30GB EBS are free for 12 months for new AWS accounts.

## Deployment on EC2

1. SSH into your EC2 instance:
   ```sh
   ssh ec2-user@<ec2-public-ip>
   ```

2. Pull the latest code and install dependencies:
   ```sh
   git pull
   npm install
   ```

3. Update your `.env` file as needed.

4. Start or restart your app (using pm2 or node):
   ```sh
   pm2 restart all
   # or
   node index.js &
   ```

5. Check logs:
   ```sh
   pm2 logs
   tail -f ~/.pm2/logs/wifi-check-out-0.log
   ```

## Dependencies

- **express**: Web framework for the REST API
- **dotenv**: Environment variable management
- **aws-sdk**: AWS SES integration for sending emails

## License

ISC

---

**Last updated: 2025-07-09**