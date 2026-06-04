# ShopEase — Local + Vercel Setup (VS Code Terminal)

## LOCAL (2 terminals)

### Terminal 1 — Server
```powershell
cd "C:\My Syllabus\SDA-Lab-main"
npx kill-port 9999
cd server
npm start
```
Wait for: `🚀 Server running on http://localhost:9999`

### Terminal 2 — Client
```powershell
cd "C:\My Syllabus\SDA-Lab-main\client"
npm start
```
Browser: http://localhost:3000

### MongoDB local (Compass)?
`server/.env`:
```
MONGODB_URI=mongodb://127.0.0.1:27017/E-commerce
```

### MongoDB Atlas?
```
MONGODB_URI=mongodb+srv://USER:PASS@cluster....mongodb.net/E-commerce
```
Atlas → Network Access → `0.0.0.0/0` allow.

---

## VERCEL + MongoDB (Render NOT needed)

API runs on Vercel and connects to MongoDB Atlas.

### Step 1 — Vercel Environment Variables

Vercel → **shopease-kiet** → **Settings** → **Environment Variables**

| Name | Value |
|------|--------|
| `MONGODB_URI` | Atlas string from server/.env |
| `JWT_SECRET` | from server/.env |

### Step 2 — Redeploy

Deployments → **Redeploy**

### Step 3 — Test

`https://shopease-kiet.vercel.app/api/products` → JSON = connected

Login: `https://shopease-kiet.vercel.app/login`

---

## Vercel CLI (optional)

```powershell
npm i -g vercel
cd "C:\My Syllabus\SDA-Lab-main"
vercel login
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel --prod
```
