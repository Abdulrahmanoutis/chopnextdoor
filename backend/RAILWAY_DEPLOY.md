# Railway + AWS S3 Deployment (Django Backend)

## 1. Required environment variables

Set these in your Railway backend service:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS` (example: `your-backend.up.railway.app`)
- `DJANGO_CORS_ALLOWED_ORIGINS` (your frontend URL)
- `DJANGO_CSRF_TRUSTED_ORIGINS` (your frontend URL)
- `DATABASE_URL` (auto-provided by Railway when PostgreSQL is attached)
- `USE_S3_MEDIA=True`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_STORAGE_BUCKET_NAME`
- `AWS_S3_REGION_NAME`
- `AWS_MEDIA_LOCATION` (optional, default is `media`)
- `AWS_S3_CUSTOM_DOMAIN` (optional)
- `DJANGO_SECURE_SSL_REDIRECT=True`
- `DJANGO_SECURE_HSTS_SECONDS=31536000`
- `DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=True`
- `DJANGO_SECURE_HSTS_PRELOAD=True`

Optional Gunicorn tuning:

- `WEB_CONCURRENCY=3`
- `GUNICORN_THREADS=2`
- `GUNICORN_TIMEOUT=120`

## 2. Railway setup

1. Push this repo to GitHub.
2. In Railway, create a new project from the repo.
3. Add a PostgreSQL service.
4. Link/deploy the backend service (Railway reads `railway.json` and uses `backend/Dockerfile`).
5. Add all required environment variables above.
6. Redeploy.
7. Verify health endpoint: `https://<your-backend-domain>/health/`

## 3. AWS S3 setup

1. Create an S3 bucket for media uploads.
2. Disable public write access.
3. Create an IAM user with programmatic access.
4. Attach least-privilege policy for this bucket (`s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`, `s3:ListBucket`).
5. Add IAM keys and bucket/region values to Railway env vars.
6. If using CloudFront/custom domain, set `AWS_S3_CUSTOM_DOMAIN`.

## 4. Frontend integration

Set frontend env:

- `VITE_API_BASE_URL=https://<your-backend-domain>/api/`

## 5. Notes

- Startup command runs `migrate` and `collectstatic` automatically via `backend/entrypoint.sh`.
- Media files are stored in S3 when `USE_S3_MEDIA=True`.
- Static files are served by WhiteNoise.
