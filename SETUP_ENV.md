# Environment Variables Setup Guide

## Quick Start

### For Local Development

1. **Backend Setup:**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your local values
   ```

2. **Frontend Setup:**
   ```bash
   cd client
   cp env.example .env
   # Edit .env with your local values
   ```

3. **For Docker Compose:**
   ```bash
   # In root directory
   cp env.example .env
   # Edit .env with your values
   ```

### For Render Deployment

Copy the values from the example files and paste them into Render's Environment Variables section.

---

## File Locations

- `backend/env.example` - Backend environment template
- `client/env.example` - Frontend environment template  
- `env.example` - Root level template (for docker-compose)

---

## Important Notes

- ✅ `.env.example` files are tracked in Git (safe to commit)
- ❌ `.env` files are **NOT** tracked (in .gitignore)
- 🔒 Never commit actual `.env` files with real secrets
- 📝 Update `.env.example` if you add new required variables

---

## Required Variables Checklist

### Backend (.env)
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `CLIENT_URL` - Frontend URL
- [ ] `JWT_SECRET` - Secret key for JWT (32+ chars)
- [ ] `USER_EMAIL` - Outlook email address
- [ ] `EMAIL_PASS` - Outlook app password

### Frontend (.env)
- [ ] `NEXT_PUBLIC_API_URL` - Backend API URL

---

## Generate Secure JWT Secret

```bash
openssl rand -base64 32
```

Copy the output and use it as your `JWT_SECRET`.

