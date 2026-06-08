# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run all commands from this directory (the repo root is the nested `Media-invoices-main/` folder containing `package.json`).

- `npm start` / `ng serve` — dev server at `http://localhost:4200/` (hot reload)
- `npm run build` / `ng build` — production build to `dist/` (default config is `production`)
- `npm run watch` — incremental development build
- `npm test` / `ng test` — run unit tests with **Vitest** (via `@angular/build:unit-test`)
- Run a single spec: `ng test --include src/app/pages/login/login.spec.ts`
- Scaffold code: `ng generate component pages/<name>` (note `prefix: app`, so selectors are `app-*`)

There is no configured linter; formatting is via Prettier (config lives in `package.json`: `printWidth: 100`, `singleQuote: true`, Angular HTML parser).

## Architecture

Angular **21** single-page app for managing supplier invoices ("factures"). The domain/UI language is **French** — keep new identifiers, comments, and strings consistent with that (e.g. `facture`, `fournisseur`, statuses `'Validée' | 'En attente' | 'Rejetée'`).

**Standalone, no NgModules.** Bootstrapping is `bootstrapApplication(App, appConfig)` in `src/main.ts`. Every page is a `standalone: true` component that imports its own dependencies (`CommonModule`, `FormsModule`/`ReactiveFormsModule`, `RouterModule`). `src/app/app.config.ts` wires global providers (`provideRouter` with scroll restoration, error listeners). The lone `src/app/shared/charts/charts.module.ts` NgModule is unused legacy; the reporting page imports `NgChartsModule` from `ng2-charts` directly (it auto-registers Chart.js).

**Design system & shared layout.** Global tokens, base element styles, and reusable classes (`.dashboard`, `.content`, `.card`, `.status` pills, tables, buttons, `.modal`) live in `src/styles.css` — restyle there to affect every screen at once. Fonts (Bricolage Grotesque / Sora / Manrope) load via `<link>` in `src/index.html`. Navigation is a single shared component, `src/app/shared/sidebar/sidebar.ts` (`<app-sidebar [role]="'admin' | 'user'">`), used by all authenticated pages — it owns the nav links, `routerLinkActive` highlight, collapse toggle, and logout (`router.navigate(['/login'])`). Do NOT re-add per-page sidebar markup; edit the shared component.

**File-naming follows Angular 21 conventions** — components have no `.component` suffix. A page lives in `src/app/pages/<name>/` as `<name>.ts` / `.html` / `.css` / `.spec.ts`, and the class is e.g. `LoginComponent` exported from `login.ts`. Match this when generating new pages.

**Routing** (`src/app/app.routes.ts`) is flat with eager (non-lazy) component imports; `''` redirects to `login`. Routes map 1:1 to the folders under `pages/` (`dashboard-admin`, `dashboard-user`, `import-factures`, `liste-factures`, `facture-details/:id`, `validation`, `synchronisation`, `gestion-utilisateurs`, `reporting`).

**State / data layer.** There is **no backend**. `src/app/services/facture.service.ts` (`providedIn: 'root'`) is the single source of truth: it holds an in-memory `invoices` array (seeded with mock data) plus a `history` log, and exposes get/add/validate/reject/download operations. Mutations are direct array edits — components read and write through this service, so new invoice features belong here. Invoice objects are untyped (`any`); there is no shared model/interface.

**Auth is mocked and unguarded.** `login.ts` hard-codes two credential pairs (`admin@mediasoft.fr`/`admin123`, `user@mediasoft.fr`/`user123`) and routes to the admin vs. user dashboard accordingly. There are no route guards, tokens, or persisted session — any route is directly reachable by URL. Logout is purely a client-side redirect to `/login`.

**Charts.** Reporting uses `ng2-charts` v5 (`NgChartsModule` + the `baseChart` directive on `<canvas>`); the installed version has no `provideCharts`/`withDefaultRegisterables` and `BaseChartDirective` is **not** standalone, so import the module. `echarts`/`ngx-echarts` are in `package.json` but currently unused. These libraries push the production bundle past the 500 kB budget *warning* (not an error).

## TypeScript

`strict` mode is on with extra strictness (`noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `strictTemplates`, `strictInjectionParameters`). Existing components frequently use `any`; prefer concrete types in new code but be aware the strict template checker will flag template-binding mismatches.
