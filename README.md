# Michelin Discover 🍽️✨

**Michelin Discover** is a full-stack web application designed to browse, filter, explore, and bookmark over 19,000 Michelin Guide 2021 restaurants worldwide. Built with a React (Vite + Tailwind CSS) frontend, an Express + Mongoose backend, and MongoDB.

---

## 🏛️ Architecture & Key Decisions

The project is structured as a deployable monorepo with two independent halves: `backend/` and `frontend/`.

- **Server-Side Ownership (`backend/`)**: The server owns the global restaurant dataset, MongoDB schema, multi-param database filter logic, and similarity recommendation engine (`/restaurants/:id/similar`). This keeps data querying efficient and offloads intensive computations from client devices.
- **Client-Side Ownership (`frontend/`)**: The frontend owns local user state, including interactive map rendering (`react-leaflet`), view mode toggles, and personal restaurant shortlist persistence (`ShortlistContext` + `localStorage`).
- **Data Privacy & Performance**: Bookmarked restaurants remain stored locally on the user's browser, eliminating unneeded network overhead and preserving user privacy without requiring account creation.

---

## 🧹 Dataset & Cleaning Decisions

The raw dataset is sourced from Kaggle (`ngshiheng/michelin-guide-restaurants-2021`). A python cleaning script (`scripts/clean_data.py`) processes the raw dataset prior to database seeding:

1. **Price Tier Standardization**: Currency strings (`$`, `$$`, `$$$`, `$$$$`, `€`, `¥`, `฿`) are mapped to a normalized numeric tier (`1`–`4`) for easy filtering, while retaining original price strings for display.
2. **Cuisine & Facilities Parsing**: Comma-separated strings are transformed into clean JavaScript arrays for `$in` queries and tag pills.
3. **Location Splitting**: Location strings formatted as `"City, Country"` are split into separate `city` and `country` fields.
4. **Green Star Normalization**: Transformed into strict boolean flags (`true`/`false`) representing Michelin's sustainability award.
5. **Row Sanitization**: Rows missing mandatory fields (`Name`, `Latitude`, `Longitude`) are dropped, and every restaurant is assigned a stable unique identifier (e.g. `rest_1`).

> **Dataset Credit**: This dataset is based on research-use web scrapes compiled via Go Colly by `ngshiheng` on Kaggle, and is not an official Michelin Guide export.

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v18+) & `npm`
- Python 3.10+ (for dataset cleaning script)
- MongoDB instance running locally on `mongodb://127.0.0.1:27017`

### 1. Clone & Clean Dataset
```bash
git clone https://github.com/FathimaShums/Michelin-discover.git
cd Michelin-discover

# Install python helper requirements & run data cleaner
python3 -m pip install kagglehub pandas
python3 scripts/clean_data.py
```

### 2. Backend Setup & Database Seeding
```bash
cd backend
npm install

# Seed MongoDB with cleaned dataset
npm run seed

# Run dev server on http://localhost:5000
npm run dev

# Run Vitest backend tests
npm test
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start Vite dev server on http://localhost:3000
npm run dev

# Run Vitest frontend component tests
npm test
```

---

## ☁️ Deployment Instructions

### Backend (Render Blueprint)
1. Link your GitHub repository to [Render](https://render.com).
2. Render automatically detects the root `render.yaml` blueprint configuration.
3. Set the required secret environment variable in Render Dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/michelin`).

### Frontend (Vercel)
1. Deploy the `frontend/` directory to [Vercel](https://vercel.com).
2. Set Environment Variables in Vercel settings:
   - `VITE_API_BASE_URL`: `https://michelin-discover-api.onrender.com/api` (your deployed Render API URL).

---

## 🔮 Future Enhancements & Roadmap
- **User Accounts & Synced Shortlists**: OAuth2 / JWT authentication to sync shortlists across multiple devices.
- **Direct Reservations**: Integration with OpenTable / Resy APIs for instant table booking.
- **ML Recommendation Engine**: Personalized recommendation algorithms learned from real user browsing behavior rather than static similarity heuristics.
- **User Reviews & Photos**: Community review system and photo uploads.
