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
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=your_from_email@domain.com
EMAIL_TO=your_to_email@domain.com
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

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `SMTP_USER` | SMTP username | Yes |
| `SMTP_PASS` | SMTP password | Yes |
| `EMAIL_FROM` | Sender email address | Yes |
| `EMAIL_TO` | Recipient email address | Yes |

### Monitoring Settings

- **Heartbeat timeout**: 10 minutes (hardcoded)
- **Check interval**: 6 hours (hardcoded)
- **SMTP host**: AWS SES (email-smtp.us-east-1.amazonaws.com:587)

## Dependencies

- **express**: Web framework for the REST API
- **nodemailer**: Email sending functionality
- **dotenv**: Environment variable management

## License

ISC