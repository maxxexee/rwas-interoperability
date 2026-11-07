# Contributing

This is a hackathon demo, so small, focused pull requests are easiest to review. Bug reports,
limitations, and proof-path fixes are welcome.

## Before you start

- Everything runs on testnets. Never use a wallet or key that holds real funds.
- Do not commit `.env`, private keys, or RPC URLs that contain API keys.
- Open an issue before a large change. The roadmap in the README lists the work that matters most.

## Setup

```bash
git clone https://github.com/maxxexee/rwas-interoperability.git
cd rwas-interoperability
npm ci
cp .env.example .env
npm run dev
```

The app runs at http://localhost:3000. The same Express process serves the API and the frontend.

Contracts:

```bash
forge install foundry-rs/forge-std --no-git
forge build
```

`lib/` is gitignored, so the install step is required on a clean clone.

## Checks

Run these before opening a pull request:

```bash
npx tsc --noEmit
node scripts/check-repo.mjs
forge build
```

CI runs the same commands.

## Style

- Two spaces in TypeScript, JavaScript, JSON, YAML, and HTML. Four spaces in Solidity.
- Match the file you are editing. The frontend is one file; keep it that way.
- Keep the UI warm and editorial: cream, ink, green, gold, DM Sans. Do not add new colors or
  gradients without a reason.
- Comments should explain why, not what.
- No em dashes in new copy. Use a comma, a colon, or two sentences.

## Good first issues

- Enforce `mintTimeValid` and `fromApprovedMinter` in `OwnershipVerifier`.
- Add a Foundry test for the replay guard and the `SourceTxFailed` revert.
- Allowlist source chains and approved minters instead of trusting the submitter.
- Replace `purchases.json` with events from an indexer.

## Pull requests

Fill in the template, link the issue, and list the checks you ran. Screenshots help for frontend
changes.
