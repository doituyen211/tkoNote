# Learnboard

A premium, Pinterest-inspired learning dashboard for storing YouTube resources, capturing themed notes, and searching everything from one workspace. Built as a production-quality reference app — not a prototype.

## Tech stack

| Concern       | Choice                                  |
| ------------- | ---------------------------------------- |
| Framework     | Next.js 15 (App Router)                  |
| Language      | JavaScript (no TypeScript)               |
| Styling       | Tailwind CSS + hand-built shadcn/ui-style primitives on Radix UI |
| Animation     | Framer Motion                            |
| Icons         | Lucide React                             |
| Theme         | next-themes (light / dark / system)      |
| Notifications | Sonner                                   |
| Forms         | React Hook Form + Zod                    |
| Persistence   | Browser localStorage (versioned schema)  |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables, database, or backend are required — everything is stored in the browser's localStorage.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Design system

The visual language is Pinterest-inspired: a masonry grid for content, a single confident red accent, generous rounded corners, and restrained motion.

- **Color** — primary red `hsl(354 100% 45%)` (a soft `hsl(354 90% 55%)` in dark mode for contrast comfort), neutral off-white/near-black backgrounds, and a semantic set (`success`, `warning`, `error`) for states. All colors are CSS variables in `app/globals.css` so both themes stay in sync and every Tailwind utility (`bg-primary`, `text-error`, etc.) resolves correctly in light and dark.
- **Typography** — a system font stack (`-apple-system`, `Segoe UI`, `Inter`, `Helvetica Neue`) for fast, dependency-free loading and native feel across platforms.
- **Radius** — a single `--radius: 16px` token feeds `rounded-lg` → `rounded-2xl`, so every card, dialog, input, and pill shares the same visual DNA.
- **Layout** — `masonry` / `masonry-sm` utility classes use CSS columns to create the Pinterest-style reflowing grid (1 → 2 → 3 → 4 columns from mobile to large desktop) for both videos and notes.
- **Motion** — Framer Motion is used for hover lift (`whileHover={{ y: -4 }}`), dialog enter/exit, animated stat values, and note list transitions. Motion is always short (150–350ms) and never blocks interaction.

## Architecture

Feature-first, clean-architecture layout:

```
app/                  routes only — thin pages that compose feature hooks + components
components/           shared, feature-agnostic UI (Button, Dialog, TopNav, EmptyState, ...)
features/
  videos/
    components/       VideoCard, VideoGrid, AddVideoDialog, VideoFilters
    hooks/            useVideos — owns all video state + mutations
    services/         video.storage.js (persistence), youtube.service.js (oEmbed)
    utils/            youtube-parser.js (URL → id, thumbnail, canonical URL)
  notes/
    components/       NoteCard, NoteGrid, NoteFormDialog, NoteFilters
    hooks/            useNotes
    services/         note.storage.js
    constants/        themes.js — the 8 note themes (palette, icon, border, decoration)
  search/
    hooks/            useGlobalSearch — debounced, case-insensitive filtering
    components/       GlobalSearchBar
  settings/
    components/       ImportExport, ThemeSettings
    services/         data-io.service.js — export/import with schema validation
hooks/                 generic hooks: useDebounce, useMounted
lib/                   storage.js (versioned schema + migrations), validators.js (Zod), utils.js (cn, formatDate, generateId)
constants/             storage keys and the empty-state schema shape
```

**Why this split:** UI components never talk to `localStorage` directly — they call a hook (`useVideos`, `useNotes`), which calls a service (`video.storage.js`, `note.storage.js`), which calls the generic `lib/storage.js` layer. Swapping localStorage for a real API later means rewriting only the `services/` files; components and hooks are unaffected.

## Data layer & resilience

Everything is stored under a single localStorage key as a versioned object:

```js
{
  version: 1,
  videos: [],
  notes: [],
  settings: { videoSort: "newest", noteSort: "newest" }
}
```

- **Migrations** — `lib/storage.js` includes a `migrations` registry keyed by version. Bumping `SCHEMA_VERSION` and adding a migration function is all that's needed to evolve the schema without breaking existing users' data.
- **Corruption recovery** — malformed JSON, missing keys, or unexpected shapes never throw; `readStorage()` always returns a safe, sanitized default instead of crashing the app.
- **Import merge** — importing a JSON export never overwrites existing data. Videos and notes are merged and de-duplicated by `id`; only genuinely new records are added.

## Features implemented

- **Dashboard** — animated stat cards (total videos, total notes, last activity), global search, recently-added previews for both videos and notes.
- **Video Library** — paste a `youtube.com/watch`, `youtu.be/`, or `youtube.com/shorts/` link; the app parses the video id, builds the thumbnail URL, and fetches the real title via YouTube's public oEmbed endpoint (falling back gracefully if the network call fails). Cards support opening the video, copying the link, and deleting (with confirmation). Videos can be reordered by drag-and-drop when sorted "Newest first"; the manual order persists.
- **Cute Notes** — 8 themes (Sakura, Cat, Bunny, Teddy, Lemon, Plant, Cloud, Galaxy), each with its own color palette, icon, border, and background tint. Full create/edit/delete with Zod-validated forms.
- **Global search** — a single search bar on the dashboard filters both videos and notes in real time, case-insensitively.
- **Filters** — videos: Newest / Oldest / Alphabetical. Notes: Newest / Oldest / By theme.
- **Theme** — light / dark / system, persisted via `next-themes`, with a smooth color transition.
- **Import / export** — export all data as a timestamped JSON file; import validates the schema with Zod before merging, and reports how many videos/notes were added.
- **Empty states** — every list (video library, notes, search results) has an illustration-style icon, contextual copy, and a call-to-action where relevant.
- **Toasts** — success, error, and info feedback via Sonner for every mutation (add, delete, edit, import/export).
- **Confirmation dialogs** — accessible (`role="alertdialog"`), keyboard-navigable delete confirmations for both videos and notes.

## Accessibility

- Semantic HTML and correct button `type`s throughout (no bare `<div onClick>` interactive elements).
- All icon-only buttons have `aria-label`s; destructive actions are confirmed before executing.
- Visible focus rings (`:focus-visible`) on every interactive element, independent of Tailwind's default resets.
- Forms use `<label>`/`htmlFor` pairing, `aria-invalid`, and `aria-describedby` for error messages, which are also announced via `role="alert"`.
- The theme note-picker uses `role="radiogroup"` / `role="radio"` with `aria-checked` for correct screen-reader semantics.
- Color choices maintain WCAG-AA contrast in both light and dark themes.

## Known trade-offs

- Drag-to-reorder is intentionally only meaningful in "Newest first" sort — dragging while sorted alphabetically or by oldest will visually snap back, since those sorts are derived, not manual. This matches how Pinterest-style boards behave: manual order is its own explicit mode.
- YouTube's oEmbed endpoint is public and unauthenticated; if a video is private, deleted, or oEmbed is unreachable, the title falls back to "Untitled video" rather than blocking the add flow.
