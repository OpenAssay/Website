# OpenAssay launch site

A coming-soon site for OpenAssay, positioned as a research engine. The three main contributions are token and compute efficiency, traceable research, and 20+ paper reproductions from 2026 A* conferences. All code and papers will be released. Includes a persistent name/email waitlist.

## Deployment

Source repository: https://github.com/OpenAssay/Website

Primary domain: https://openassay.ca. The site runs on the `openassay-web` Cloudflare Worker, with registrations stored in the account's `openassay-waitlist` D1 database. Cloudflare Web Analytics is configured for the existing domain.

Hosting and DNS are managed directly in the owner's Cloudflare account. Deploy this repository with Wrangler; do not register or redeploy it through GPT Sites.

The source `wrangler.jsonc` defines the Worker and its `DB` binding. Build output and the generated deployment configuration are written to `dist/`.

```sh
npm ci
npm run db:migrate
npm run deploy
```

The deployment account must have access to the configured Cloudflare account and database. Custom domain routing is managed in Cloudflare; publishing the Worker alone does not change DNS.

## Reported comparisons

The project owner supplied the token and compute figures displayed on the site: half the tokens of direct OpenAI prompting, and 1,300 GPU hours per paper for OpenAssay versus 2,400 for OpenAI Sol 6.1 and 2,700 for Anthropic Opus 5.5. The owner confirmed that the compute comparisons use the same NVIDIA H100 SXM GPUs. The figures were supplied by the project owner; no independent benchmark reproduction was performed while building the site. The 45.8% and 51.9% compute reductions are calculated from those reported totals. The OpenAssay speedup column divides each system’s GPU-hour cost by 1,300, giving 1×, 1.85×, and 2.08×, respectively.

## Development

Requires Node.js 22.13+ and npm. From this directory:

```sh
npm ci
npm run db:migrate:local
npm run build
npm run dev
```

Wrangler records applied migrations, so the migration command is safe to repeat. Development serves on http://localhost:5173. The production preview command is `npm start` after a build. Local D1 data lives in the ignored `.wrangler/` directory and is separate from hosted signups.

## Content and styles

- `app/page.tsx`: public launch copy and page sections.
- `app/globals.css`: responsive academic page layout and neutral black/grey palette.
- `app/components/ResearchField.tsx`: three-part logo assembly, collision burst, and continuous particle orbits.
- `app/components/WaitlistForm.tsx`: waitlist form, validation, error and confirmation states.
- `app/layout.tsx`: page and social metadata.
- `public/assets/`: locally served fonts and their licenses.

## Waitlist

`POST /api/waitlist` accepts JSON `{name, email, website?}`. It validates the input, normalizes email addresses, and persists to the D1 `waitlist_signups` table. Duplicate email addresses return the same confirmation without creating a second row. The `website` field is a honeypot.

There is no public signup listing endpoint. Signups can be inspected in the Cloudflare D1 dashboard or through authenticated Wrangler queries. The site stores signups; sending launch emails is a separate step and no confirmation emails are sent automatically.

The schema is in `db/schema.ts`; migration SQL and metadata are in `drizzle/`. Run `npm run db:migrate` before deploying a schema change. Database contents are independent of Worker deployments and must be backed up and migrated separately when changing hosting accounts.

## Validation

```sh
npx tsc --noEmit
npm run build
```

The waitlist was also checked against the built local Worker and D1 database for successful persistence, repeat submissions, invalid input, malformed JSON, origin checks, and honeypot handling. Browser visual QA was unavailable in the authoring session.
