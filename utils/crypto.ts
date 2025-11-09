/**
 * Encryption utilities for sensitive data like API keys
 * Uses Web Crypto API for secure encryption
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

/**
 * Get or generate encryption key from environment
 * IMPORTANT: Store this in your server environment variables, NOT in .env.local
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyString = process.env.ENCRYPTION_KEY;
  
  if (!keyString) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }

  // Convert base64 key to CryptoKey
  const keyData = Buffer.from(keyString, 'base64');
  
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt sensitive data (like API keys)
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  
  const encoded = new TextEncoder().encode(plaintext);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  );

  // Combine IV and ciphertext, then encode as base64
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  return Buffer.from(combined).toString('base64');
}

/**
 * Decrypt sensitive data
 */
export async function decrypt(encryptedData: string): Promise<string> {
  const key = await getEncryptionKey();
  const combined = Buffer.from(encryptedData, 'base64');
  
  // Extract IV and ciphertext
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Generate a new encryption key (run once, store in environment)
 * Usage: node -e "require('./utils/crypto').generateEncryptionKey()"
 */
export function generateEncryptionKey(): string {
  const key = crypto.getRandomValues(new Uint8Array(32)); // 256 bits
  return Buffer.from(key).toString('base64');
}
