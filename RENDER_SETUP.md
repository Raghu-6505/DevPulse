# Render Deployment Guide with MongoDB Atlas

## 📋 Step-by-Step: MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (or use Google/GitHub)
3. Complete the registration

### Step 2: Create a Free Cluster
1. After login, you'll see "Create a Deployment"
2. Choose **"M0 FREE"** tier (Free forever, 512MB storage)
3. Select a **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Choose a **Region** closest to your Render deployment:
   - If Render is in US: Choose US region (e.g., `us-east-1`)
   - If Render is in EU: Choose EU region (e.g., `eu-west-1`)
5. Click **"Create Deployment"**
6. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User
1. You'll see a security prompt: **"Create a Database User"**
2. Choose **"Username and Password"** authentication
3. Enter a username (e.g., `snippetmaster-admin`)
4. Click **"Autogenerate Secure Password"** or create your own
5. **IMPORTANT:** Copy and save the password! You won't see it again.
6. Click **"Create Database User"**

### Step 4: Configure Network Access
1. You'll see **"Where would you like to connect from?"**
2. For production, click **"Add My Current IP Address"** first (for testing)
3. Then click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This allows Render to connect
   - MongoDB Atlas free tier allows this
4. Click **"Finish and Close"**

### Step 5: Get Connection String
1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** as driver
4. Select version **"5.5 or later"**
5. You'll see a connection string like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace the placeholders:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add your database name at the end: `?retryWrites=true&w=majority` → `/snippetmaster?retryWrites=true&w=majority`
   
   **Final format:**
   ```
   mongodb+srv://snippetmaster-admin:YourPassword123@cluster0.xxxxx.mongodb.net/snippetmaster?retryWrites=true&w=majority
   ```

### Step 6: Test Connection (Optional)
1. In MongoDB Atlas, click **"Browse Collections"**
2. Your database will be empty initially
3. After your app runs, you'll see collections created automatically

---

## 🚀 Render Deployment Configuration

### Backend Service Setup

#### 1. Create Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository

#### 2. Configure Backend Service
- **Name:** `snippetmaster-backend` (or your choice)
- **Region:** Choose closest to your MongoDB Atlas region
- **Branch:** `master` (or your main branch)
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Plan:** Free (or choose paid for better performance)

#### 3. Environment Variables for Backend
Click **"Environment"** tab and add these variables:

```env
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://snippetmaster-admin:YourPassword123@cluster0.xxxxx.mongodb.net/snippetmaster?retryWrites=true&w=majority
CLIENT_URL=https://snippetmaster-frontend.onrender.com
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this
USER_EMAIL=your-email@outlook.com
EMAIL_PASS=your-outlook-app-password
```

**Important Notes:**
- Replace `MONGO_URI` with your actual MongoDB Atlas connection string
- Replace `CLIENT_URL` with your frontend Render URL (you'll get this after deploying frontend)
- Replace `JWT_SECRET` with a long random string (use: `openssl rand -base64 32`)
- Replace `USER_EMAIL` with your Outlook email
- Replace `EMAIL_PASS` with your Outlook app password (see email setup below)

#### 4. Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Copy the service URL (e.g., `https://snippetmaster-backend.onrender.com`)

---

### Frontend Service Setup

#### 1. Create Another Web Service
1. Click **"New +"** → **"Web Service"**
2. Select the same GitHub repository

#### 2. Configure Frontend Service
- **Name:** `snippetmaster-frontend` (or your choice)
- **Region:** Same as backend
- **Branch:** `master` (or your main branch)
- **Root Directory:** `client`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** Free (or choose paid)

#### 3. Environment Variables for Frontend
Click **"Environment"** tab and add:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://snippetmaster-backend.onrender.com/api/v1
```

**Important:**
- Replace `NEXT_PUBLIC_API_URL` with your actual backend Render URL + `/api/v1`

#### 4. Deploy Frontend
1. Click **"Create Web Service"**
2. Wait for deployment (10-15 minutes for first build)
3. Copy the service URL (e.g., `https://snippetmaster-frontend.onrender.com`)

#### 5. Update Backend CLIENT_URL
1. Go back to your backend service
2. Go to **"Environment"** tab
3. Update `CLIENT_URL` to your frontend URL:
   ```env
   CLIENT_URL=https://snippetmaster-frontend.onrender.com
   ```
4. Click **"Save Changes"** (this will trigger a redeploy)

---

## 📧 Email Configuration (Outlook)

### Setup Outlook App Password
1. Go to https://account.microsoft.com/security
2. Sign in with your Outlook email
3. Go to **"Security"** → **"Advanced security options"**
4. Under **"App passwords"**, click **"Create a new app password"**
5. Name it: `SnippetMaster`
6. Copy the generated password (16 characters)
7. Use this password in `EMAIL_PASS` environment variable

**Note:** If you don't see "App passwords", enable 2FA first.

---

## ✅ Complete Environment Variables Checklist

### Backend (Render Web Service)
- [ ] `NODE_ENV=production`
- [ ] `PORT=8000`
- [ ] `MONGO_URI=mongodb+srv://...` (from MongoDB Atlas)
- [ ] `CLIENT_URL=https://your-frontend.onrender.com`
- [ ] `JWT_SECRET=long-random-string-32-chars-minimum`
- [ ] `USER_EMAIL=your-email@outlook.com`
- [ ] `EMAIL_PASS=your-outlook-app-password`

### Frontend (Render Web Service)
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1`

---

## 🔍 Troubleshooting

### MongoDB Connection Issues
- **Error: "MongoServerError: bad auth"**
  - Check username and password in connection string
  - Make sure password is URL-encoded (replace special chars with % encoding)

- **Error: "MongoNetworkError"**
  - Check Network Access in MongoDB Atlas
  - Make sure "Allow Access from Anywhere" (0.0.0.0/0) is added

- **Error: "MongooseServerSelectionError"**
  - Check if cluster is running (not paused)
  - Verify connection string format

### Render Deployment Issues
- **Build fails:**
  - Check build logs in Render dashboard
  - Make sure all dependencies are in package.json
  - Check Node version compatibility

- **App crashes:**
  - Check environment variables are set correctly
  - Check Render logs for errors
  - Verify MongoDB connection string

### Email Issues
- **Email not sending:**
  - Verify Outlook app password is correct
  - Check if 2FA is enabled on Outlook account
  - Make sure `USER_EMAIL` matches your Outlook email

---

## 🔒 Security Best Practices

1. **Never commit `.env` files to Git**
2. **Use strong JWT_SECRET** (32+ characters, random)
3. **Use MongoDB Atlas IP whitelist** (though 0.0.0.0/0 is okay for free tier)
4. **Rotate passwords regularly**
5. **Use environment variables** for all secrets

---

## 📝 Quick Reference

### MongoDB Atlas Connection String Format
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### Generate Strong JWT Secret
```bash
openssl rand -base64 32
```

### Render URLs Format
- Backend: `https://snippetmaster-backend.onrender.com`
- Frontend: `https://snippetmaster-frontend.onrender.com`

---

## 🎉 After Deployment

1. Test your backend API: `https://your-backend.onrender.com/api/v1/health` (if you have a health endpoint)
2. Test your frontend: `https://your-frontend.onrender.com`
3. Check MongoDB Atlas → Browse Collections to see your data
4. Monitor logs in Render dashboard

Good luck with your deployment! 🚀

