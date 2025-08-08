# CLAUDE.md

after every major change, run `bun check` and `bun typecheck` to ensure everything is working.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a T3 Stack project with Next.js App Router, TypeScript, tRPC, Prisma, and Tailwind CSS. The project uses Biome for linting and formatting, and PostgreSQL as the database.

## Development Commands

### Essential Scripts
- `bun dev` - Start development server with Turbo
- `bun build` - Build for production
- `bun preview` - Build and preview production build
- `bun typecheck` - Run TypeScript type checking
- `bun check` - Run Biome linting/formatting checks
- `bun check:write` - Auto-fix linting/formatting issues

### Database Management
- `bun db:push` - Push schema changes to database
- `bun db:generate` - Generate Prisma client after schema changes
- `bun db:migrate` - Apply database migrations
- `bun db:studio` - Open Prisma Studio for database inspection
- `./start-database.sh` - Start local PostgreSQL container

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, Tailwind CSS v4
- **API**: tRPC v11 for type-safe API layer
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod for runtime validation
- **Formatting**: Biome for linting and code formatting

### Project Structure
- `/src/app` - Next.js App Router pages and components
- `/src/server/api` - tRPC API routers and procedures
- `/src/server/db.ts` - Database client instance
- `/src/trpc` - tRPC client setup for React
- `/prisma` - Database schema and migrations
- `/src/env.js` - Environment variable validation with t3-env

### Key Patterns

#### tRPC Router Pattern
New API endpoints are added as routers in `/src/server/api/routers/` and registered in `/src/server/api/root.ts`. Each router uses procedures defined with `publicProcedure` from `trpc.ts`.

#### Environment Variables
All environment variables are validated through `/src/env.js` using Zod schemas. Server-side variables require `DATABASE_URL`, client-side variables must be prefixed with `NEXT_PUBLIC_`.

#### Database Access
Database operations use the Prisma client instance from `/src/server/db.ts`. The schema is defined in `/prisma/schema.prisma`.

#### Type Safety
The project leverages full-stack type safety through:
- tRPC for API type inference
- Prisma for database types
- TypeScript with strict mode enabled
- Path aliases using `@/` for `./src/`

## Development Workflow

1. **Database Setup**: Run `./start-database.sh` to start PostgreSQL container
2. **Schema Changes**: Edit `prisma/schema.prisma`, then run `bun db:push`
3. **API Development**: Add routers in `/src/server/api/routers/`, register in `root.ts`
4. **Frontend Development**: Use `api` hooks from `/src/trpc/react.tsx` for type-safe API calls
5. **Code Quality**: Run `bun check:write` before committing to fix formatting