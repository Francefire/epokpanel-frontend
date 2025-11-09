# Epok Panel - AI Coding Instructions

## Project Overview
A Next.js 15 management panel for Squarespace shop operations via API. Enables bulk product editing, template-based product creation (paintings/sculptures with auto-categorization), and streamlined shop management workflows.

## Architecture & Key Patterns

### Authentication Flow (Supabase Cookie-Based SSR)
- **Critical**: Never create Supabase clients as global variables (Fluid compute incompatibility)
- **Server Components**: Use `createClient()` from `@/lib/supabase/server.ts` (async cookies API)
- **Client Components**: Use `createClient()` from `@/lib/supabase/client.ts` (browser client)
- **Middleware**: Auth session refresh happens in `lib/supabase/middleware.ts` via `updateSession()`
  - Redirects unauthenticated users to `/auth/login` (except `/auth/*` routes)
  - Must call `supabase.auth.getClaims()` before any logic to prevent random logouts
  - Must return unmodified `supabaseResponse` to preserve cookie sync

### Route Protection
- Protected routes under `/app/protected/` require authentication
- Middleware matcher in `middleware.ts` excludes static files (`_next/static`, images, favicon)
- Auth routes (`/app/auth/*`): login, sign-up, forgot-password, update-password

### Client-Side Auth Pattern
Authentication forms (e.g., `components/login-form.tsx`) follow this pattern:
```tsx
"use client";
const supabase = createClient(); // Client-side Supabase
const { error } = await supabase.auth.signInWithPassword({ email, password });
router.push("/protected"); // Navigate after auth
```

## Component & Styling System

### shadcn/ui Configuration
- Style: `new-york` variant (see `components.json`)
- Path aliases: `@/components`, `@/lib`, `@/components/ui`
- Icon library: `lucide-react`
- Add new components: `npx shadcn@latest add <component-name>`

### Styling Conventions
- **Utility function**: Use `cn()` from `@/lib/utils` (combines `clsx` + `tailwind-merge`)
- **Theming**: HSL CSS variables in `app/globals.css` (light/dark modes)
- **Theme switching**: `next-themes` provider in `app/layout.tsx` (class-based, system default)
- **Button variants**: Use `buttonVariants` from `components/ui/button.tsx` with CVA (class-variance-authority)

Example component styling:
```tsx
import { cn } from "@/lib/utils";
<div className={cn("flex flex-col gap-6", className)} />
```

## Development Workflow

### Commands
- `pnpm dev` - Development server with Turbopack (fast refresh)
- `pnpm build` - Production build
- `pnpm lint` - ESLint check
- `pnpm start` - Start production server

### Environment Setup
Required in `.env.local` (copy from `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```
- Project shows `<EnvVarWarning />` if vars missing (check `lib/utils.ts` `hasEnvVars`)

### TypeScript Configuration
- Path alias: `@/*` maps to project root
- Strict mode enabled
- Module resolution: `bundler` (Next.js 15)

## Future Implementation Notes

### Squarespace API Integration (Planned)
When implementing Squarespace API features:
- Create API client in `lib/squarespace/` (follow Supabase client pattern)
- Product templates (paintings/sculptures) should auto-set:
  - Categories, tags, stock levels
  - Template-specific metadata
- Bulk operations should use optimistic UI updates (client components)

### Route Structure Expectations
- `/app/products/` - Product management interfaces
- `/app/bulk-edit/` - Bulk editing tools
- Protected routes should extend `/app/protected/layout.tsx`

## Critical Patterns to Preserve

1. **Never reuse Supabase client instances** across requests (server-side)
2. **Always await cookies()** before server client creation (Next.js 15)
3. **Preserve middleware cookie handling** - don't modify `supabaseResponse` cookies
4. **Use `"use client"` directive** for any component with hooks/event handlers
5. **Import paths**: Always use `@/` alias (configured in `tsconfig.json`)

## Common Tasks

### Adding a new protected page
1. Create route under `app/protected/`
2. Use server Supabase client if fetching user data
3. Layout in `app/protected/layout.tsx` provides nav/auth UI

### Adding shadcn component
```bash
npx shadcn@latest add <component-name>
```
Components auto-configure with project's theme variables.

### Creating authenticated API routes
```ts
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```
