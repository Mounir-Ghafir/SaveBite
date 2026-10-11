# SaveBite

SaveBite is a small web app that helps reduce food waste. **Stores** publish items that are close to their expiry date at a reduced price, and **consumers** browse the deals from every store in one place.

Built as a MERN-style mini-project (MongoDB, Express, React, Node) — the database is **MongoDB with Mongoose** (the project uses NoSQL, approved by the teacher).

## Features

- **Authentication** with email + password (JWT). Two roles: `store` and `consumer`.
- **Consumers**: browse all non-expired deals from every store, with the store name, the old price (struck through), the new price, the discount %, and the days left. Items expiring soon are highlighted. Expired items are hidden.
- **Stores**: a dashboard with their own items (expired ones included, with an "Expired" badge), and create / edit / delete items with validation.
- **Access control** on both sides: protected routes in the UI (UX) and real enforcement on the API (middleware + business rules).
- **Friendly states** everywhere: loading, error with Retry, and empty messages.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB (Community Server 8) |
| Auth | JSON Web Tokens (`jsonwebtoken`), `bcrypt` |
| Validation | Joi |
| Frontend | React 19, React Router 7, Axios, Vite 8 |
| Styling | Plain CSS (CSS variables) |

## Prerequisites

Versions verified during development:

| Tool | Version |
|---|---|
| Node.js | v22.14.0 (LTS) |
| npm | 10.9.2 |
| MongoDB Server (`mongod`) | 8.0.32 |
| `mongosh` | 2.13.0 |
| Git | 2.43.0 |

Docker or MongoDB Atlas also work — you only need a reachable MongoDB connection string.

## Project structure

```
SaveBite/
├─ backend/
│  ├─ scripts/seed.js          # fills the database with demo data
│  └─ src/
│     ├─ app.js                # express app (cors, json, routes, errors)
│     ├─ server.js             # starts the server + connects the DB
│     ├─ config/db.js          # mongoose connection
│     ├─ models/               # userModel, itemModel (schema + data access)
│     ├─ validators/           # Joi schemas
│     ├─ middleware/           # auth, requireRole, validate, notFound, errorHandler
│     ├─ services/             # business rules (authService, itemService)
│     ├─ controllers/          # thin HTTP handlers
│     ├─ routes/               # authRoutes, itemRoutes
│     └─ utils/                # AppError, dates
├─ frontend/
│  └─ src/
│     ├─ api/axios.js          # axios instance + interceptors
│     ├─ context/AuthContext.jsx
│     ├─ components/           # Navbar, ProtectedRoute, ItemCard, ItemForm, ...
│     ├─ pages/                # Login, Register, Items, Dashboard, AddItem, EditItem, NotFound
│     ├─ utils/helpers.js      # date/price helpers
│     ├─ App.jsx               # routes
│     └─ main.jsx              # entry point
└─ README.md
```

## Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd SaveBite

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Create the environment files from the examples
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start MongoDB (or use an Atlas connection string in backend/.env)
sudo systemctl start mongod

# 5. Fill the database with demo data
cd backend && npm run seed
```

> After step 3, open `backend/.env` and set a real `JWT_SECRET` (a long random string).

## Configuration

### `backend/.env`

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Port the API listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/savebite` |
| `JWT_SECRET` | Secret used to sign/verify tokens (keep private!) | `change_me_to_a_long_random_string` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Allowed browser origin(s) for CORS (comma-separated) | `http://localhost:5173,http://127.0.0.1:5173` |

### `frontend/.env`

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the API | `http://localhost:5000/api` |

> Vite only exposes variables that start with `VITE_`, and `.env` is read **at startup** — restart `npm run dev` after changing it.

## Running the app

Open **two terminals**:

```bash
# Terminal 1 — backend
cd backend
npm run dev          # http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm run dev          # http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

- API base: `http://localhost:5000/api`
- Health check: `GET http://localhost:5000/api/health` → `{ "status": "ok", "database": "connected" }`

## Demo accounts

Created by `npm run seed`. Every account uses the password **`password123`**.

| Role | Email |
|---|---|
| Store | `freshmart@savebite.test` |
| Store | `bakery@savebite.test` |
| Consumer | `alice@savebite.test` |
| Consumer | `bob@savebite.test` |

The seed creates 8 items (1 already expired), so you can see the "active only" rule and the "Expired" badge.

## API

Base URL: `http://localhost:5000/api`. Errors use `{ "message": "..." }`, plus `"errors": [...]` for validation errors.

| Method | Endpoint | Access | Body | Success | Possible errors |
|---|---|---|---|---|---|
| GET | `/health` | public | – | 200 `{status, database}` | 500 |
| POST | `/auth/register` | public | `name, email, password, role` | 201 `{token, user}` | 400, 409 |
| POST | `/auth/login` | public | `email, password` | 200 `{token, user}` | 400, 401 |
| GET | `/items` | any logged-in user | – | 200 non-expired items of all stores | 401 |
| GET | `/items/mine` | store | – | 200 own items (expired included) | 401, 403 |
| GET | `/items/:id` | any logged-in user | – | 200 one item | 400, 401, 404 |
| POST | `/items` | store | `name, quantity, original_price, new_price, expiry_date` | 201 created item | 400, 401, 403 |
| PUT | `/items/:id` | store (owner only) | same as POST | 200 updated item | 400, 401, 403, 404 |
| DELETE | `/items/:id` | store (owner only) | – | 200 `{message}` | 400, 401, 403, 404 |

Send the JWT as `Authorization: Bearer <token>`. Business rules enforced by the server: only stores may create/update/delete; a store may only touch its own items; `new_price` must be lower than `original_price`; `expiry_date` must be a real date and not in the past; `store` is taken from the token, never from the body.

## Testing

Verification was done manually while building the project, in two layers:

- **API** — every endpoint was checked by hand (status codes, response bodies, validation, and the 401/403 rules) with a REST client against `http://localhost:5000/api`.
- **UI (end-to-end)** — the main flows were walked through in the browser: register as a store → add/edit/delete items, register as a consumer → see every store's deals, protected-route redirects, logout, wrong password, and a corrupt token.

## Known limitations

- No automated test suite yet (verification is manual, see the **Testing** section).
- No image uploads; items are text-only.
- Prices are plain numbers (no currency handling; a single `CURRENCY` constant in `frontend/src/utils/helpers.js` is currently empty).
- No refresh tokens or "remember me"; the JWT lives in `localStorage` and simply expires.
- No pagination or search on the items list.
- CORS allows any `localhost` / `127.0.0.1` origin, which is convenient for development but should be tightened for production.
