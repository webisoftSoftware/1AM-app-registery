<p align="center">
  <img src="./logo.svg" alt="1AM" width="80" />
</p>

<h1 align="center">1AM App Registry</h1>

<p align="center">
  <strong>The official DApp directory for the 1AM Wallet on Midnight Network.</strong><br/>
  Submit your app to reach every 1AM Wallet user.
</p>

<p align="center">
  <a href="https://1am.xyz">Website</a> ·
  <a href="https://explorer.1am.xyz">Explorer</a> ·
  <a href="mailto:team@1am.xyz">Support</a>
</p>

---

## How It Works

The [1AM Wallet](https://github.com/webisoftSoftware/one-am-wallet) has a built-in **Apps** tab that displays DApps from this registry. The wallet fetches `registry.json` from this repo every hour and shows the apps to users — filtered by their active network.

**Want your app listed?** Submit a pull request.

---

## Submit Your App

### 1. Fork this repo

### 2. Add your app to `registry.json`

Add an entry to the `apps` array:

```json
{
  "id": "your-app-id",
  "name": "Your App Name",
  "description": "Short description of what your app does",
  "icon": "https://your-app.com/icon.png",
  "url": "https://your-app.com",
  "category": "defi",
  "networks": ["preview", "preprod"],
  "contracts": [
    {
      "address": "64-character-contract-address-hex",
      "network": "mainnet",
      "name": "Your App Contract",
      "role": "Application",
      "description": "Verified mainnet contract for Your App",
      "theme": "ascend",
      "verified": true,
      "explorerUrl": "https://explorer.1am.xyz/contract/..."
    }
  ],
  "featured": false,
  "new": true
}
```

### 3. Submit a pull request

We'll review and merge within 24 hours.

---

## Field Specification

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier. Lowercase, alphanumeric + hyphens. Max 32 chars. |
| `name` | string | Yes | Display name. Max 40 chars. |
| `description` | string | Yes | One-line description. Max 120 chars. |
| `icon` | string (URL) | Yes | App icon URL. Must be HTTPS. PNG or SVG, 128x128px recommended. |
| `url` | string (URL) | Yes | DApp URL. Must be HTTPS. |
| `category` | string | Yes | One of: `defi`, `tools`, `gaming`, `social`, `nft`, `identity`, `other` |
| `networks` | string[] | Yes | Supported networks: `stagenet`, `preview`, `preprod`, `mainnet`, or `*` for all. |
| `contracts` | object[] | No | Verified public contracts for this app. Used by 1AM Explorer to show partner themes and verified badges. |
| `featured` | boolean | No | Set by maintainers only. Do not include in submissions. |
| `new` | boolean | No | Automatically set for new listings. Removed after 30 days. |

### Contract Specification

| Field | Type | Required | Description |
|---|---|---|---|
| `address` | string | Yes | 64-character Midnight contract address hex. |
| `network` | string | Yes | Contract network: `stagenet`, `preview`, `preprod`, or `mainnet`. Must also be listed in the app `networks`. |
| `name` | string | Yes | Human-readable contract name. Max 40 chars. |
| `role` | string | Yes | Short role label, such as `Registry`, `Application`, or `Router`. |
| `description` | string | Yes | One-line contract description. Max 120 chars. |
| `theme` | string | No | Partner explorer theme to activate for this contract. Currently supports `ascend`. |
| `verified` | boolean | No | Marks the contract as verified by the 1AM registry. |
| `explorerUrl` | string | No | HTTPS link to the 1AM Explorer contract detail page. |

### Icon Requirements

- **Format**: PNG or SVG
- **Size**: 128x128 pixels (minimum 64x64)
- **Background**: Transparent or solid color (no gradients with transparency)
- **Hosted**: Must be served over HTTPS from your domain
- **File size**: Under 50KB

### URL Requirements

- Must be HTTPS
- Must be a working, publicly accessible URL
- Must implement the [Midnight DApp Connector API](https://docs.midnight.network) (v4.0+)
- Must work with 1AM Wallet on at least one supported network

---

## Categories

| Category | Description | Examples |
|---|---|---|
| `defi` | Decentralized finance — trading, lending, liquidity | Token launchpads, DEXs, bridges |
| `tools` | Developer and user tools | Block explorers, analytics, faucets |
| `gaming` | On-chain gaming | Card games, strategy, prediction markets |
| `social` | Social applications | Messaging, reputation, communities |
| `nft` | NFT platforms | Marketplaces, minting, collections |
| `identity` | Identity and naming | Name services, ZK identity, verifiable credentials |
| `other` | Everything else | DAOs, governance, utilities |

---

## Review Criteria

We review all submissions for:

- **Working URL** — the app must be live and functional
- **DApp Connector** — must integrate with 1AM Wallet via the standard API
- **No malware** — no phishing, scams, or malicious code
- **Accurate info** — name, description, and icon must accurately represent the app
- **Network support** — must work on at least one listed network

We reserve the right to remove listings that violate these criteria.

---

## Maintainers

| Name | GitHub | Email |
|---|---|---|
| Utkarsh Varma | [@UvRoxx](https://github.com/UvRoxx) | utkarsh@1am.xyz |
| William Marchand | [@WillMTL](https://github.com/WillMTL) | william@1am.xyz |

---

## Support

- **General**: [team@1am.xyz](mailto:team@1am.xyz)
- **Submission help**: Open an [issue](https://github.com/webisoftSoftware/1AM-app-registery/issues)
- **Security**: [team@1am.xyz](mailto:team@1am.xyz) (prefix subject with `[SECURITY]`)

---

<p align="center">
  Built by <a href="https://webisoft.com">Webisoft</a> · Powered by <a href="https://midnight.network">Midnight Network</a>
</p>
