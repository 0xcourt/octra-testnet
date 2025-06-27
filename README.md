# 🧠 Octra Testnet Wallet Generator

A simple Bun.js-powered wallet generator for the Octra testnet.
Generate mnemonic phrases, derive Ed25519 keypairs, and create testnet addresses — right from your browser.

---

### ⚡ Features

- BIP39 mnemonic generation
- Ed25519 keypair derivation
- Octra address generation (Base58 + SHA256)
- Minimal web UI with live JSON output

---

### 🚀 Quickstart

> Prerequisite: [Bun](https://bun.sh) installed

```
npm install -g bun
```


```bash
git clone https://github.com/0xcourt/octra-testnet.git
cd octra-testnet
bun install
bun run wallet-gen.ts
