# OpenAssay launch site

A coming-soon site for OpenAssay, positioned as a research engine. Includes a teaser for the forthcoming collection of 100+ NeurIPS papers reproduced with code and a persistent name/email waitlist.

## Development

Requires Node.js 22.13+ and npm. From this directory:

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_new_galactus.sql
npm run dev
```

Apply the initial migration only once per local database. Development serves on http://localhost:5173. The production preview command is `npm start` after a build. Local D1 data lives in the ignored `.wrangler/` directory and is separate from hosted signups.

This checkout also has an ignored local Node runtime under `.sites-runtime/node/` for the current computer. Add `.sites-runtime/node/bin` to `PATH` to use its `node` and `npm` commands.

## Content and styles

- `app/page.tsx`: public launch copy and page sections.
- `app/globals.css`: responsive typography, layout, colors, and motion preferences.
- `app/components/ResearchField.tsx`: abstract particle artwork, with a pause control and reduced-motion support.
- `app/components/WaitlistForm.tsx`: waitlist form, validation, error and confirmation states.
- `app/layout.tsx`: page and social metadata.
- `public/assets/`: locally served fonts and their licenses.

## Waitlist

`POST /api/waitlist` accepts JSON `{name, email, website?}`. It validates the input, normalizes email addresses, and persists to the D1 `waitlist_signups` table. Duplicate email addresses return the same confirmation without creating a second row. The `website` field is a honeypot.

There is no public signup listing endpoint. Signups can be inspected through the site's connected database tools. The site stores signups; sending launch emails is a separate step and no confirmation emails are sent automatically.

The schema is in `db/schema.ts`; migration SQL and metadata are in `drizzle/`. Sites applies the schema migration to the hosted database during publication. `.openai/hosting.json` retains the Site identity and D1 binding.

## Validation

```sh
npx tsc --noEmit
npm run build
```

The waitlist was also checked against the built local Worker and D1 database for successful persistence, repeat submissions, invalid input, malformed JSON, origin checks, and honeypot handling. Browser visual QA was unavailable in the authoring session.
