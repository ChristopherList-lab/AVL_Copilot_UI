# AVL Copilot — UI

AI troubleshooting chat for audio, video, and lighting technicians. This is the **UI scaffold** — no backend, no LLM. Auth and chat data live in `localStorage` so real APIs can be wired in later without touching UI code.

- **Live site:** https://christopherlist-lab.github.io/AVL_Copilot_UI/
- **Marketing site:** https://christopherlist-lab.github.io/AVLcopilot/
- **Marketing source:** https://github.com/ChristopherList-lab/AVLcopilot

## Stack

Vite + React 19 + TypeScript, Tailwind CSS, react-router-dom (HashRouter for Pages compatibility). No UI kit, no state library, no backend.

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serves dist/ locally on :4173
```

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`.

## Backend integration points

Three files are the swap points for real APIs:

| File | Responsibility | Replace with |
|---|---|---|
| `src/lib/auth.ts` | Sign in / sign up / sign out | Real auth SDK (Supabase, Clerk, Auth.js) |
| `src/lib/threads.ts` | Thread + message CRUD | REST or GraphQL against your API |
| `src/lib/mock.ts` | Canned AI replies with 1.5–2s delay | Streaming LLM call (OpenAI, Anthropic) |

## Structure

```
src/
├── App.tsx              # router + auth provider
├── components/          # AppShell, AuthScreen, ChatBubble, etc.
├── lib/                 # auth, threads, mock, types
└── routes/              # SignIn, SignUp, ForgotPassword, Chat, Settings
```

Brand tokens live in `tailwind.config.js`. Mirror any design changes from the marketing site there.
