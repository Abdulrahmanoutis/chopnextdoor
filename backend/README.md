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
