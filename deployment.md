# Deployment Guide: CashLytics 🚀

Follow these steps to deploy your application to a production environment (e.g., VPS, AWS, DigitalOcean).

## 1. Prerequisites
- A server with **Docker** and **Docker Compose** installed.
- Your Supabase Project URL and Keys.
- A domain name (optional, but recommended).

## 2. Environment Configuration
Create a `.env` file on your server with your production credentials.

> [!CAUTION]
> Never commit your `.env` file to version control (Git).

```env
# Backend (Python)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Frontend (Vite)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
VITE_API_URL="https://api.yourdomain.com" # Or the public IP of your server
```

## 3. Prepare Supabase
1. **RLS Policies**: Ensure Row Level Security (RLS) is enabled on your `transactions` table.
2. **Auth Settings**: 
   - Add your production URL to the "Site URL" and "Redirect URLs" in Supabase Auth settings.
   - For production, it is recommended to **enable** Email Confirmation and configure an SMTP provider (like Resend).

## 4. Run the Application
On your server, run:
```bash
docker-compose up -d --build
```
This will start:
- **Backend**: FastAPI on port 8000 (accessible via reverse proxy).
- **Frontend**: Nginx on port 80 (serving the built React app).

## 5. Reverse Proxy (Nginx/Traefik)
If you are using a domain, set up a reverse proxy to handle SSL (HTTPS):
- Route `yourdomain.com` to the frontend container.
- Route `api.yourdomain.com` to the backend container.

## 6. Maintenance
To update the app with new changes:
1. `git pull` the latest code.
2. `docker-compose up -d --build` to restart with the new version.
