<div align="center">

# cms_hardware

[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Fastify](https://img.shields.io/badge/Fastify-5-000000?style=flat&logo=fastify&logoColor=white)](https://fastify.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat&logo=prisma&logoColor=white)](https://prisma.io)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat&logo=openai&logoColor=white)](https://openai.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**Web-based hardware asset management system with server-side rendering, full CRUD across 14 entity types, and an AI assistant that converts natural language into safe SQL queries.**

</div>

---

## What is this?

An internal CMS for tracking organizational hardware assets — devices, SIM cards, locations, suppliers, stores, tariffs, and more. Built with Fastify + EJS for SSR, Prisma ORM for type-safe MySQL access, and a custom AI query layer (GPT-4o-mini) that lets users ask questions about the database in plain language.

The AI assistant converts natural-language questions into read-only SQL queries, validates them through a multi-layer safety pipeline, executes them via Prisma, and returns structured results — without exposing raw model internals or sensitive columns.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Server | Fastify 5 (ESM, async/await throughout) |
| Templating | EJS (server-side rendering) |
| ORM | Prisma 6 |
| Database | MySQL 8 |
| AI | OpenAI GPT-4o-mini |
| Logging | Pino + pino-pretty (dev) |
| Security | @fastify/helmet, @fastify/cors |
| Seed | @faker-js/faker |

## Architecture

```
cms_hardware/
└── backend/
    ├── src/
    │   ├── app.js                  # Fastify app, plugins, graceful shutdown
    │   ├── routes/
    │   │   ├── index.js            # Registers all 15 routers
    │   │   ├── hardware.route.js
    │   │   ├── sim.route.js
    │   │   ├── bot.route.js        # AI assistant endpoint
    │   │   └── ...                 # location, provider, tariff, store, supplier, ...
    │   ├── controllers/            # Request handling — thin layer, delegates to services
    │   ├── services/               # Business logic + Prisma queries
    │   │   ├── hardware.service.js # Filter, search, sort across 8 related tables
    │   │   ├── bot.service.js      # OpenAI → SQL → Prisma pipeline
    │   │   └── ...
    │   ├── views/                  # EJS templates
    │   │   ├── partials/           # Shared: head, modal, table, scripts
    │   │   ├── hardware.ejs
    │   │   ├── sim.ejs
    │   │   └── ...
    │   ├── configs/
    │   │   ├── prisma.js           # Prisma client singleton
    │   │   └── database.js         # Schema introspection for AI context
    │   └── utils/
    │       ├── sql.js              # AI query safety validators
    │       ├── date.js             # Date formatting/parsing helpers
    │       └── password.js         # bcrypt helpers
    ├── public/
    │   └── js/                     # Client-side table init, CRUD modals per entity
    ├── prisma/
    │   └── schema.prisma           # 12 models, all relations defined
    └── scripts/
        ├── seedHardware.js         # Faker-based hardware seed
        ├── seedSimCards.js
        └── seedUsers.js
```

### Data model

12 Prisma models with relational integrity:

```
tbl_hardware          — core asset record (22 fields)
  ├── tbl_hardware_types      → tbl_hardware_categories
  ├── tbl_locations
  ├── tbl_statuses
  ├── tbl_sim_cards           → tbl_providers → tbl_tariffs
  ├── tbl_stores
  ├── tbl_suppliers
  └── tbl_currencies

tbl_users             — UUID PK, role-based
  ├── tbl_roles
  └── tbl_user_companies      → tbl_companies  (many-to-many junction)
```

Soft deletes on `tbl_hardware`, `tbl_sim_cards`, and `tbl_users` via `*_DELETED_AT` timestamp columns.

### Hardware service — dynamic filtering and sorting

`hardwareService.getHardware()` builds a Prisma `where` clause dynamically from query parameters, supporting:

- **Full-text search** across 15 fields including related table columns (`HT_NAME`, `LOC_NAME`, `SIM_NUMBER`, etc.)
- **Per-column filtering** from arbitrary query params
- **Relational sorting** — `sort=HT_NAME` translates to `orderBy: { tbl_hardware_types: { HT_NAME: order } }` for each of the 6 relation-sorted columns
- **Pagination** via `offset` / `limit`

### AI assistant — natural language to SQL

`POST /bot/ask` accepts a plain-language question and runs it through a pipeline:

```
1. Fetch live database schema (table + column names)
2. Send schema + question to GPT-4o-mini with strict system prompt
   — only SELECT queries allowed
   — forbidden keywords: DELETE, UPDATE, INSERT, DROP, ALTER, TRUNCATE, ...
   — no sensitive columns: password, token, api_key, secret
3. Extract SQL from response with regex (isSafeSQL + extractValidSQL)
4. Secondary validation:
   — must match /^SELECT\b[\s\S]*?\bFROM\b/i
   — must not contain DML/DDL keywords
   — must not reference forbidden columns
   — length limit: 700 chars
5. Execute via prisma.$queryRawUnsafe()
6. Serialize bigint fields to string (MySQL bigint → JS BigInt edge case)
7. Return rows as JSON
```

If any validation step fails, the endpoint returns `null` — no error details exposed to the client.

### Fastify plugin stack

```javascript
fastifyHelmet     — security headers + CSP (allows cdn.jsdelivr.net for Bootstrap table)
fastifyCors       — restricted to CORS_ORIGIN from env
fastifyStatic     — serves /public/ (CSS, JS, images)
fastifyView       — EJS templating with root set to src/views/
```

Graceful shutdown handles both `SIGINT` (Ctrl+C) and `SIGTERM` (PM2, Docker, Kubernetes).

## Managed entities

| Entity | CRUD | Notes |
|--------|------|-------|
| Hardware | Full | 22 fields, soft delete, linked to all below |
| SIM Cards | Full | PIN/PUK stored, linked to provider + tariff |
| Locations | Full | Address, contact person, used by 5 entities |
| Providers | Full | Telecom providers, linked to location + status |
| Tariffs | Full | Price + currency, linked to provider |
| Stores | Full | Physical storage locations |
| Suppliers | Full | Hardware vendors |
| Types | Full | Hardware types → categories |
| Categories | Full | Hardware category groups |
| Statuses | Full | Shared across hardware, SIM, provider, store, supplier |
| Currencies | Full | Used by hardware cost and tariffs |
| Users | Full | UUID PK, role-based, soft delete |
| Roles | Full | Permission groups |
| Companies | Full | Multi-company support via junction table |

## Quick start

```bash
git clone https://github.com/bumbaRasch/cms_hardware
cd cms_hardware/backend

cp .env.example .env
# Set DATABASE_URL, OPENAI_API_KEY, SALT_ROUNDS

npx prisma db push        # create schema in MySQL
npx prisma generate       # generate Prisma client

# Optional: seed with faker data
node scripts/seedUsers.js
node scripts/seedHardware.js
node scripts/seedSimCards.js

npm run dev               # http://localhost:3000
```

## Environment

```bash
NODE_ENV=development
DATABASE_URL=mysql://user:password@localhost:3306/cms_hardware
OPENAI_API_KEY=sk-...
SALT_ROUNDS=10
PORT=3000
HOST=127.0.0.1
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

See `.env.example` for all variables.
