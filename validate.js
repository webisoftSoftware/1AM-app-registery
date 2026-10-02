#!/usr/bin/env node
/**
 * Registry Validation Script
 * Runs on every PR to ensure registry.json is valid and follows spec.
 * Exit code 0 = pass, 1 = fail.
 */

const fs = require('fs');
const path = require('path');

const VALID_CATEGORIES = ['defi', 'tools', 'gaming', 'social', 'nft', 'identity', 'other'];
const VALID_NETWORKS = ['stagenet', 'preview', 'preprod', 'mainnet', '*'];
const VALID_CONTRACT_THEMES = ['ascend'];
const MAX_ID_LENGTH = 32;
const MAX_NAME_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 120;
const MAX_CONTRACT_ROLE_LENGTH = 32;
const MAX_ICON_FILE_SIZE = 50 * 1024; // 50KB
const MAX_APPS = 500;

let errors = 0;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function pass(msg) {
  console.log(`  ✓ ${msg}`);
}

// Load registry
const registryPath = path.join(__dirname, 'registry.json');
let registry;
try {
  const raw = fs.readFileSync(registryPath, 'utf-8');
  registry = JSON.parse(raw);
  pass('Valid JSON');
} catch (e) {
  fail(`Invalid JSON: ${e.message}`);
  process.exit(1);
}

// Check top-level structure
if (typeof registry.version !== 'number') fail('Missing or invalid "version" (must be number)');
else pass(`Version: ${registry.version}`);

if (!Array.isArray(registry.apps)) { fail('"apps" must be an array'); process.exit(1); }
if (registry.apps.length > MAX_APPS) fail(`Too many apps: ${registry.apps.length} (max ${MAX_APPS})`);
else pass(`${registry.apps.length} app(s)`);

