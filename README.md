# Quest App Skeleton

A starter skeleton for a small 2-user web app:
- **admin**: creates quests, manages shop items
- **player**: completes quests, earns currency, buys items

## Stack
- Node.js + Express
- EJS templates
- SQLite via `better-sqlite3`
- Session-based auth

## Features in this skeleton
- login/logout flow
- role-aware route protection
- SQLite schema + seed admin/player users
- quest list page
- admin dashboard placeholder
- player dashboard placeholder
- shop page placeholder
- services layer for future logic

## Quick start

```bash
npm install
cp .env.example .env
npm run db:init
npm run dev
```

Default seeded users:
- admin / admin123
- player / player123

## Suggested next steps
1. Finish admin CRUD for quests and shop items
2. Add quest completion / approval flow
3. Add purchase flow with currency deduction
4. Add validation and flash messages
5. Hash passwords in a proper admin UI instead of seed-only setup
