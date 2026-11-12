# MediBook – Web (Angular 18)

![CI](https://github.com/yosseer12/medi-book/actions/workflows/ci.yml/badge.svg)

Front end of **MediBook**, a clinic appointment management platform. Patients find a doctor, choose a free time slot and manage their visits. Doctors follow their agenda and update appointment statuses.

> The ASP.NET Core API lives in [medibook-api](https://github.com/yosseer12/medibook-api) and is **not connected yet**. This front end runs on an in-memory data layer so it works on its own.

## Demo

![Demo](docs/demo.gif)

## Screenshots

| Login | Find a doctor | Booking |
|-------|---------------|---------|
| <img src="docs/login.png" width="300" alt="Login page"> | <img src="docs/doctors.png" width="300" alt="Doctors list"> | <img src="docs/booking.png" width="300" alt="Booking page"> |

## How it works

**Patient**
1. Sign in with a patient account and land on a dashboard (upcoming, completed and cancelled visits).
2. Search doctors by name, city or specialty.
3. Open a doctor, pick a date and an available time slot (taken or past slots are disabled), add a reason and confirm.
4. Manage visits in *My appointments* (upcoming, past, cancelled) and cancel an upcoming one.

**Doctor**
1. Sign in with a doctor account and land on the agenda, with today's count, upcoming and completed visits.
2. Mark a scheduled appointment as completed or cancel it.

A patient cannot open doctor pages and a doctor cannot open patient pages: the route guards redirect them to their own home.

## Technical highlights

| Topic | What it does |
|-------|--------------|
| **Standalone components** | No NgModules: each page declares its own imports. |
| **Signals** | Local state (filters, selected slot, loading) uses signals and `computed()`. |
| **Control flow** | Templates use `@if` / `@for` instead of structural directives. |
| **Lazy loading** | Every page is loaded on demand with `loadComponent`. |
| **Guards** | `authGuard` protects the app, `roleGuard` limits patient and doctor areas. |
| **HTTP interceptor** | Adds the JWT to outgoing requests. |
| **Reactive forms** | Login form with validation messages. |
| **UX details** | Loading skeletons, toast notifications, responsive layout, visible focus states. |

## Demo accounts

| Role    | Email                | Password    |
|---------|----------------------|-------------|
| Patient | patient@medibook.tn  | Patient123! |
| Doctor  | doctor@medibook.tn   | Doctor123!  |

## Getting started

```bash
npm install
npm start          # http://localhost:4200
```

### With Docker
```bash
docker build -t medibook-web .
docker run -p 8080:80 medibook-web   # http://localhost:8080
```

## Architecture

```
src/app
├── core      models, auth (signals + localStorage), guards, interceptor, API service, toasts
├── layout    app shell (sidebar, role-based navigation)
└── pages     login, patient dashboard, doctors, doctor detail + booking, my appointments, doctor agenda
```

**Design decision:** `ApiService` returns `Observable`s, exactly like an `HttpClient`-based service. Connecting the real API means replacing the method bodies with HTTP calls. The components do not change.

## Limitations
- Data is simulated and resets on page refresh.
- Authentication is a demo (a mock token, no real backend).
- No automated tests yet.

## Roadmap
- [ ] Connect the ASP.NET Core API (EF Core, PostgreSQL, JWT)
- [ ] Unit tests for services and components
- [ ] React version of the front end
- [ ] Live demo deployment

## Author
**Yousser Bouguerra**: Full-Stack Developer (.NET, Angular, React, Node.js)

-
