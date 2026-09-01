# Bobal Stav

Двомовний сайт будівельної компанії Bobal Stav s.r.o. з галереєю проєктів і адмін-панеллю для керування контентом.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bobal-stav` — React/Vite сайт і адмін-панель
- `artifacts/api-server/src/routes` — API для контенту, галереї та статистики
- `lib/api-spec/openapi.yaml` — API-контракт
- `lib/db/src/schema` — таблиці контенту й галереї

## Architecture decisions

- Публічні сторінки та адмін-панель використовують один API й одну базу даних.
- Галерея зберігає URL фотографій, щоб контент можна було редагувати без окремого файлового сховища.

## Product

- Чеська та українська мови
- Сторінки: головна, послуги, проєкти, про компанію, контакти
- Галерея з категоріями
- Адмін-панель для редагування інформації та CRUD-операцій із проєктами

## User preferences

- Візуальний орієнтир: planer-vm.cz, але без копіювання бренду чи матеріалів.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
