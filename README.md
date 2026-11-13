# OpenAssay launch site

A coming-soon site for OpenAssay, positioned as a research engine. The three main contributions are token and compute efficiency, traceable research, and 20+ paper reproductions from 2026 A* conferences. All code and papers will be released. Includes a persistent name/email waitlist.

## Deployment

Source repository: https://github.com/OpenAssay/Website

Primary domain: https://openassay.ca. The www.openassay.ca hostname is also registered with hosting. The site runs on Sites with a persistent D1 waitlist. Domain activation requires the Namecheap records documented in DNS_SETUP.md.

## Reported comparisons

The project owner supplied the token and compute figures displayed on the site: half the tokens of direct OpenAI prompting, and 1,300 GPU hours per paper for OpenAssay versus 2,600 for OpenAI Sol 6.1 and 2,400 for Opus 5.5. The owner confirmed that the compute comparisons use the same H200 SXM hardware. The figures were supplied by the project owner; no independent benchmark reproduction was performed while building the site. The 50.0% and 45.8% compute reductions are calculated from those reported totals.

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
- `app/globals.css`: responsive academic page layout and neutral black/grey palette.
- `app/components/ResearchField.tsx`: three-part logo assembly, collision burst, and continuous particle orbits.
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
