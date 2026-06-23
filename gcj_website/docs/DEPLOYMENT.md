# GCJ Official Website Deployment (Ubuntu 22.04)

This guide deploys the **GCJ Official Website** using Docker + Docker Compose.

## 1) Prerequisites
- Ubuntu 22.04 server
- Root/sudo access
- Domain name pointing to this server (example: `gcj.example.com`)

## 2) Install Docker Engine + Docker Compose
### Install Docker
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

### Enable Docker service
```bash
sudo systemctl enable docker
sudo systemctl start docker
```

### Install Docker Compose plugin (recommended)
```bash
sudo apt-get install -y docker-compose-plugin
```

### Verify
```bash
docker --version
docker compose version
```

## 3) Configure environment variables
1. SSH into server.
2. Go to repo folder:
   ```bash
   cd /home/<SSH_USER>/gcj_website/deployment
   ```
3. Edit:
   - `./.env.production`

You must set at minimum:
- `DJANGO_SECRET_KEY`
- `JWT_SECRET_KEY`
- `DB_PASSWORD`, `DB_ROOT_PASSWORD`
- `GEMINI_API_KEY`
- `FRONTEND_URL` (use your real domain)

## 4) Start MySQL + Redis + Django + Frontend + Nginx
From `gcj_website/deployment`:
```bash
cd /home/<SSH_USER>/gcj_website/deployment
sudo chmod +x ./deploy.sh
./deploy.sh
```

What this does:
- Starts containers using `docker-compose.yml`
- Runs `python manage.py migrate`
- Runs `python manage.py collectstatic`

## 5) SSL with Let’s Encrypt (Nginx HTTPS)
### Option A (recommended): Use certbot standalone
If ports 80/443 are open:
```bash
sudo apt-get update
sudo apt-get install -y certbot

DOMAIN="gcj.example.com"
EMAIL="admin@gcj.example.com"

sudo certbot certonly --standalone \
  --preferred-challenges http-01 \
  -d "$DOMAIN" \
  -m "$EMAIL" \
  --agree-tos \
  --non-interactive
```

Then update `gcj_website/deployment/nginx.conf` to include an HTTPS `server { listen 443 ssl; ... }` block that references:
- `/etc/letsencrypt/live/<DOMAIN>/fullchain.pem`
- `/etc/letsencrypt/live/<DOMAIN>/privkey.pem`

### Option B: certbot with Nginx (requires Nginx config for ACME)
You can also use certbot’s `--nginx` mode if you incorporate the ACME challenge locations into `nginx.conf`.

## 6) Run containers
Once SSL is configured (optional):
```bash
docker compose -f docker-compose.yml --env-file .env.production up -d --build
```

## 7) Monitor logs
### Nginx
```bash
docker logs -f gcj_nginx_proxy
```

### Backend (Gunicorn)
```bash
docker logs -f gcj_django_backend
```

### MySQL
```bash
docker logs -f gcj_mysql_db
```

### Redis
```bash
docker logs -f gcj_redis
```

## 8) Troubleshooting
- **Backend cannot connect to MySQL**:
  - Confirm `DB_HOST=db` and passwords match `.env.production`.
- **CORS issues**:
  - Ensure `FRONTEND_URL` matches your frontend origin.
- **Rate limiting blocked**:
  - Adjust Nginx `limit_req` and zone rate in `deployment/nginx.conf`.

