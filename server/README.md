# Prescripto Server

This is a minimal Express backend that supports MongoDB (via MONGODB_URI) or a fallback file-based JSON store.

Setup
1. Copy `.env.example` to `.env` and set variables. If you want to use MongoDB Atlas, set `MONGODB_URI` to the connection string.

2. Install:

```powershell
cd server
npm install
```

3. Seed sample data (optional):

```powershell
npm run seed
```

4. Run server:

```powershell
npm run dev
```

If `MONGODB_URI` is not set, the server will use `server/data.json` to persist data locally.
