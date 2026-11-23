# GramConnect — Smart Village Development App
### మన గ్రామం · మన బాధ్యత (Smart Village · Better Living)

Flowchart-based village governance and grievance management platform built with:
- **Frontend**: Next.js App Router (React 19) + Tailwind CSS + Lucide Icons
- **Backend**: Next.js Server Actions & API Routes + Node.js
- **Database**: PostgreSQL (Prisma ORM schema) & Supabase-compatible store
- **Language**: TypeScript
- **Bilingual**: Full English & Telugu (తెలుగు) toggle

---

## 🏛️ Application Architecture & Portals

### 1. 👨‍🌾 Citizen Portal (పౌరుల సేవలు)
- **Report a Problem**:
  - 4 categories with Telugu descriptions:
    - 🧹 **Sanitation (పారిశుధ్యం)**: Garbage dumping, missed collection, public toilets
    - 🌊 **Drainage (మురుగు కాలువలు)**: Blocked drains, desilting, stagnant water
    - 🚰 **Drinking Water (రక్షిత తాగునీరు)**: Pipeline leakages, public tap repairs, tank supply
    - 💡 **Streetlights (వీధి దీపాలు)**: Non-working bulbs, damaged electric poles
  - Photo evidence upload with camera preview
  - GPS Coordinate capture (`16.5065° N, 80.6480° E`)
  - Ward selector (Ward 1 to Ward 7) & Landmark description
  - Instant Complaint ID generation (e.g., `GC-2026-105`)
- **My Complaints & Status Tracking**:
  - Visual 5-step lifecycle timeline:
    - `Reported` → `Assigned` → `In Progress` → `Completed` → `Verified & Closed`
  - Citizen Verification & Feedback: 5-star rating, comments, and **"Verify & Close"** or **"Reopen / Not Satisfied"**.

---

### 2. 🏛️ Panchayat Admin Portal (పంచాయతీ పాలనా డాష్‌బోర్డ్)
- **KPI Metrics**: Total Complaints, Pending Review, In Progress, Completed, Overdue alerts
- **Ledger & Filters**: Filter by Category, Ward, Status, or search by citizen name/ID
- **Worker Assignment Modal**:
  - Assign to verified field workers (Shiva Kumar, Suresh Reddy, Apparao)
  - Set Priority (`URGENT`, `HIGH`, `MEDIUM`, `LOW`)
  - Set Target Due Date
- **Verification & Closure Loop**:
  - Side-by-side inspection of Citizen Original Photo vs Field Worker Completion Photo
  - One-click **"Verify & Mark Closed"** or **"Send Back for Rework"**
- **Report Export**: Export live grievance ledger as CSV.

---

### 3. 👷 Field Worker Portal (ఫీల్డ్ వర్కర్ టాస్క్ సెంటర్)
- Work order queue (`Assigned to Me`, `In Progress`, `Completed`)
- Site navigation, citizen contact details, and landmark instructions
- One-click **"Start Work"** on site
- **"Mark Completed"** with after-work completion evidence photo & resolution notes.

---

### 4. 🗺️ Village GIS Map & Public Assets
- Interactive map canvas with filter layers:
  - Active grievances color-coded by urgency
  - Village assets: Overhead water tanks, RO plants, solar high-mast lights, storm drains, community toilets.

---

### 5. 🏗️ Development Works Tracker & 📢 Announcements & 📞 Emergency Helplines
- Public project ledger with budgets, funding sources (15th Finance Commission, Jal Jeevan Mission), and progress percentages
- Official Grama Sabha circulars and water supply timing announcements
- 24/7 one-click emergency contact dials for Panchayat Secretary, Line-man, Plumber, and ANM Health worker.

---

## 🚀 How to Run Locally

```bash
cd gram-connect
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 How to Deploy for Free (Vercel / Render / Netlify)

See detailed steps in [DEPLOYMENT.md](file:///C:/Users/RaviTeja.Sadu/Music/gram-connect/DEPLOYMENT.md).
