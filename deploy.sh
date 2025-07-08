#!/bin/bash

# Deploy script for AWS EC2
echo "Starting deployment..."

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install project dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Please create .env file with your configuration"
    exit 1
fi

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo "Deployment completed!"
echo "Check status: pm2 status"
echo "Check logs: pm2 logs wifi-check" 