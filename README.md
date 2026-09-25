# PitchOps ⚽

A containerized football analytics platform deployed on AWS with a fully automated CI/CD pipeline.

**Live at [pitchopsss.xyz](https://pitchopsss.xyz)**

---

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        GitHub                               │
│  Push to main → GitHub Actions (OIDC) → Build → Deploy     │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   ┌─────────────┐         ┌─────────────────┐
   │  S3 Bucket  │         │   EC2 Instance  │
   │  (static)   │         │  (eu-west-3)    │
   └──────┬──────┘         └───────┬─────────┘
          │                        │
          ▼                        │
   ┌─────────────┐         ┌───────┴─────────┐
   │ CloudFront  │         │     Nginx        │
   │ + ACM SSL   │         │  (SSL termination│
   │ + Custom    │         │   Let's Encrypt) │
   │   Domain    │         └───────┬─────────┘
   └─────────────┘                 │
   pitchopsss.xyz          ┌───────┴─────────┐
                           │  Docker Compose  │
                           ├─────────────────┤
                           │ FastAPI :8000    │
                           │ PostgreSQL :5432 │
                           └───────┬─────────┘
                                   │
                                   ▼
                           API-Football v3
                         (server-side, key never
                          exposed to browser)
```

---

## CI/CD Pipeline

### Frontend Pipeline — `.github/workflows/deploy.yml`

Triggered on every push to `main`:

```
push to main
    │
    ├─► npm ci
    ├─► npm run build  (Next.js static export → /out)
    ├─► OIDC token exchange with AWS STS
    ├─► aws s3 sync out/ → S3
    └─► aws cloudfront create-invalidation → cache bust
```

**Authentication: OIDC (no static credentials)**

Uses `aws-actions/configure-aws-credentials` with `role-to-assume` — GitHub requests a short-lived STS token at runtime. Zero long-lived credentials stored anywhere.

Required GitHub secrets:

| Secret | Purpose |
|---|---|
| `AWS_ROLE_ARN` | IAM role to assume via OIDC |
| `S3_BUCKET` | Deployment target |
| `CF_DISTRIBUTION_ID` | CloudFront invalidation target |
| `NEXT_PUBLIC_API_BASE_URL` | Baked into static build |

### Backend Pipeline — `.github/workflows/deploy.yml` (pitchops-backend repo)

```
push to main
    │
    ├─► docker build
    ├─► trivy image scan (blocks on HIGH/CRITICAL CVEs)
    ├─► SSH into EC2
    ├─► git pull origin main
    ├─► docker compose down
    ├─► docker compose up -d --build
    └─► docker system prune -f
```

Required GitHub secrets:

| Secret | Purpose |
|---|---|
| `EC2_IP` | Target server |
| `EC2_SSH_KEY` | EC2 private key (PEM contents) |

---

## AWS Infrastructure

### IAM — OIDC Federation

Instead of long-lived IAM user access keys, the pipeline uses **OpenID Connect federation**:

1. GitHub's OIDC provider registered in AWS IAM
2. IAM role with trust policy scoped to this exact repo
3. GitHub Actions exchanges a short-lived JWT for temporary STS credentials
4. Credentials expire after 15 minutes

Trust policy handles GitHub's new immutable-ID subject claim format (changed July 15, 2026):

```json
"StringLike": {
  "token.actions.githubusercontent.com:sub": [
    "repo:edothecreator/*",
    "repo:edothecreator@159837701/*",
    "repo:edothecreator@159837701/PitchOps@1386571582:*"
  ]
}
```

IAM role permissions — least privilege:

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::BUCKET", "arn:aws:s3:::BUCKET/*"]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "*"
    }
  ]
}
```

### S3

- Static website hosting enabled
- `index.html` as both index and error document (SPA routing)
- Public access enabled for CloudFront origin
- Synced via `aws s3 sync --delete` on every deploy

### CloudFront

- S3 origin with OAC (Origin Access Control)
- Custom domain: `pitchopsss.xyz`
- SSL: ACM certificate (us-east-1, required for CloudFront)
- Error pages: 403/404 → `/index.html` (200) — critical for client-side routing
- Cache invalidated on every deploy (`/*`)

### EC2

- Region: `eu-west-3` (Europe - Paris)
- OS: Ubuntu 22.04 LTS
- Security group inbound rules:

| Port | Protocol | Purpose |
|---|---|---|
| 22 | TCP | SSH admin access |
| 80 | TCP | Let's Encrypt ACME challenge |
| 443 | TCP | HTTPS production traffic |
| 8000 | TCP | Direct container access (dev/testing) |

### ACM (AWS Certificate Manager)

- Certificate covers `pitchopsss.xyz` and `www.pitchopsss.xyz`
- Validated via DNS (CNAME records in Spaceship DNS)
- Must be provisioned in `us-east-1` for CloudFront attachment
- Auto-renews

---

## EC2 — Container Architecture

Two containers managed by Docker Compose:

```yaml
services:
  backend:   # FastAPI on :8000
  db:        # PostgreSQL 16 on :5432
```

**Nginx** runs on the host as a reverse proxy:
- Listens on :443 (SSL terminated here)
- Proxies to FastAPI container on localhost:8000
- SSL certificate from Let's Encrypt via Certbot
- HTTP → HTTPS redirect on :80

**Why proxy through Nginx instead of exposing FastAPI directly?**
- SSL termination at the edge
- Easy certificate renewal (Certbot handles it automatically)
- FastAPI never handles TLS — simpler, faster

---

## DNS — Spaceship.com

Domain: `pitchopsss.xyz` ($1.86/year)

| Record | Type | Value | Purpose |
|---|---|---|---|
| `@` | CNAME | `d6cymn76yf56.cloudfront.net` | Frontend |
| `api` | A | `51.44.170.52` | Backend EC2 |
| `_480eddf3...` | CNAME | `_4d1daae4...acm-validations.aws` | ACM validation |
| `_ba9f510e...` | CNAME | `_bab59262...acm-validations.aws` | ACM validation |

---

## SSL/TLS

**Frontend (CloudFront + ACM):**
- Free AWS-managed certificate
- Auto-renews
- Covers apex domain + www

**Backend (EC2 + Let's Encrypt):**
```bash
sudo certbot --nginx -d api.pitchopsss.xyz
```
- Free 90-day certificate, auto-renewed by Certbot systemd timer
- Nginx config written automatically by Certbot

---

## Security Design

| Concern | Solution |
|---|---|
| API key exposure | Key stored in Docker env var on EC2, never in frontend |
| CI/CD credentials | OIDC federation — no static keys |
| IAM least privilege | Role scoped to S3 bucket + one CloudFront distribution |
| HTTPS everywhere | ACM on CDN, Let's Encrypt on API |
| CORS | Backend allows only `pitchopsss.xyz` origins |
| Container isolation | FastAPI never directly internet-accessible (Nginx in front) |

---

## Cost

| Resource | Cost |
|---|---|
| EC2 t3.micro | ~$10/month |
| S3 | ~$0.02/month |
| CloudFront | Free tier |
| ACM certificate | Free |
| Let's Encrypt | Free |
| Domain (Spaceship) | $1.86/year |
| **Total** | **~$12/month** |

---

## Local Development

```bash
# Install deps
npm install

# Run with mock data (no backend needed)
NEXT_PUBLIC_USE_MOCK_DATA=true npm run dev

# Build static export
npm run build
# Output: /out — ready for S3
```

```bash
# Test static build locally (mirrors CloudFront SPA behavior)
npx serve -s out
```

---

## Repository Structure

```
.github/
└── workflows/
    └── deploy.yml          # CI/CD: build → S3 → CloudFront invalidation

src/
├── app/                    # Next.js pages
├── components/             # UI components
├── hooks/                  # TanStack Query data hooks
├── lib/api/                # Typed API client (one file to swap backend)
└── data/mock/              # Mock data for dev/demo without backend
```
