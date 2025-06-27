import crypto from "crypto";
import nacl from "tweetnacl";
import bip39 from "bip39";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Bun-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base58 encode
const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58Encode(buffer: Buffer): string {
  let num = BigInt("0x" + buffer.toString("hex"));
  let encoded = "";
  while (num > 0n) {
    const remainder = num % 58n;
    num = num / 58n;
    encoded = BASE58_ALPHABET[Number(remainder)] + encoded;
  }
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
    encoded = "1" + encoded;
  }
  return encoded;
}

// Generate wallet JSON
function generateWallet() {
  const entropy = crypto.randomBytes(16);
  const mnemonic = bip39.entropyToMnemonic(entropy.toString("hex"));
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const seed32 = seed.slice(0, 32);
  const keypair = nacl.sign.keyPair.fromSeed(seed32);
  const publicKey = Buffer.from(keypair.publicKey);
  const privateKey = Buffer.from(keypair.secretKey.slice(0, 32));
  const hash = crypto.createHash("sha256").update(publicKey).digest();
  const address = "oct" + base58Encode(hash);

  return {
    mnemonic,
    private_key_hex: privateKey.toString("hex"),
    public_key_hex: publicKey.toString("hex"),
    address
  };
}

// Simple server
const server = Bun.serve({
  port: 8080,
  fetch(req) {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/") {
      return new Response(Bun.file(path.join(__dirname, "index.html")), {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (req.method === "POST" && url.pathname === "/generate") {
      const wallet = generateWallet();
      return Response.json(wallet);
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`🚀 Server running at http://localhost:${server.port}`);
