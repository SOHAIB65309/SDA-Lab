# ShopEase — Vercel + MongoDB (Atlas) Setup

Vercel **directly** MongoDB se connect nahi hota. Flow yeh hai:

```
Vercel (React)  →  Render (Node API)  →  MongoDB Atlas
```

## 1. MongoDB Atlas

1. [cloud.mongodb.com](https://cloud.mongodb.com) → cluster
2. **Database Access** → user + password
3. **Network Access** → `0.0.0.0/0` (Allow from anywhere)
4. **Connect** → Drivers → copy connection string:
   ```
   mongodb+srv://USER:PASS@cluster....mongodb.net/E-commerce
   ```

## 2. Render (Backend — database yahan connect hoti hai)

1. [render.com](https://render.com) → **New Web Service**
2. Repo: `Muhammad-Sharib/shopease-kiet`
3. Settings:

| Field | Value |
|-------|--------|
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm run prod` |

4. **Environment Variables** (same as `server/.env`):

| Key | Value |
|-----|--------|
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | your secret |
| `STRIPE_SECRET_KEY` | sk_test_... |
| `STRIPE_PUBLISHABLE_KEY` | pk_test_... |

5. Deploy → copy URL e.g. `https://shopease-api-xxxx.onrender.com`

6. Test in browser — should show:
   ```json
   {"status":"ok","database":"connected"}
   ```

## 3. Vercel (Frontend)

1. Project **shopease-kiet** → **Settings** → **Environment Variables**
2. Add:

```
REACT_APP_API_URL = https://YOUR-RENDER-URL.onrender.com
```

3. **Deployments** → **Redeploy**

## 4. Local development

**Port 9999 busy error?** Pehle band karo:

```powershell
npx kill-port 9999
```

Phir:

```bash
cd server
npm start
```

```bash
cd client
npm start
```

Client uses `http://localhost:9999` automatically (`client/.env.development`).
