# 📮 Mailix UI (`Mailix-ui`)

> **Enterprise Workspace & Collaboration Platform Frontend**  
> Built with **Nuxt 3**, **Vue 3**, **Tailwind CSS**, and **Nuxt UI**.

---

## 📖 Overview

**Mailix UI (`Mailix-ui`)** is the client-facing application of the Mailix enterprise ecosystem. It provides an all-in-one unified workspace consolidating:
- **Human Resources (HRM)**: Employee master profiles, organizational charts, contracts, decisions, insurance, and attendance.
- **Customer Relationship Management (CRM)**: Customer & Contact directory, Kanban pipelines, excel bulk import/export, and permanent removal utilities.
- **Task & Project Management (Workspace)**: Task boards, sub-tasks, multi-role assignees, manager tracking, comments, and object-level visibility.
- **Enterprise Social Network**: Internal feeds, rich-text posts, multi-choice polls, emoji reactions, and department group collaboration.
- **Dynamic Theming & Localization**: Real-time tenant branding (favicons, logos, colors) and bilingual support (Vietnamese & English).

---

## 🏗 Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | [Nuxt 3](https://nuxt.com/) (`v3.15.4`) + [Vue 3](https://vuejs.org/) (`v3.x`) |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/) + [@nuxt/ui](https://ui.nuxt.com/) (Headless UI + Heroicons) |
| **State Management** | [Pinia](https://pinia.vuejs.org/) (`@pinia/nuxt`) + `@pinia-plugin-persistedstate` |
| **Authentication & Session** | [@sidebase/nuxt-auth](https://auth.sidebase.io/) (JWT local provider with auto-redirects) |
| **Real-Time Communication** | Native Browser WebSockets (connecting to Django Channels ASGI) |
| **Internationalization (i18n)** | `vue-i18n` (`v10`) with runtime locale syncing |
| **PWA & Offline** | [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/) (Service Worker + Manifest) |
| **Rich Text & Media** | [Tiptap Editor](https://tiptap.dev/) (`@tiptap/vue-3`), `@fullcalendar`, Chart.js, Highcharts |
| **Table & Data Grid** | `datatables.net-vue3` with FixedColumns & FixedHeader |
| **Package Manager** | `yarn` (`v1.22+`) |

---

## 📂 Project Directory Structure

```text
Mailix-ui/
├── app.vue                  # Root component (branding, favicon sync, locale sync, snackbar)
├── nuxt.config.ts           # Nuxt config (base URL: /hrm/, modules, PWA, auth endpoints)
├── tailwind.config.js       # Tailwind CSS theme tokens & custom color definitions
├── package.json             # Dependencies and build scripts
│
├── assets/                  # Static styles, custom CSS, animations, and typography
│   └── css/                 # style.css, fonts.css
│
├── components/              # Reusable Vue components (grouped by module)
│   ├── base/                # UI primitives (buttons, modals, inputs, badges)
│   ├── contact/             # Contact profile, forms, and cards
│   ├── customer/            # Customer detail tabs, Kanban boards
│   ├── department/          # Organizational hierarchy widgets
│   ├── group/               # Group listings and member management
│   ├── social/              # Feed post creators, reactions, polls, comment threads
│   ├── user/                # HR profiles, contract tabs, insurance widgets
│   ├── work/                # Task Kanban, priority selectors, sub-work checklists
│   ├── DropdownNotifications.vue # WebSocket real-time notification popover
│   ├── DropdownProfile.vue  # User avatar, quick settings, theme & language switch
│   ├── Header.vue           # Global navigation top bar
│   ├── NewSideBar.vue       # Main responsive sidebar navigation
│   └── NewSidebarLink.vue   # Role-based sidebar accordions & navigation links
│
├── composables/             # Shared Vue 3 composables
│   ├── useAPI.ts            # Centralized HTTP request client (GET, POST, PUT, PATCH, DELETE)
│   ├── useLazyAPI.ts        # Lazy data fetching utilities
│   └── useMySnackBar.ts     # Global toast notification wrapper
│
├── layouts/                 # Nuxt layout definitions
│   └── default.vue          # Main layout wrapping Sidebar, Header, and Content area
│
├── locales/                 # Translation JSON dictionaries
│   ├── en.json              # English translation catalog
│   └── vi.json              # Vietnamese translation catalog (default)
│
├── middleware/              # Nuxt route navigation guards
│   └── routeauth.global.ts  # Global route authentication & authorization guard
│
├── pages/                   # File-based routing (prefixed by app.baseURL: /hrm/)
│   ├── login/               # Authentication (Sign in, OTP verification, Password reset)
│   ├── hr/                  # Employee directory & profile management
│   ├── hr-contract/         # Labor contracts management
│   ├── hr-decision/         # Appointment / dismissal / salary decisions
│   ├── hr-insurance/        # Social insurance records
│   ├── timekeeping/         # Attendance tracking and check-in logs
│   ├── departments/         # Departments & business units
│   ├── titles/              # Job titles & position catalog
│   ├── customers/           # CRM Customers (table, kanban, bulk import/remove)
│   ├── contacts/            # CRM Contacts (table, kanban, bulk import/remove)
│   ├── works/               # Task management (Kanban, List, Task detail modal)
│   ├── schedules/           # Calendar & event scheduling (FullCalendar)
│   ├── social/              # Enterprise social wall, department feeds, polls
│   ├── groups/              # User role groups
│   ├── company/             # Company settings and theme customization
│   └── change-password.vue  # Forced first-time login password change
│
├── plugins/                 # Nuxt client plugins (DataTables, vue-plugins, numeral)
├── public/                  # Static assets served at root (icons, worker/sw.ts)
└── stores/                  # Pinia state management stores
    ├── app.ts               # System configuration & environment states
    ├── user.js              # Authenticated user, profile HR, and company branding state
    ├── modal.js             # Global modal dialog coordinator
    ├── filter.js            # Table query filter state
    └── column.js            # Custom column visibility preferences
```

---

## ⚡ Core Architectural Patterns

### 1. Unified HTTP Client (`useAPI`)
All network communication with the backend passes through `composables/useAPI.ts`:
- **Base URL**: Automatically bound to `NUXT_PUBLIC_API_BASE_URL` (`runtimeConfig.public.apiBaseUrl`).
- **Authorization**: Automatically extracts the JWT Bearer token from the `auth:token` cookie and injects `Authorization: Bearer <token>`.
- **Payload Normalization**: Automatically distinguishes between standard JSON objects and `FormData` (multipart file uploads), omitting `Content-Type` for uploads so the browser sets the correct boundary.

```typescript
const api = useAPI()

// Quick examples:
const { data, refresh } = await api.get('/core/works/')
const response = await api.$post('/core/works/', payload)
const updated = await api.patch(`/core/customers/${id}/`, formData)
```

---

### 2. Authentication & Session Flow (`@sidebase/nuxt-auth`)
- **Authentication Strategy**: Local JWT authentication configured in `nuxt.config.ts`.
- **Endpoints**:
  - `signIn`: `POST /api/v1/auth/login/`
  - `signOut`: `POST /api/v1/auth/logout/`
  - `signUp`: `POST /api/v1/auth/register/`
  - `getSession`: `GET /api/v1/core/users/me/`
- **Token Storage**: Saved in `auth:token` cookie with an expiration of 30 days.
- **First Login Enforce**: If `profile_hr.is_first_login === true`, the user is immediately redirected to `/change-password` and blocked from accessing any other route until password is updated.

---

### 3. Route Protection & Authorization Guards (`routeauth.global.ts`)
The application implements multi-tier route guarding inside `middleware/routeauth.global.ts`:
1. **Public Route Whitelist**: Unauthenticated users can only view `/login`, `/login/otp-verify`, and `/login/forgot-password`.
2. **Superuser Bypass**: `is_superuser === true` has access to all pages and is redirected from auth pages to `/social`.
3. **Module & Resource Authorization**:
   - Routes are mapped to functional modules:
     - `customer` → `/hr`, `/dashboard-hrm`
     - `crm` → `/contacts`, `/customers`
     - `workspace` → `/works`, `/schedules`, `/social`, `/dashboard-work`
     - `company` → `/groups`, `/departments`
   - Normal users are evaluated against their assigned module access. If a user attempts to access a module their account does not possess, they are redirected to their default allowed dashboard.

---

### 4. Real-Time WebSocket Notifications
Live alerts and background task notifications are handled in `DropdownNotifications.vue`:
- Connects to Django Channels ASGI at `ws://<backend>/ws/notifications/?token=<auth_token>`.
- **Reconnection Logic**: Automatic retry every 5 seconds on disconnect.
- **Tab De-duplication**: Uses `localStorage` timestamp locks to ensure toast popups fire only once across multiple open browser tabs.
- **Categorization**: Notifications are separated into **Work**, **Contact**, and **Customer** tabs with unread status indicators.

---

### 5. Multi-Tenant Dynamic Branding
In `app.vue`:
- Company data is fetched from `GET /system/company/`.
- The document title, logo, and favicon are updated dynamically at runtime.
- A cache-buster query string (`?v=<timestamp>`) is appended to favicons and logos to ensure instant updates upon tenant logo changes.

---

### 6. Internationalization (i18n)
- Configured using `vue-i18n` with support for:
  - 🇻🇳 Vietnamese (`vi`) — default
  - 🇬🇧 English (`en`)
- **Profile Synchronization**: When a user logs in, `app.vue` checks `profile_hr.locale` and syncs the app language automatically across sessions and devices.

---

## 💻 Environment Variables (`.env`)

Create a `.env` file in the `Mailix-ui` root directory:

```env
# URL of Django REST Backend API (including /api/v1 prefix)
NUXT_PUBLIC_API_BASE_URL='http://localhost:8000/api/v1'

# OpenStreetMap Nominatim for Address Lookup
NUXT_PUBLIC_LOCATION_URL='https://nominatim.openstreetmap.org'

# Rest Countries API for Nationality & Country Selectors
NUXT_PUBLIC_NATIONALITY_URL='https://restcountries.com/v3.1'

# Optional: Google OAuth Client ID (if social login enabled)
# NUXT_PUBLIC_GOOGLE_CLIENT_ID=''
# NUXT_PUBLIC_GOOGLE_REDIRECT_URI=''

# Optional: Google Tag Manager
# GTM_ENABLED=false
```

---

## 🚀 Installation & Running

### Prerequisites
- Node.js `18.x` or higher
- Yarn package manager (`npm install -g yarn`)

### 1. Install Dependencies
```bash
cd Mailix-ui
yarn install
```

### 2. Start Development Server
```bash
yarn dev
```
The application will start at: `http://localhost:3000/hrm/`  
*(Note: As defined in `nuxt.config.ts`, the app is served under the `/hrm/` base path).*

### 3. Production Build & Deployment

#### Build the Nitro output:
```bash
yarn build
```

#### Run the production server:
```bash
node .output/server/index.mjs
```

#### Run with Process Manager (PM2):
```bash
pm2 start .output/server/index.mjs --name "mailix-ui" -i max
pm2 save
```

---

## 🌐 Nginx Reverse Proxy Configuration Example

Because the Nuxt app uses `app.baseURL: '/hrm/'`, configure Nginx to route `/hrm/` and WebSockets properly:

```nginx
server {
    listen 80;
    server_name workspace.example.com;

    # Frontend Nuxt 3 App
    location /hrm/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket connection for notifications
    location /hrm/ws/ {
        proxy_pass http://127.0.0.1:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

---

## 🛠 Useful Development Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server with hot-module replacement |
| `yarn build` | Compile and bundle production application into `.output/` |
| `yarn preview` | Locally preview the compiled production build |
| `yarn postinstall` | Run `nuxt prepare` to regenerate TypeScript types and Nuxt definitions |

---

## 📌 Common Tips & Troubleshooting

1. **Why does navigation default to `/hrm/`?**  
   In `nuxt.config.ts`, `app.baseURL` is set to `'/hrm/'`. When accessing root `/`, `routeauth.global.ts` automatically catches the route and redirects to `/social` (under `/hrm/social`).
2. **Missing permissions or blank pages after login?**  
   Check the user's `profile_hr.department.resources` or group assignments. Users must belong to a Department with enabled resources (`workspace`, `customer`, `crm`, `company`) to access corresponding routes.
3. **Icons not displaying?**  
   The project uses `@nuxt/ui` and Iconify. Icon names follow format `heroicons:...`, `ix:...`, `mdi:...`. Ensure local endpoints or internet access to Iconify is reachable.
4. **Excel Import/Remove Error Translations**:  
   Error logs from import/remove tasks are structured as `{ "type": "not_found", "code": "..." }` and resolved via `$t('error.<type>')` inside `locales/vi.json` and `locales/en.json`.
