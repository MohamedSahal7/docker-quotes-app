# Quotes Application — Flask API + React + Docker

A fully-dockerized quotes browser with a **Flask** JSON API backend and a **React** (Vite) frontend served by **Nginx**.

## Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Backend   | Python 3.12 · Flask · CORS    |
| Frontend  | React 18 · Vite · CSS Modules |
| Server    | Nginx (serves React, proxies `/api`) |
| Infra     | Docker Compose                |

## Project Structure

```
quotes-app/
├── docker-compose.yml         # Orchestrates both services
├── backend/
│   ├── app.py                 # Flask API
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── App.module.css
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── nginx.conf             # Serves React + proxies /api → backend
    ├── package.json
    └── Dockerfile             # Multi-stage: Node build → Nginx serve
```

## Quick Start

```bash
# Build images and start both containers
docker compose up --build

# Open in browser
open http://localhost
```

The React app is served at **http://localhost**.  
All `/api/*` requests are automatically proxied by Nginx to the Flask container.

## API Endpoints

| Endpoint                         | Method | Description              |
|----------------------------------|--------|--------------------------|
| `/api/quotes`                    | GET    | All quotes               |
| `/api/quotes/category/<name>`    | GET    | Quotes by category       |
| `/api/categories`                | GET    | Available categories     |
| `/api/info`                      | GET    | App metadata             |

## How the Proxy Works

```
Browser → http://localhost/api/quotes
              ↓
          Nginx (frontend container, port 80)
              ↓  proxy_pass http://backend:5000
          Flask (backend container, internal network)
```

Nginx routes:
- `/api/*` → Flask backend
- everything else → React SPA (`index.html`)

## Useful Commands

```bash
docker compose up --build      # Build + start
docker compose up -d           # Start in background
docker compose down            # Stop + remove containers
docker compose logs -f         # Stream all logs
docker compose logs -f backend # Flask logs only
docker compose ps              # Container status
```

## Expose the API Directly (optional)

To call the Flask API from your host without going through Nginx, edit `docker-compose.yml`:

```yaml
backend:
  ports:
    - "5000:5000"   # add this
```

Then hit `http://localhost:5000/api/quotes`.
