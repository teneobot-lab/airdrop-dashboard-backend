#!/bin/bash
# ============================================
# VPS SETUP SCRIPT FOR AIRDROP DASHBOARD
# Run as: sudo bash setup-vps.sh
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=======================================${NC}"
echo -e "${YELLOW}  Airdrop Dashboard - VPS Setup${NC}"
echo -e "${YELLOW}=======================================${NC}"

# Get inputs
read -p "Domain or IP address: " DOMAIN
read -p "Backend port [3003]: " PORT
PORT=${PORT:-3003}

# Update system
echo -e "\n${GREEN}[1/7] Updating system...${NC}"
apt update && apt upgrade -y

# Install prerequisites
echo -e "\n${GREEN}[2/7] Installing prerequisites...${NC}"
apt install -y curl git nginx certbot python3-certbot-nginx

# Install Node.js 18
echo -e "\n${GREEN}[3/7] Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node -v
npm -v

# Setup application
echo -e "\n${GREEN}[4/7] Setting up application...${NC}"
APPDIR="/opt/airdrop-dashboard"
read -p "Project path [$APPDIR]: " APPDIR_INPUT
APPDIR=${APPDIR_INPUT:-$APPDIR}

if [ ! -d "$APPDIR" ]; then
    echo "Directory not found. Please copy the project to $APPDIR first."
    exit 1
fi

cd "$APPDIR/backend"
npm install --production

# Setup environment
echo -e "\n${GREEN}[5/7] Configuring environment...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}Please edit $APPDIR/backend/.env with your settings${NC}"
fi

# Setup Nginx
echo -e "\n${GREEN}[6/7] Configuring Nginx...${NC}"
NGINX_CONF="/etc/nginx/sites-available/airdrop-api"
sudo cp "$APPDIR/backend/nginx/airdrop-api.conf" "$NGINX_CONF"

# Replace placeholder with actual domain
sudo sed -i "s/YOUR_DOMAIN_OR_IP/$DOMAIN/g" "$NGINX_CONF"
sudo sed -i "s/YOUR_DOMAIN/$DOMAIN/g" "$NGINX_CONF"

# Enable site
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
sudo nginx -t

# SSL Certificate
echo -e "\n${GREEN}[7/7] Getting SSL certificate...${NC}"
read -p "Use Let's Encrypt for SSL? (y/n) [y]: " USE_SSL
USE_SSL=${USE_SSL:-y}

if [ "$USE_SSL" = "y" ]; then
    # Stop nginx temporarily
    sudo systemctl stop nginx

    # Get certificate
    sudo certbot certonly --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN"

    # Update nginx config with SSL
    sudo sed -i "s|/etc/letsencrypt/live/YOUR_DOMAIN/|/etc/letsencrypt/live/$DOMAIN/|g" "$NGINX_CONF"

    # Restart nginx
    sudo systemctl start nginx
fi

# Start backend
echo -e "\n${GREEN}[*] Starting backend...${NC}"
cd "$APPDIR/backend"
pm2 stop airdrop-api 2>/dev/null || true
pm2 start server.js --name airdrop-api
pm2 save

# Reload nginx
sudo systemctl reload nginx

echo -e "\n${GREEN}=======================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}=======================================${NC}"
echo -e "Backend API: https://$DOMAIN/api/"
echo -e "Health check: https://$DOMAIN/health"
echo -e ""
echo -e "Commands:"
echo -e "  pm2 logs airdrop-api   - View logs"
echo -e "  pm2 restart airdrop-api - Restart"
echo -e "  certbot renew          - Renew SSL"
echo -e ""