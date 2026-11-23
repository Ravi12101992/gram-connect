# 🚀 Free Cloud Deployment Guide for GramConnect

You can deploy **GramConnect** to the web 100% free with a public HTTPS URL using **Vercel** (recommended by Next.js creators) or **Render / Netlify**.

---

## Option 1: Deploy to Vercel in 2 Minutes (Recommended & 100% Free)

Vercel is the creator of Next.js and provides zero-config free hosting for Next.js App Router applications.

### Step 1: Push your project to GitHub
1. Open your terminal in `C:\Users\RaviTeja.Sadu\Music\gram-connect`:
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/gram-connect.git
git branch -M main
git push -u origin main
```
*(If you haven't created the repository on GitHub yet, go to https://github.com/new and create a new repo named `gram-connect`).*

### Step 2: Import into Vercel
1. Go to [https://vercel.com](https://vercel.com) and sign in with your GitHub account (Free).
2. Click **"Add New..."** → **"Project"**.
3. Select your `gram-connect` repository from the list and click **"Import"**.
4. Keep the default settings:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click **"Deploy"**!

🎉 Within 60 seconds, your application will be live at:
`https://gram-connect-<your-username>.vercel.app`

---

## Option 2: Deploy to Render.com (Free)
1. Go to [https://render.com](https://render.com) and create a free account.
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository.
4. Settings:
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
5. Click **"Create Web Service"**.

---

## Option 3: Connect Free PostgreSQL Database (Supabase / Neon)
If you want persistent cloud PostgreSQL:
1. Create a free PostgreSQL database at [https://supabase.com](https://supabase.com) or [https://neon.tech](https://neon.tech).
2. Copy your connection string:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB_NAME]"
   ```
3. In your Vercel Project Settings → **Environment Variables**, add `DATABASE_URL`.
4. Run `npx prisma db push` to generate all tables automatically!
