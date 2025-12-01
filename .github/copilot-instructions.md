# Kadesh Platform - AI Coding Agent Instructions

## Project Overview
Kadesh is a **freelancer marketplace with reverse auction bidding** built as a monorepo:
- **Frontend**: Vue 3 (Composition API) + Vite + Pinia + Tailwind CSS (port 3000)
- **Backend**: Node.js/Express + PostgreSQL + Socket.io (port 3001)
- **Architecture**: SPA with JWT auth, real-time bidding, wallet system, admin panel

**Core Business Model**: Clients post projects → Providers bid (lowest bid wins) → Automated auction closure → Contract + milestone-based payments

---

## Critical Development Workflows

### Local Environment Setup (Windows/PowerShell)
```powershell
# 1. Database setup (PostgreSQL 14+)
cd backend/scripts
.\setup-local-db.ps1  # Creates DB, loads schema, creates admin user

# 2. Backend (port 3001)
cd backend
cp .env.example .env  # Configure DATABASE_URL, JWT_SECRET
npm install
npm run dev

# 3. Frontend (port 3000)
npm install
npm run dev  # Vite proxy forwards /api to localhost:3001
```

**Database Credentials** (local dev):
- DB: `kadesh`, User: `kadesh`, Pass: `kadesh`
- Admin: `admin@kadesh.local` / `admin123`
- Test users: See `USUARIOS-EXEMPLO.md` (all passwords: `kadesh2025`)

### Testing Strategy
```powershell
# E2E tests (Playwright)
npm test                    # Headless run
npm run test:headed         # Visual debugging
npm run test:ui             # Interactive UI mode

# Quick integration test (hits real backend)
.\test-e2e-now.ps1         # PowerShell script for full flow validation
```

**Testing Patterns**:
- E2E tests use real DB (`tests/unified-profile.spec.js` demonstrates timestamp-based unique users)
- No mocking - tests validate full stack including Socket.io events
- Tests in `tests/*.spec.js` cover auth, projects, bids, contracts, admin disputes

---

## Architecture Deep Dive

### Authentication & User Profiles
- **User Types**: `client`, `provider`, `admin` (enum in `schema.sql`)
- **JWT Flow**: Login → `backend/routes/auth.js` issues token → Frontend stores in `localStorage` (`kadesh_token`)
- **Unified Profile System**: Users can switch view mode (client ↔ provider) via `ViewModeSwitch.vue` but backend `users.type` determines actual permissions
  - `src/stores/viewModeStore.js` manages UI toggle (stored in localStorage as `kadesh_view_mode`)
  - Providers MUST have `type = 'provider'` in DB to submit bids (see `backend/routes/bids.js`)

**IMPORTANT**: The router guard (`src/router/index.js`) only checks token existence, NOT backend validity. Always validate tokens on backend routes with `middleware/auth.js`.

### Reverse Auction System
**Key Components**:
1. **Project Creation** (`CreateProject.vue`):
   - Deadline stored as `DATE` (migration pending to `TIMESTAMPTZ` per `PLANO-CENTRAL.md`)
   - Budget, category, description, attachments (images/PDF only, 5MB limit)

2. **Automated Closure** (`backend/services/auctionScheduler.js`):
   - Runs every 60s (configurable via `AUCTION_CHECK_INTERVAL`)
   - Queries `projects.deadline < NOW()` → selects lowest bid → creates contract
   - Emits Socket.io events to notify participants

3. **Auction Lobby** (`AuctionLobby.vue`):
   - Real-time countdown timers using `date-fns`
   - Displays active auctions with bid counts
   - Socket.io listener for live updates (`io.on('bid:created')`)

### Wallet & Payment Flow
**Service**: `backend/services/walletService.js`
- **Double-entry ledger**: Every transaction records `balance_after` (calculated from previous balance)
- **Transaction Types**: `deposit`, `escrow_hold`, `escrow_release`, `payment`, `refund`
- **Locking**: Uses `FOR UPDATE` on previous balance to prevent race conditions

**Mercado Pago Integration**:
- Webhooks: `backend/routes/payments.js` → `/api/payments/mercadopago/webhook`
- Deposits create `payment_intents` table entries → webhook updates wallet on success
- **Security**: Webhook validates signature via `req.rawBody` (configured in `server.js`)

### Data Pagination Pattern
**Current State** (needs standardization per `PLANO-CENTRAL.md`):
- Frontend sends: `page`, `per_page`
- Backend expects: `limit`, `offset`
- **Missing**: Total count (`COUNT(*) OVER()`) for proper pagination UI

**Workaround**: Check `backend/routes/projects.js` lines 50-100 for manual offset conversion

