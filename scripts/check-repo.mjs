#!/usr/bin/env node
// Repository checks used by CI. Everything here is cheap and deterministic.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(root, file), 'utf8');
const readJson = (file) => JSON.parse(read(file));
const failures = [];

function check(name, ok, hint = '') {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`);
  if (!ok) failures.push({ name, hint });
}

const requiredFiles = [
  'README.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'SECURITY.md',
  '.editorconfig',
  '.env.example',
  'package.json',
  'tsconfig.json',
  'foundry.toml',
  'render.yaml',
  'server/index.ts',
  'frontend/index.html',
  'contracts/OwnershipVerifier.sol',
  'contracts/VerifiedShare.sol',
  'docs/assets/banner.png',
  'docs/assets/screen-hero.png',
  'docs/assets/screen-listings.png',
  'docs/assets/screen-detail.png',
];

for (const file of requiredFiles) {
  check(file, existsSync(join(root, file)), 'Missing required file');
}

const readme = read('README.md');
const slugs = new Set(
  [...readme.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) =>
    match[1]
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-'),
  ),
);

for (const target of readme.matchAll(/\]\(#([a-z0-9-]+)\)/g)) {
  check(`README anchor #${target[1]}`, slugs.has(target[1]), 'No heading matches this anchor');
}

for (const image of readme.matchAll(/src="(docs\/[^"]+)"/g)) {
  check(`README image ${image[1]}`, existsSync(join(root, image[1])), 'Image path does not exist');
}

const envExample = read('.env.example');
const requiredEnv = [
  'DEPLOYER_PRIVATE_KEY',
  'SEPOLIA_RPC_URL',
  'CREDITCOIN_RPC_URL',
  'CREDITCOIN_PROOF_BUILDER_URL',
  'SEPOLIA_ASSET_CONTRACT',
  'SEPOLIA_USD_TOKEN',
  'SEPOLIA_CUSD_TOKEN',
  'CREDITCOIN_ASC_CONTRACT',
  'CREDITCOIN_RECEIPT_TOKEN',
  'PORT',
];

for (const key of requiredEnv) {
  check(`.env.example documents ${key}`, new RegExp(`^${key}=`, 'm').test(envExample), 'Add it with a placeholder');
}

const server = read('server/index.ts');
check('server reads the deployer key from env', server.includes('process.env.DEPLOYER_PRIVATE_KEY'));
check('no private key literal in server', !/0x[0-9a-fA-F]{64}/.test(server), 'Found 64 hex characters after 0x');

const frontend = read('frontend/index.html');
check(
  'frontend links to this repository',
  frontend.includes('github.com/maxxexee/rwas-interoperability'),
  'Update the footer source link',
);

for (const file of ['package.json', 'tsconfig.json', 'purchases.json']) {
  if (!existsSync(join(root, file))) continue;
  try {
    readJson(file);
    check(`${file} parses`, true);
  } catch (error) {
    check(`${file} parses`, false, error.message);
  }
}

const pkg = readJson('package.json');
for (const script of ['dev', 'build', 'start', 'deploy', 'test:proof']) {
  check(`package.json has a "${script}" script`, Boolean(pkg.scripts?.[script]));
}

check('render.yaml defines a start command', read('render.yaml').includes('startCommand'));

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}

console.log('\nAll checks passed.');
