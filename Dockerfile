# Full stack Dockerfile for a single container app.
# Builds the React frontend, installs Flask backend dependencies,
# and runs Flask to serve everything.

# Frontend build stage
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# Final image with Python backend and the built frontend static files
FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY --from=frontend-build /app/dist ./dist

EXPOSE 5000
CMD ["python", "app.py"]