---

## Code Conventions & Patterns

### Vue 3 Composition API
- **Script Setup**: All components use `<script setup>` syntax
- **Props/Emits**: Always use `defineProps()` / `defineEmits()` (no runtime validation in production)
- **State Management**: Pinia stores in `src/stores/` (e.g., `auth.js`, `projects.js`)
- **API Calls**: Use `src/services/api.js` (Axios instance with interceptors)

**Example Pattern** (from `ProjectCard.vue`):
```vue
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  project: { type: Object, required: true }
})
// No emit example needed - see BidCard.vue for defineEmits()
</script>
```

### Backend Route Structure
All routes follow this pattern:
1. Auth middleware: `const auth = require('../middleware/auth')`
2. Admin routes use: `require('../middleware/adminAuth')` (checks `users.is_admin = true`)
3. Validation: Manual checks (no Joi/Yup on backend - validation in frontend via `vee-validate`)

**Example** (`backend/routes/bids.js`):
```javascript
router.post('/', auth, async (req, res) => {
  // 1. Extract user from JWT (req.user set by middleware)
  // 2. Validate inputs manually
  // 3. DB query with parameterized queries ($1, $2...)
  // 4. Return JSON
})
```

### Database Interactions
- **Client**: `pg` module via `backend/config/database.js`
- **Transactions**: Use `db.query('BEGIN')` → operations → `COMMIT`/`ROLLBACK`
- **Migrations**: SQL files in `backend/database/migrations/` (manually applied)
- **Seeds**: Run via `npm run db:seed` (see `backend/database/seeds/`)

---

## Common Gotchas & Solutions

1. **CORS Issues**: Add origins to `FRONTEND_URLS` env var in `backend/.env` (comma-separated)
   - Default includes `localhost:3000`, `localhost:5173`, production URLs
   - See `server.js` lines 40-60 for logic

2. **Socket.io Not Connecting**:
   - Ensure backend Socket.io instance initialized BEFORE routes (`server.js` line 30)
   - Frontend connects via `src/utils/socket.js` (reads `VITE_API_URL`)

3. **Bid Submission Fails**:
   - User must have `type = 'provider'` in DB (not just view mode toggle)
   - Check `backend/routes/bids.js` line 20 for validation

4. **Auction Not Closing**:
   - Verify scheduler is running: Look for "🔄 Found X expired auction(s)" in backend logs
   - Check `projects.deadline` is in past and status is `open`

5. **Production API Called in Dev**:
   - Default `VITE_API_URL` points to `https://kadesh-2.onrender.com`
   - Override in `.env.local`: `VITE_API_URL=http://localhost:3001`

---

## Deployment

**Production Stack**:
- Frontend: Vercel (`https://kadesh-two.vercel.app`)
- Backend: Render (`https://kadesh-2.onrender.com`)
- Database: Render PostgreSQL

**Key Files**:
- `vercel.json`: SPA routing config
- `render.yaml`: Backend service + cron job for auction scheduler
- `GUIA-DEPLOY-PRODUCAO.md`: Full deployment checklist

**Environment Variables** (must set):
- `JWT_SECRET` (min 32 chars): `openssl rand -base64 32`
- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_URL` / `FRONTEND_URLS`: CORS whitelist
- `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`: Mercado Pago credentials

---

## Key Documentation Files
- `PLANO-CENTRAL.md`: Current backlog and architectural decisions
- `SESSAO-SETUP-LOCAL.md`: Troubleshooting local setup issues
- `docs/SISTEMA-ANUNCIOS.md`: Advertisement system (left/right rails)
- `docs/ADMIN-DESIGN-SYSTEM.md`: Admin panel component library
- `USUARIOS-EXEMPLO.md`: Test accounts for all user types

---

## Quick Reference Commands

```powershell
# Database
.\backend\scripts\setup-local-db.ps1       # Full DB reset + seed
npm run db:load-schema                     # Schema only
npm run db:seed                            # Sample data only

# Development
npm run dev                                # Frontend (port 3000)
cd backend && npm run dev                  # Backend (port 3001)

# Testing
npm test                                   # E2E suite
.\test-e2e-now.ps1                        # Quick integration test
npm run test:debug                         # Step-through debugging

# Build
npm run build                              # Frontend production build
npm run preview                            # Preview production build
```

When making changes, always check:
1. Does this affect the auction scheduler? Test deadline expiry.
2. Will this change wallet balances? Verify transaction logging.
3. Are there Socket.io events to emit? Update both backend and frontend listeners.
4. Does this require a DB migration? Document in `backend/database/migrations/`.
