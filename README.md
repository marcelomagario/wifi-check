# WiFi Check

A Node.js application that monitors internet connectivity and sends email notifications when the connection goes down or comes back online.

## Features

- **Internet Monitoring**: Continuously monitors internet connectivity through heartbeat requests
- **Email Notifications**: Sends email alerts when internet connection is lost or restored
- **REST API**: Provides a `/heartbeat` endpoint for external monitoring
- **Configurable**: Uses environment variables for easy configuration

## How it Works

The application runs a monitoring loop that:
1. Expects regular heartbeat requests to the `/heartbeat` endpoint
2. If no heartbeat is received for more than 10 minutes, it sends an "Internet is down" email
3. When connectivity is restored, it sends an "Internet is back" email
4. The monitoring loop runs every 6 hours

## Prerequisites

- Node.js (v14 or higher)
- AWS SES or other SMTP service configured
- Environment variables set up

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wifi-check
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=3000
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_from_email@domain.com
EMAIL_TO=your_to_email@domain.com
HEARTBEAT_TIMEOUT_MINUTES=10
CHECK_INTERVAL_HOURS=6
```

## Usage

Start the application:
```bash
node index.js
```

The server will start on the configured port and begin monitoring internet connectivity.

### Heartbeat Endpoint

Send periodic requests to keep the connection alive:
```bash
curl http://localhost:3000/heartbeat
```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | Yes | - |
| `SMTP_HOST` | SMTP host address | No | email-smtp.us-east-1.amazonaws.com |
| `SMTP_PORT` | SMTP port number | No | 587 |
| `SMTP_USER` | SMTP username | Yes | - |
| `SMTP_PASS` | SMTP password | Yes | - |
| `EMAIL_FROM` | Sender email address | Yes | - |
| `EMAIL_TO` | Recipient email address | Yes | - |
| `HEARTBEAT_TIMEOUT_MINUTES` | Minutes without heartbeat before considering offline | No | 10 |
| `CHECK_INTERVAL_HOURS` | Hours between monitoring checks | No | 6 |

### Monitoring Settings

- **Heartbeat timeout**: Configurable via `HEARTBEAT_TIMEOUT_MINUTES` (default: 10 minutes)
- **Check interval**: Configurable via `CHECK_INTERVAL_HOURS` (default: 6 hours)
- **SMTP host**: Configurable via `SMTP_HOST` and `SMTP_PORT` (default: AWS SES)

## Dependencies

- **express**: Web framework for the REST API
- **nodemailer**: Email sending functionality
- **dotenv**: Environment variable management

## Deployment

### AWS EC2 Deployment

1. **Launch EC2 Instance:**
   - Use Ubuntu 22.04 LTS
   - t2.micro (Free Tier)
   - Configure Security Group to allow port 3000

2. **Connect to your instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Clone and deploy:**
   ```bash
   git clone <your-repo-url>
   cd wifi-check
   # Create .env file with your configuration
   ./deploy.sh
   ```

4. **Check status:**
   ```bash
   pm2 status
   pm2 logs wifi-check
   ```

### Environment Variables for Production

Make sure your `.env` file on the server contains all required variables:

```env
PORT=3000
EMAIL_FROM=your@email.com
EMAIL_TO=notifications@email.com
SMTP_USER=your_ses_user
SMTP_PASS=your_ses_password
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
HEARTBEAT_TIMEOUT_MINUTES=10
CHECK_INTERVAL_HOURS=6
```

## License

ISC