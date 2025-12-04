# Environment Variables Reference

## Backend Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string (from MongoDB Atlas) | `mongodb+srv://user:pass@cluster.mongodb.net/snippetmaster?retryWrites=true&w=majority` |
| `CLIENT_URL` | Frontend URL (for CORS and email links) | `https://snippetmaster-frontend.onrender.com` |
| `JWT_SECRET` | Secret key for JWT token signing (min 32 chars) | `your-super-secret-jwt-key-32-chars-minimum` |
| `USER_EMAIL` | Outlook email address for sending emails | `your-email@outlook.com` |
| `EMAIL_PASS` | Outlook app password (not regular password) | `abcd-efgh-ijkl-mnop` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `NODE_ENV` | Environment mode | `development` |

---

## Frontend Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://snippetmaster-backend.onrender.com/api/v1` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |

---

## Quick Setup for Render

### Backend Service Environment Variables:
```env
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/snippetmaster?retryWrites=true&w=majority
CLIENT_URL=https://your-frontend.onrender.com
JWT_SECRET=generate-with-openssl-rand-base64-32
USER_EMAIL=your-email@outlook.com
EMAIL_PASS=your-outlook-app-password
```

### Frontend Service Environment Variables:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

---

## Generate JWT Secret

Use this command to generate a secure JWT secret:
```bash
openssl rand -base64 32
```

---

## Notes

- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Never commit `.env` files to Git
- Use different JWT_SECRET for production vs development
- MongoDB Atlas connection string must include database name
- Outlook app password is different from your regular password

