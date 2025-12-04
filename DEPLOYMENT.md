# Deployment Guide

## 🚀 Hosting Options for Docker Containers

**Important:** Netlify does **NOT** support Docker containers. Use one of these alternatives:

### Recommended Platforms:
1. **Railway** (Easiest) - https://railway.app
   - Great for Docker deployments
   - Free tier available
   - Automatic deployments from GitHub

2. **Render** - https://render.com
   - Supports Docker containers
   - Free tier available
   - Easy setup

3. **Fly.io** - https://fly.io
   - Docker-native platform
   - Global edge deployment
   - Free tier available

4. **DigitalOcean App Platform** - https://www.digitalocean.com/products/app-platform
   - Docker support
   - Pay-as-you-go

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account (M0 cluster is free)

2. **Create a Cluster:**
   - Choose a cloud provider and region
   - Select M0 (Free) tier
   - Wait for cluster to be created (~5 minutes)

3. **Configure Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Set privileges to "Atlas admin" or custom role

4. **Configure Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For production: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For development: Add your current IP

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `snippetmaster`)

6. **Update Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/snippetmaster?retryWrites=true&w=majority
   ```

### Option 2: Other MongoDB Hosting Services
- **MongoDB Atlas** (Recommended) - Free tier available
- **MongoDB Cloud** - Official cloud service
- **ScaleGrid** - Managed MongoDB hosting
- **MongoDB on AWS/GCP/Azure** - Enterprise options

## 📋 Environment Variables

### Backend (.env)
```env
PORT=8000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/snippetmaster?retryWrites=true&w=majority
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
```

## 🐳 Docker Deployment Steps

### Using Railway (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Project:**
   ```bash
   railway init
   ```

4. **Deploy Backend:**
   ```bash
   cd backend
   railway up
   ```

5. **Set Environment Variables:**
   - Go to Railway dashboard
   - Add all environment variables from backend/.env.example

6. **Deploy Frontend:**
   ```bash
   cd ../client
   railway up
   ```

### Using Render

1. **Create New Web Service:**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add all environment variables

3. **Configure Frontend:**
   - Create another Web Service
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables

### Using Docker Compose (Local Development)

1. **Create .env files:**
   - Copy `.env.example` to `.env` in both `backend/` and `client/` directories
   - Fill in your values

2. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access:**
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000

## 🔒 Security Checklist

- [ ] Use MongoDB Atlas with strong password
- [ ] Set up IP whitelist in MongoDB Atlas
- [ ] Use strong JWT_SECRET (random string, 32+ characters)
- [ ] Use HTTPS in production
- [ ] Set proper CORS origins
- [ ] Never commit .env files to git
- [ ] Use environment variables for all secrets

## 📝 Notes

- **MongoDB Atlas Free Tier:** 512MB storage, shared resources
- **For Production:** Consider upgrading to paid tier for better performance
- **Backup:** MongoDB Atlas provides automatic backups on paid tiers
- **Monitoring:** Use MongoDB Atlas monitoring dashboard

