Backend (Django) setup

Quick start (macOS / Linux):

1. Create a virtual environment and activate it:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. (Optional) Copy example env and edit:

```bash
cp .env.example .env
# edit .env to set DJANGO_SECRET_KEY, etc.
```

4. Run migrations and start server:

```bash
python manage.py migrate
python manage.py runserver
```

Notes:
- The project uses SQLite by default (`db.sqlite3`).
- `shopnextdoor_backend/settings.py` reads `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, and `DJANGO_ALLOWED_HOSTS` from the environment.

Production readiness checklist:

- Set `DJANGO_DEBUG=False`.
- Set a strong `DJANGO_SECRET_KEY`.
- Set `DJANGO_ALLOWED_HOSTS` to your backend domain(s).
- Set `DJANGO_CORS_ALLOWED_ORIGINS` and `DJANGO_CSRF_TRUSTED_ORIGINS` to your frontend domain(s).
- Move from SQLite to Postgres via `DJANGO_DB_*` env vars.
- Run `python manage.py migrate` on the production database.
- Collect static files: `python manage.py collectstatic --noinput`.
- Serve with Gunicorn/Uvicorn behind Nginx or a managed platform router.
- Configure HTTPS termination and keep `DJANGO_SECURE_SSL_REDIRECT=True`.
- Ensure persistent storage (or object storage) for uploaded media files.
- Add monitoring/logging and regular DB backup.

Railway + AWS S3:

- See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for production deployment config and steps.
