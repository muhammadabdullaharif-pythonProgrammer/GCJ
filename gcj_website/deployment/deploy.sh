#!/usr/bin/env bash
set -euo pipefail

# GCJ Official Website - Deployment script for Ubuntu 22.04 + Docker Compose
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"  # gcj_website/deployment
PROJECT_DIR="$(cd "${ROOT_DIR}/.." && pwd)"                # gcj_website

ENV_FILE="${ROOT_DIR}/.env.production"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.yml"

# Expected domain for SSL
DOMAIN=${DOMAIN:-"gcj.example.com"}
EMAIL=${EMAIL:-"admin@gcj.example.com"}

echo "[1/6] Validating environment file: ${ENV_FILE}"
if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found. Copy/edit it with real values before deploying." >&2
  exit 1
fi

echo "[2/6] Loading env into compose"
# Compose automatically reads .env only from the working directory; we pass env-file via export.
set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

echo "[3/6] Creating SSL certs directory (if needed)"
mkdir -p "${ROOT_DIR}/certs/live/${DOMAIN}" || true

echo "[4/6] Starting Docker containers (DB + Redis + Backend + Frontend + Nginx)"
cd "${ROOT_DIR}"
# Ensure docker compose picks up variables
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d --build

echo "[5/6] Applying migrations + collecting static (idempotent)"
# Run manage.py inside backend container
BACKEND_CONTAINER="gcj_django_backend"
# Wait briefly for backend to exist
for i in {1..30}; do
  if docker ps --format '{{.Names}}' | grep -q "^${BACKEND_CONTAINER}$"; then
    break
  fi
  sleep 1
done

docker exec "${BACKEND_CONTAINER}" bash -lc "python gcj_backend/manage.py migrate --noinput"
docker exec "${BACKEND_CONTAINER}" bash -lc "python gcj_backend/manage.py collectstatic --noinput"

echo "[6/6] Printing container status"
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" ps

echo "Deployment complete."

echo "Next: Configure Let’s Encrypt + SSL on Nginx."
if ! command -v certbot >/dev/null 2>&1; then
  echo "certbot not found on host. Install it if you want automatic SSL:" 
  echo "  sudo apt-get update && sudo apt-get install -y certbot" 
  echo "and then run manual steps below."
  exit 0
fi

echo "Optional SSL setup using certbot standalone (stops nginx temporarily if needed)."
# NOTE: This uses certbot standalone; adjust if port 80 is blocked.
sudo certbot certonly --standalone --preferred-challenges http-01 -d "${DOMAIN}" -m "${EMAIL}" --agree-tos --non-interactive || true

echo "SSL requested (if already issued, certbot exits successfully)."

echo "If you want Nginx to serve HTTPS: update gcj_website/deployment/nginx.conf to include your SSL server block and mount cert paths."

