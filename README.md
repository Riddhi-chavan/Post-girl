# Post-girl — Postman-Inspired API Testing & Collaboration Platform

A full-stack, browser-based API testing platform inspired by Postman, built from scratch to demonstrate real-world web development skills. **Post-girl** replicates the core Postman experience — REST request building, collections, team workspaces, and run history — and goes further with a dedicated **WebSocket testing client**, AI-powered payload generation, public snapshot sharing, and granular team access controls.

## Table of Contents
- [About the Project](#about-the-project)
  - [Features](#features)
  - [Screenshots](#screenshots)
  - [Demo](#demo)
  - [Live Demo](#live-demo)
  - [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Features in Detail](#features-in-detail)
- [Project Architecture](#project-architecture)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [Contact](#contact)

---

## About the Project

### Features

* **Full REST API Client**: Build and execute HTTP requests (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with dynamic query parameters, custom headers, and a Monaco-powered JSON body editor.
* **WebSocket Testing Client**: Connect to any WebSocket server via `ws://` or `wss://` URLs. Send messages from a Monaco Editor, view real-time bidirectional message logs with timestamps, and benefit from automatic exponential-backoff reconnection.
* **Postman v2.1 Import**: Upload a Postman Collection JSON file to instantly create a fully populated Collection with all requests, headers, query params, and bodies — parsed in a single atomic Prisma transaction.
* **Workspace & Team Collaboration**: Create multiple workspaces, invite teammates via secure token-based invite links (7-day expiry), and manage access with a three-tier role system (`ADMIN`, `EDITOR`, `VIEWER`).
* **AI-Powered Assistance**: Powered by the Vercel AI SDK (Google Generative AI & Anthropic Claude). Generate realistic mock JSON request bodies from a natural-language prompt, and get smart endpoint name suggestions with confidence scores.
* **Public Snapshot Sharing**: Capture any request as a shareable public URL (`/share/[token]`). Recipients can view the request or save it directly into their own Post-girl account — no login required to view.
* **Execution History Logging**: Every request run is automatically saved to the database with the HTTP status code, response body, headers, and precise duration in milliseconds.
* **Monaco Editor Throughout**: The same desktop-grade code editor used in VS Code powers both the REST body editor and the WebSocket message composer — with JSON syntax highlighting, auto-format, and `Ctrl+Enter` send shortcut.
* **OAuth Authentication**: Sign in with GitHub or Google via Better Auth's OAuth 2.0 integration. Sessions are stored in HTTP-only cookies.

---

### Screenshots

## User Interface

![sign in](https://github.com/user-attachments/assets/2faf73e8-d13a-4d44-98e1-ad67b91baec3)
![home page](https://github.com/user-attachments/assets/5d23cd6f-2add-44ed-9459-73bcd79cbe53)
![log out](https://github.com/user-attachments/assets/eb71010e-f022-46a2-855f-7846432db3ad)

### Workspace
![create workspace](https://github.com/user-attachments/assets/57c3f551-7806-471f-a6f2-e9918e485216)
![select workspace](https://github.com/user-attachments/assets/333c7bf9-83fb-495a-8ae0-92568cfb6986)

### Invite member
![invite](https://github.com/user-attachments/assets/a5af7e9a-14ee-4fb6-a36c-a5bf06d7673a)
![role based invite](https://github.com/user-attachments/assets/ea05b992-0a6a-44a7-90b5-ed7dd4f5500c)

### Collections
![Create collection](https://github.com/user-attachments/assets/c9e8cfd2-7b4a-4441-8085-3a1999c060dd)
![Select Collection](https://github.com/user-attachments/assets/1f2dbd6b-ad3f-41c5-bb4c-ef30ee989c24)

### Import Collections
![Import collection](https://github.com/user-attachments/assets/cc1071c4-678f-4ca3-b3f2-346fe387681a)

### Request
![Get](https://github.com/user-attachments/assets/3865881a-515b-4660-9a20-bb2409b6a70a)
![Post](https://github.com/user-attachments/assets/c9189234-da31-42a7-9217-3d1e2468629e)
![Put](https://github.com/user-attachments/assets/87ab9468-b9bd-4ec2-88a3-45b3842df4b5)
![Delete](https://github.com/user-attachments/assets/ff496589-9c7f-4d92-9953-a5c869d9f0f6)


### History
![history](https://github.com/user-attachments/assets/d2ec474d-838b-4923-8792-351a690d8897)
### Code View

![code view](https://github.com/user-attachments/assets/41f48b2b-82d7-4884-9412-bcc603f5a042)

### Share Request

![share option](https://github.com/user-attachments/assets/95d25420-2fe9-4f42-9ae8-f547866ef2c5)
![share dilog](https://github.com/user-attachments/assets/082bdce9-f462-41fb-9bb9-b890d83d15d3)
![shared request](https://github.com/user-attachments/assets/e29a68f0-e2f0-4c7a-9c1f-881a5a20ddf5)


## Web Socket 

![web socket](https://github.com/user-attachments/assets/56f80794-fddd-46cb-87c4-4f9221271f58)






---

### Demo
https://github.com/user-attachments/assets/a47b464b-ed48-4eca-8a6f-7b5811dfdc59
---

### Live Demo

**[Click here for live demo](https://post-girl.onrender.com/)**

---

### Tech Stack

**Frontend**
* **Next.js 16.2 (App Router)**: React framework with Server Actions, SSR, and optimized routing.
* **React 19**: Latest component model with concurrent features.
* **Zustand**: Lightweight global state management powering both the REST request store and the WebSocket connection store.
* **TailwindCSS 4 & Shadcn UI**: Utility-first styling with accessible, headless Radix UI components.
* **Monaco Editor (`@monaco-editor/react`)**: VS Code-grade editor for JSON body authoring and WebSocket message composition.
* **React Hook Form + Zod**: End-to-end type-safe form validation.
* **Sonner**: Toast notifications for send confirmations and error feedback.

**Backend & Database**
* **Next.js Server Actions**: All database mutations and outbound HTTP calls run entirely on the server — credentials and CORS are never exposed to the browser.
* **Prisma ORM 5**: Schema-first, fully type-safe database client with auto-generated TypeScript types.
* **PostgreSQL via Supabase**: Production-grade relational database with 10 normalized tables. Connection pooling via **PgBouncer** (Transaction Pooler for runtime, Session Pooler for migrations).
* **Better Auth**: Production-ready authentication with GitHub and Google OAuth 2.0, HTTP-only session cookies, and server-side session validation.
* **Axios (server-side)**: Outbound API requests are executed within Server Actions, completely bypassing browser CORS restrictions.
* **Vercel AI SDK**: Provider-agnostic AI toolkit supporting Google Generative AI and Anthropic Claude for JSON body generation and name suggestion.

**Deployment & Infrastructure**
* **Render**: Full-stack web service hosting running Next.js with SSR and Server Actions, deployed directly from GitHub.
* **Supabase**: Managed PostgreSQL cloud database with automatic backups and PgBouncer connection pooling.
* **Docker Compose**: Included single-command local PostgreSQL sandbox for offline development.

---

## Getting Started

### Prerequisites
* **Node.js 20+**: Required for Next.js 16.
* **Docker Desktop** *(Optional)*: For local PostgreSQL via the included `docker-compose.yml` instead of connecting directly to Supabase.
* Supabase project (for production) and OAuth apps on GitHub and Google.

### Installation & Setup

1. **Clone & Install Dependencies**
   ```bash
   git clone https://github.com/Riddhi-chavan/post-girl.git
   cd post-girl
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the project root:
   ```env
   # Supabase PostgreSQL (Transaction pooler for runtime)
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   # Supabase PostgreSQL (Session pooler for migrations)
   DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

   # Better Auth
   BETTER_AUTH_SECRET=your-secure-random-secret
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # OAuth Providers
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # AI Providers (Vercel AI SDK)
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-generative-ai-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```
   > **Local Dev:** Run `docker-compose up -d` and replace `DATABASE_URL` / `DIRECT_URL` with `postgresql://postgres:postgres@localhost:5432/postgres` to use the local database.

3. **Initialize the Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   App is available at `http://localhost:3000`.

---

## Usage

* **Sign In**: Use GitHub or Google OAuth to log in. A default **Personal Workspace** is automatically provisioned on first login.
* **Create a Workspace**: Create additional workspaces for teams or projects.
* **Invite Team Members**: Copy a token-based invite link (7-day expiry) with a pre-assigned role. Recipients click the link to join.
* **Import from Postman**: Use the import button and upload a Postman Collection v2.1 `.json` file. All requests are created instantly.
* **Test a REST API**: Select a collection, create a request, set the method and URL, add params/headers/body, and hit **Send**. Results appear with status code, duration, and formatted response body.
* **Test a WebSocket**: Switch to the Realtime tab, paste a `ws://` or `wss://` URL, and click **Connect**. Type a message in the Monaco editor and press **Ctrl+Enter** or **Send**. All sent and received frames appear in the live message log.
* **Use AI**: Click the AI prompt inside the body editor to generate a realistic JSON payload, or get smart name suggestions for your endpoint.
* **Share a Request**: Click the share icon to generate a public link. Anyone can view the snapshot — logged-in users can also save it to their own account.

---

## Deployment

### Fullstack Application (Render)
1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) and connect your repository.
3. Set **Build Command** to `npm run build` and **Start Command** to `npm start`.
4. Add all environment variables from your `.env` into the Render dashboard.

### Database (Supabase)
1. Create a new project on [Supabase](https://supabase.com).
2. Navigate to **Project Settings → Database → Connection string** and copy both the **Transaction** and **Session** pooler URLs.
3. Set `DATABASE_URL` to the Transaction Pooler URL (port `6543`, with `?pgbouncer=true`).
4. Set `DIRECT_URL` to the Session Pooler URL (port `5432`) — used only by Prisma for schema migrations.
5. Run `npx prisma db push` to sync your schema.

---

## Features in Detail

### WebSocket Testing Client
Post-girl includes a fully custom WebSocket client built on the native browser `WebSocket` API, powered by a Zustand store (`useWsStore`):

- **Connection management**: Connect to any `ws://` or `wss://` URL. Status indicator shows `disconnected`, `connecting`, `connected`, or `error` in real time.
- **Auto-reconnect**: If the connection drops unexpectedly (non-`1000` close codes), it automatically retries with **exponential backoff** (up to 5 attempts, delay multiplied by 1.5× each retry).
- **Monaco message editor**: Compose messages in a Monaco Editor with JSON syntax validation. `Ctrl+Enter` fires the send command. Auto-formats and validates JSON before sending.
- **Bidirectional message log**: Every sent (`↑`) and received (`↓`) frame is displayed in a scrollable timestamped log (millisecond precision), capped at the last 100 messages to avoid memory issues.
- **Clipboard & navigation**: Copy any message to the clipboard. Use the `↑` / `↓` arrow buttons to step through the message log.

### Server-Side REST API Execution
REST requests run via **Axios inside a Next.js Server Action**, not the browser:
- Sidesteps all CORS restrictions — cross-origin APIs work without proxy configuration.
- Captures `status`, `statusText`, `headers`, response `body`, and `durationMs` using `performance.now()`.
- Each run is persisted to the `RequestRun` table. If successful, the `Request` record's cached `response` field is updated for quick previews.

### Database Schema (10 Models)

| Model | Purpose |
|---|---|
| `User` | Core identity linked to auth sessions |
| `Session` / `Account` | Better Auth session and OAuth provider records |
| `Workspace` | Isolated team environments with owner tracking |
| `WorkspaceMember` | RBAC join table — `ADMIN`, `EDITOR`, `VIEWER` |
| `WorkspaceInvite` | Cryptographic token invites with 7-day expiry |
| `Collection` | Logical grouping of requests within a workspace |
| `Request` | Full request config: method, URL, headers, params, body |
| `RequestRun` | Immutable audit log — status, duration (ms), response |
| `SharedRequest` | Public snapshot token with optional TTL expiry |
| `SavedSharedRequest` | Per-user library of requests imported from public links |

### Postman v2.1 Importer
- Parses both string and object Postman URL formats including nested query parameters.
- Maps HTTP methods to the internal `REST_METHOD` enum, defaulting to `GET` for unsupported types.
- Converts enabled headers into `Record<string, string>`, skipping disabled entries.
- Preserves `raw` body mode content with full language metadata.
- All requests are created atomically in a **single Prisma `create` with nested relations** for data consistency.

### Role-Based Access Control

| Role | Capabilities |
|---|---|
| `ADMIN` | Generate invites, update member roles, full edit & delete access |
| `EDITOR` | Create and modify collections and requests |
| `VIEWER` | Read-only access to workspace content |

Only `ADMIN` members can generate invite links. Invites carry the target role embedded in the token record — accepted automatically on the `/invites/[token]` route.

### AI Features
Two AI endpoints are exposed at `/api/ai/`:
- **`/generate-json`**: Takes a natural-language `prompt`, an optional `method`, `endpoint`, and existing schema context. Returns a `jsonBody`, plain-English `explanation`, and improvement `suggestions`.
- **`/suggest-name`**: Takes the workspace name, HTTP method, and URL. Returns multiple name `suggestions` each with a `reasoning` string and a `confidence` score (0–1).

---

## Project Architecture

```
post-girl/
├── prisma/
│   └── schema.prisma            # All 10 database models
├── docker-compose.yml           # Local PostgreSQL sandbox
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login & signup pages
│   │   ├── (workspace)/         # Main app layout & dashboard
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── generate-json/   # AI JSON body generation route
│   │   │   │   └── suggest-name/    # AI endpoint name suggestion route
│   │   │   └── auth/            # Better Auth handler
│   │   ├── invite/              # Invite acceptance flow
│   │   └── share/               # Public request snapshot viewer
│   ├── components/              # Shared Shadcn/Radix UI components
│   ├── hooks/                   # Global React hooks
│   ├── lib/                     # Prisma client & Better Auth instance
│   └── modules/
│       ├── ai/                  # AI service calls, hooks & types
│       ├── authentication/      # Session & identity actions
│       ├── collections/         # Collection CRUD actions & UI
│       ├── history/             # Request run history viewer
│       ├── importCollections/   # Postman v2.1 JSON parser
│       ├── invites/             # Invite generation & acceptance
│       ├── realtime/            # WebSocket client (useWsStore, UI)
│       ├── request/             # REST runner, Zustand store, Monaco
│       ├── share/               # Snapshot creation & retrieval
│       └── workspace/           # Workspace CRUD & membership
└── package.json
```

---

## Future Enhancements
- [ ] Environment variables per workspace (e.g. swap `{{baseUrl}}` dynamically)
- [ ] Automated response assertions and test runners
- [ ] Export collections back to Postman JSON format
- [ ] GraphQL request support
- [ ] Scheduled request runners for uptime monitoring
- [ ] OAuth 2.0 configuration helpers for tested APIs
- [ ] Team activity feed and audit logs
- [ ] Dark / light mode toggle

---

## Troubleshooting

**Database connection refused (local dev)**
- Ensure Docker Desktop is running: `docker ps` should show the `postgirl-db-1` container.
- Confirm `DATABASE_URL` in `.env` points to `localhost:5432` when using Docker.

**Database connection refused (Supabase)**
- Copy your connection strings from **Supabase → Project Settings → Database → Connection string**.
- Ensure `DATABASE_URL` uses port `6543` with `?pgbouncer=true` and `DIRECT_URL` uses port `5432`.

**Prisma type errors after schema changes**
- Run `npx prisma generate`. If types are still stale, delete `node_modules/.prisma` and regenerate.

**OAuth not working (GitHub / Google)**
- Verify callback URLs in your OAuth app settings:
  - GitHub: `http://localhost:3000/api/auth/callback/github`
  - Google: `http://localhost:3000/api/auth/callback/google`
- Confirm `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` match your running server URL.

**WebSocket not connecting**
- Ensure the target server supports `ws://` or `wss://` and is reachable from your browser.
- Check the browser console for connection error details.
- If auto-reconnect is stuck, click **Disconnect** and retry manually.

**AI features returning errors**
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` or `ANTHROPIC_API_KEY` is valid and has quota remaining.
- Check the `/api/ai/generate-json` or `/api/ai/suggest-name` route output in the browser network tab.

---

## Contact
**Email**: [riddhic164@gmail.com](mailto:riddhic164@gmail.com)
**Project Link**: [https://github.com/Riddhi-chavan/post-girl](https://github.com/Riddhi-chavan/post-girl)
**Live Demo**: [https://post-girl.onrender.com/](https://post-girl.onrender.com/)

---

Thank you for checking out Post-girl! This project was a wonderful learning experience covering full-stack architecture, real-time browser APIs, AI integrations, and team collaboration patterns. If you have any suggestions or come across any issues, please feel free to open an issue or submit a pull request — your feedback is genuinely appreciated! 🙏