// Check each app
const ids = new Set();
for (const app of registry.apps) {
  console.log(`\n  Checking: ${app.name || app.id || '(unnamed)'}`);

  // id
  if (!app.id || typeof app.id !== 'string') { fail('Missing "id"'); continue; }
  if (app.id.length > MAX_ID_LENGTH) fail(`id "${app.id}" too long (${app.id.length}/${MAX_ID_LENGTH})`);
  if (!/^[a-z0-9-]+$/.test(app.id)) fail(`id "${app.id}" must be lowercase alphanumeric + hyphens`);
  if (ids.has(app.id)) fail(`Duplicate id: "${app.id}"`);
  ids.add(app.id);

  // name
  if (!app.name || typeof app.name !== 'string') fail('Missing "name"');
  else if (app.name.length > MAX_NAME_LENGTH) fail(`name "${app.name}" too long (${app.name.length}/${MAX_NAME_LENGTH})`);
  else pass(`name: ${app.name}`);

  // description
  if (!app.description || typeof app.description !== 'string') fail('Missing "description"');
  else if (app.description.length > MAX_DESCRIPTION_LENGTH) fail(`description too long (${app.description.length}/${MAX_DESCRIPTION_LENGTH})`);
  else pass(`description: ${app.description.slice(0, 50)}...`);

  // icon
  if (!app.icon || typeof app.icon !== 'string') fail('Missing "icon"');
  else if (!app.icon.startsWith('https://')) fail(`icon must be HTTPS: ${app.icon}`);
  else pass(`icon: ${app.icon.slice(0, 60)}...`);

  // url
  if (!app.url || typeof app.url !== 'string') fail('Missing "url"');
  else if (!app.url.startsWith('https://')) fail(`url must be HTTPS: ${app.url}`);
  else pass(`url: ${app.url}`);

  // category
  if (!VALID_CATEGORIES.includes(app.category)) fail(`Invalid category "${app.category}" — must be one of: ${VALID_CATEGORIES.join(', ')}`);
  else pass(`category: ${app.category}`);

  // networks
  if (!Array.isArray(app.networks) || app.networks.length === 0) fail('Missing or empty "networks"');
  else {
    for (const n of app.networks) {
      if (!VALID_NETWORKS.includes(n)) fail(`Invalid network "${n}" — must be one of: ${VALID_NETWORKS.join(', ')}`);
    }
    pass(`networks: ${app.networks.join(', ')}`);
  }

  // contracts
  if (app.contracts !== undefined) {
    if (!Array.isArray(app.contracts)) {
      fail('"contracts" must be an array when present');
    } else {
      const contractAddresses = new Set();
      for (const contract of app.contracts) {
        if (!contract || typeof contract !== 'object') {
          fail('contract entries must be objects');
          continue;
        }

        if (!contract.address || typeof contract.address !== 'string') {
          fail('contract missing "address"');
        } else if (!/^[a-f0-9]{64}$/i.test(contract.address)) {
          fail(`contract address must be 64 hex chars: ${contract.address}`);
        } else if (contractAddresses.has(contract.address.toLowerCase())) {
          fail(`duplicate contract address in app: ${contract.address}`);
        } else {
          contractAddresses.add(contract.address.toLowerCase());
          pass(`contract address: ${contract.address.slice(0, 12)}...`);
        }

        if (!VALID_NETWORKS.includes(contract.network) || contract.network === '*') {
          fail(`Invalid contract network "${contract.network}" — must be one of: stagenet, preview, preprod, mainnet`);
        } else if (!Array.isArray(app.networks) || (!app.networks.includes('*') && !app.networks.includes(contract.network))) {
          fail(`contract network "${contract.network}" is not listed in app.networks`);
        } else {
          pass(`contract network: ${contract.network}`);
        }

        if (!contract.name || typeof contract.name !== 'string') fail('contract missing "name"');
        else if (contract.name.length > MAX_NAME_LENGTH) fail(`contract name too long (${contract.name.length}/${MAX_NAME_LENGTH})`);
        else pass(`contract name: ${contract.name}`);

        if (!contract.role || typeof contract.role !== 'string') fail('contract missing "role"');
        else if (contract.role.length > MAX_CONTRACT_ROLE_LENGTH) fail(`contract role too long (${contract.role.length}/${MAX_CONTRACT_ROLE_LENGTH})`);
        else pass(`contract role: ${contract.role}`);

        if (!contract.description || typeof contract.description !== 'string') fail('contract missing "description"');
        else if (contract.description.length > MAX_DESCRIPTION_LENGTH) fail(`contract description too long (${contract.description.length}/${MAX_DESCRIPTION_LENGTH})`);
        else pass(`contract description: ${contract.description.slice(0, 50)}...`);

        if (contract.theme !== undefined && !VALID_CONTRACT_THEMES.includes(contract.theme)) {
          fail(`Invalid contract theme "${contract.theme}" — must be one of: ${VALID_CONTRACT_THEMES.join(', ')}`);
        }

        if (contract.verified !== undefined && typeof contract.verified !== 'boolean') {
          fail('contract "verified" must be boolean when present');
        }

        if (contract.explorerUrl !== undefined) {
          if (typeof contract.explorerUrl !== 'string' || !contract.explorerUrl.startsWith('https://')) {
            fail(`contract explorerUrl must be HTTPS: ${contract.explorerUrl}`);
          } else {
            pass(`contract explorerUrl: ${contract.explorerUrl}`);
          }
        }
      }
    }
  }
}

// Check local icon files
const iconsDir = path.join(__dirname, 'icons');
if (fs.existsSync(iconsDir)) {
  console.log('\n  Checking icon files:');
  for (const file of fs.readdirSync(iconsDir)) {
    const filePath = path.join(iconsDir, file);
    const stat = fs.statSync(filePath);
    if (stat.size > MAX_ICON_FILE_SIZE) {
      fail(`Icon "${file}" is ${(stat.size / 1024).toFixed(1)}KB (max ${MAX_ICON_FILE_SIZE / 1024}KB)`);
    } else {
      pass(`${file}: ${(stat.size / 1024).toFixed(1)}KB`);
    }
  }
}

// Summary
console.log(`\n${errors === 0 ? '✓ All checks passed!' : `✗ ${errors} error(s) found`}\n`);
process.exit(errors > 0 ? 1 : 0);
