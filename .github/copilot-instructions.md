# Kadesh Platform - AI Coding Agent Instructions

## Project Overview
Kadesh is a **freelancer marketplace with reverse auction bidding**:
- **Frontend**: Vue 3 (Composition API) + Vite + Pinia + Tailwind CSS (port 3000)
- **Backend**: PHP 8.1+ with MySQL 8.0+ (runs on Apache/XAMPP)
- **Architecture**: SPA with JWT auth, reverse auction bidding, wallet system, admin panel
- **Deployment**: Frontend on Vercel, Backend can use PHP hosting (Hostinger) or separate Node.js backend on Render

**Core Business Model**: Clients post projects → Providers bid (lowest bid wins) → Automated auction closure → Contract + milestone-based payments

**IMPORTANT**: This repo contains a PHP backend in `/api` folder. Documentation references to a Node.js/PostgreSQL backend refer to a separate repository ([marcuslimadev/kadesh-backend](https://github.com/marcuslimadev/kadesh-backend)) which can be used as an alternative backend.

---

## Critical Development Workflows

### Local Environment Setup (Windows/PowerShell with XAMPP)
```powershell
# 1. XAMPP Setup
# - Start Apache (port 80) and MySQL (port 3306) from XAMPP Control Panel
# - Database setup: Use phpMyAdmin or MySQL CLI
# - Import schema: api/kadesh_mysql_schema.sql

# 2. Backend Configuration (PHP in /api folder)
# - Copy api/config/env.example.php to api/config/env.local.php
# - Configure DB credentials in env.local.php
# - Backend serves from: http://localhost/kadesh/api

# 3. Frontend (port 3000)
npm install
npm run dev
# Vite proxy forwards /api to http://localhost/kadesh
```

**Database Credentials** (local dev):
- DB: `kadesh` (or check `api/config/env.local.php`)
- MySQL user: typically `root` with blank password on XAMPP
- Admin: Check `CREDENCIAIS-ADMIN.md`
- Test users: See `USUARIOS-EXEMPLO.md` (all passwords: `kadesh2025`)

### Testing Strategy
```powershell
# E2E tests (Playwright)
npm test                    # Headless run
npm run test:headed         # Visual debugging
npm run test:ui             # Interactive UI mode

# Quick integration test
.\test-e2e-now.ps1         # PowerShell script for full flow validation
```

**Testing Patterns**:
- E2E tests in `tests/*.spec.js` cover auth, projects, bids, contracts, admin disputes
- Tests use timestamp-based unique users to avoid conflicts (`tests/unified-profile.spec.js`)
- Tests hit real backend - configure `VITE_API_URL` to point to test environment

---

## Architecture Deep Dive

### Backend Architecture (PHP)
- **Entry Point**: `api/index.php` - main router that dispatches to modular endpoints
- **Database**: MySQL via PDO (`api/config/database.php`)
- **API Structure**: RESTful endpoints in `api/api/` folders (auth, projects, bids, contracts, etc.)
- **Middleware**: JWT auth in `api/middleware/auth.php` using custom Helpers class
- **Environment**: Loads from `api/config/env.production.php` or `env.local.php` (fallback order)

**Key PHP Files**:
- `api/utils/helpers.php`: JWT generation/verification, password hashing, common utilities
- `api/config/database.php`: PDO MySQL connection with env vars
- `api/api/*/index.php`: Each module's endpoints (e.g., `api/api/auth/index.php`)

### Authentication & User Profiles
- **User Types**: `client`, `provider`, `admin` (stored in MySQL `users` table)
- **JWT Flow**: Login → `api/api/auth/index.php` issues token → Frontend stores in `localStorage` (`kadesh_token`)
- **Unified Profile System**: Users can switch view mode (client ↔ provider) via `ViewModeSwitch.vue` but backend `users.type` determines actual permissions
  - `src/stores/viewModeStore.js` manages UI toggle (stored in localStorage as `kadesh_view_mode`)
  - Providers MUST have `type = 'provider'` in DB to submit bids

**IMPORTANT**: The router guard (`src/router/index.js`) only checks token existence, NOT backend validity. Always validate tokens server-side with `AuthMiddleware` in PHP.

### Reverse Auction System
**Key Components**:
1. **Project Creation** (`src/views/projects/CreateProject.vue`):
   - Deadline stored in `projects` table (check schema for data type)
   - Budget, category, description, attachments (images/PDF only, 5MB limit)

2. **Automated Closure**: 
   - PHP backend can use cron job or scheduled task to close expired auctions
   - Queries `projects WHERE deadline < NOW()` → selects lowest bid → creates contract
   - Real-time updates via polling or WebSocket implementation

3. **Auction Lobby** (`src/views/projects/AuctionLobby.vue`):
   - Real-time countdown timers using `date-fns`
   - Displays active auctions with bid counts
   - Polls backend for updates (check implementation for Socket.io or polling)

### Wallet & Payment Flow
- **Implementation**: Check `api/api/wallet/` for PHP wallet service
- **Transactions**: Stored in MySQL with transaction types (deposit, escrow_hold, escrow_release, payment, refund)
- **Payment Integration**: Mercado Pago webhooks (check `api/api/payments/` for implementation)

### Frontend Data Fetching Pattern
**API Service** (`src/services/api.js`):
- Axios instance with base URL from env vars
- Reads `VITE_API_URL` (or `VITE_BACKEND_URL`) from environment
- Falls back to empty string (uses proxy in dev, relative path in production)
- Request interceptor adds JWT from localStorage
- Response interceptor handles 401s with console warning only

**CRITICAL**: Default `VITE_API_URL` is empty string which works via Vite proxy in dev. For production, MUST set in `.env` or Vercel settings.

---

## Code Conventions & Patterns

### Vue 3 Composition API
- **Script Setup**: All components use `<script setup>` syntax
- **Props/Emits**: Always use `defineProps()` / `defineEmits()` (no runtime validation in production)
- **State Management**: Pinia stores in `src/stores/` (e.g., `auth.js`, `projects.js`)
- **API Calls**: Use `src/services/api.js` (Axios instance with interceptors)

**Example Pattern** (from `src/components/project/ProjectCard.vue`):
```vue
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  project: { type: Object, required: true }
})
// No emit example needed - see BidCard.vue for defineEmits()
</script>
```

### Backend PHP Structure
All API endpoints follow this pattern:
1. Entry through `api/index.php` which routes to module endpoints
2. Auth middleware: `api/middleware/auth.php` validates JWT
3. Each module in `api/api/*/index.php` handles its routes (e.g., `api/api/auth/index.php`)
4. Database access via PDO from `api/config/database.php`

**Example** (typical pattern in `api/api/*/index.php`):
```php
// GET request handling
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/../../middleware/auth.php';
    $auth = new AuthMiddleware();
    $user = $auth->authenticate();
    
    // Database query with PDO prepared statements
    $db = new Database();
    $stmt = $db->query("SELECT * FROM table WHERE user_id = ?", [$user['id']]);
    // Return JSON
    echo json_encode(['data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}
```

### Database Interactions (PHP/MySQL)
- **Connection**: PDO via `api/config/database.php` class
- **Environment**: Reads `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` from env
- **Queries**: Always use prepared statements with parameter binding
- **Schema**: Check `api/kadesh_mysql_schema.sql` for table structure
- **Transactions**: Use PDO `beginTransaction()`, `commit()`, `rollback()`

---

## Common Gotchas & Solutions

1. **CORS Issues**: Configure `FRONTEND_URL` in `api/config/env.production.php` or `env.local.php`
   - Default fallback in `api/index.php` allows `localhost:3000` and `localhost:5173` for dev
   - Production needs explicit origin whitelist (comma-separated)

2. **Vite Proxy in Development**:
   - `vite.config.js` proxies `/api` to `http://localhost/kadesh`
   - Assumes XAMPP serves from `http://localhost/kadesh/api`
   - If your XAMPP setup differs, adjust proxy target in vite.config.js

3. **Bid Submission Fails**:
   - User must have `type = 'provider'` in MySQL `users` table (not just view mode toggle)
   - Check `api/api/bids/index.php` for validation logic

4. **Auction Not Closing**:
   - PHP backend doesn't include scheduler by default - needs cron job implementation
   - Check `PLANO-CENTRAL.md` for auction closure workflow requirements
   - Projects should have `deadline < NOW()` and `status = 'open'`

5. **Default API URL Issue**:
   - `src/services/api.js` defaults to empty string for dev (uses Vite proxy)
   - Production MUST set `VITE_API_URL` env var or API calls will fail
   - Common mistake: forgetting to set env var in Vercel deployment settings

6. **JWT Token Validation**:
   - Frontend router only checks token existence in localStorage
   - Backend `AuthMiddleware` validates token signature and expiration
   - Token mismatch causes 401 errors - check `api/utils/helpers.php` for JWT implementation

---

## Deployment

**Production Stack**:
- Frontend: Vercel (`https://kadesh-two.vercel.app`)
- Backend: PHP hosting (Hostinger) OR separate Node.js backend on Render (`https://kadesh-2.onrender.com`)
- Database: MySQL (for PHP backend) OR PostgreSQL (for Node.js alternative)

**Key Files**:
- `vercel.json`: SPA routing config for frontend
- `GUIA-DEPLOY-PRODUCAO.md`: Full deployment checklist
- `api/README.md`: PHP backend setup instructions

**Environment Variables** (PHP backend - `api/config/env.production.php`):
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: MySQL credentials
- `JWT_SECRET` (min 32 chars): Generate with `openssl rand -base64 32`
- `FRONTEND_URL`: CORS whitelist (comma-separated for multiple origins)

**Environment Variables** (Node.js backend - if using alternative from separate repo):
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`, `FRONTEND_URL`/`FRONTEND_URLS`
- `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`: Mercado Pago credentials

---

## Key Documentation Files
- `PLANO-CENTRAL.md`: Current backlog and architectural decisions
- `SESSAO-SETUP-LOCAL.md`: Troubleshooting local setup issues (PostgreSQL-focused)
- `docs/SISTEMA-ANUNCIOS.md`: Advertisement system (left/right rails)
- `docs/ADMIN-DESIGN-SYSTEM.md`: Admin panel component library
- `USUARIOS-EXEMPLO.md`: Test accounts for all user types
- `api/README.md`: PHP backend architecture and setup

---

## Quick Reference Commands

```powershell
# MySQL Database (XAMPP)
# Use phpMyAdmin or MySQL CLI:
mysql -u root -p kadesh < api/kadesh_mysql_schema.sql

# Development
npm run dev                                # Frontend (port 3000)
# Backend runs automatically via XAMPP Apache

# Testing
npm test                                   # E2E suite
.\test-e2e-now.ps1                        # Quick integration test
npm run test:debug                         # Step-through debugging

# Build
npm run build                              # Frontend production build
npm run preview                            # Preview production build
```

When making changes, always check:
1. Does this affect the auction scheduler? Consider cron job implementation.
2. Will this change wallet balances? Verify transaction logging in MySQL.
3. Does the PHP API need new endpoints? Follow pattern in `api/api/*/index.php`.
4. Does this require a DB migration? Update `api/kadesh_mysql_schema.sql` and document changes.
