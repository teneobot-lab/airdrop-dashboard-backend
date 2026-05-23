# Airdrop Dashboard

Full-stack crypto airdrop tracking app.

## Architecture

```
Vercel CDN (Frontend) ──proxy /api──► Nginx + SSL ──► Express :3003 ──► MySQL
                                (VPS)           (HTTPS)
```

---

## 🚀 Deploy ke VPS

### 1. Setup Otomatis (Recommended)

```bash
# Login ke VPS
ssh user@your-vps-ip

# Copy project ke VPS
# scp -r airdrop-dashboard user@your-vps-ip:/opt/

# Jalankan setup script
cd /opt/airdrop-dashboard/backend
chmod +x setup-vps.sh
sudo bash setup-vps.sh
```

Script akan:
- Install Node.js 18, Nginx, Certbot
- Setup SSL certificate (Let's Encrypt)
- Configure Nginx dengan HTTPS
- Start backend dengan PM2

### 2. Setup Manual

#### Install dependencies:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx
npm install -g pm2
```

#### Setup project:
```bash
cd /opt/airdrop-dashboard/backend
npm install --production

# Edit .env
nano .env
```

#### Configure Nginx:
```bash
# Copy config
sudo cp nginx/airdrop-api.conf /etc/nginx/sites-available/airdrop-api
sudo ln -s /etc/nginx/sites-available/airdrop-api /etc/nginx/sites-enabled/

# Edit domain/IP di config
sudo nano /etc/nginx/sites-available/airdrop-api
# Ganti YOUR_DOMAIN_OR_IP dengan IP atau domain Anda

# Test & reload
sudo nginx -t
sudo systemctl reload nginx
```

#### SSL Certificate:
```bash
# Stop nginx dulu
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com

# Edit nginx config untuk path SSL yang benar
sudo nano /etc/nginx/sites-available/airdrop-api
# Pastikan path: /etc/letsencrypt/live/your-domain.com/

# Start nginx
sudo systemctl start nginx
```

#### Start Backend:
```bash
cd /opt/airdrop-dashboard/backend
pm2 start server.js --name airdrop-api
pm2 save
pm2 startup
```

---

## 🚀 Deploy ke Vercel

### 1. Update vercel.json
Edit `frontend/vercel.json` — ganti `YOUR_DOMAIN` dengan domain/VPS IP Anda:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-domain.com/api/$1"
    }
  ]
}
```

### 2. Deploy
```bash
cd frontend
vercel
```

Atau push ke GitHub dan connect repository di Vercel dashboard.

### 3. Set Environment Variable
Di Vercel dashboard:
```
VITE_API_URL=/api
```

---

## 🔧 Commands

### VPS
```bash
pm2 logs airdrop-api      # View logs
pm2 restart airdrop-api   # Restart
pm2 status               # Status
sudo certbot renew       # Renew SSL
sudo systemctl reload nginx  # Reload nginx config
```

### Local Dev
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

---

## 📁 Struktur File

```
airdrop-dashboard/
├── backend/
│   ├── server.js           # Express entry point
│   ├── .env.example        # Environment template
│   ├── package.json
│   ├── setup-vps.sh        # VPS auto-setup script
│   ├── nginx/
│   │   └── airdrop-api.conf  # Nginx config
│   ├── db/
│   │   └── init.sql        # Database schema
│   └── src/
│       ├── db/             # Database connection
│       ├── routes/         # API routes
│       └── middleware/      # Error handler
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── vite.config.ts
│   ├── vercel.json         # Vercel config
│   └── package.json
│
└── README.md
```

---

## 🆘 Troubleshooting

### CORS Error
- Pastikan `FRONTEND_ORIGIN` di backend `.env` sesuai dengan URL Vercel
- Format: `https://your-app.vercel.app` (dengan `https://`)

### SSL Certificate Error
```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal
```

### Backend tidak running
```bash
pm2 status
pm2 logs airdrop-api
```

### Nginx error
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```