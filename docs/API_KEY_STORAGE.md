# Secure API Key Storage Setup

## Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Create table for storing encrypted API keys
CREATE TABLE user_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  squarespace_api_key TEXT NOT NULL, -- Encrypted
  squarespace_store_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own API keys
CREATE POLICY "Users can view own API keys"
  ON user_api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON user_api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON user_api_keys
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON user_api_keys
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_user_api_keys_user_id ON user_api_keys(user_id);
```

## Environment Setup

### 1. Generate Encryption Key

Run this command ONCE to generate your encryption key:

```bash
node -e "console.log('ENCRYPTION_KEY=' + Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64'))"
```

### 2. Add to Environment Variables

**For local development** - Add to `.env.local`:
```env
ENCRYPTION_KEY=your-generated-key-here
```

**For production** - Add to your hosting platform (Vercel/etc):
- Go to your project settings
- Add `ENCRYPTION_KEY` environment variable
- Use the same key from step 1

⚠️ **CRITICAL**: Never commit this key to git!

### 3. Update .gitignore

Ensure `.env.local` is in `.gitignore`:
```
.env.local
.env*.local
```

## Security Best Practices

### ✅ DO:
- Store `ENCRYPTION_KEY` only in environment variables
- Use different keys for development/production
- Rotate encryption keys periodically
- Use RLS (Row Level Security) in Supabase
- Never log decrypted API keys
- Use HTTPS only in production

### ❌ DON'T:
- Store encryption key in code or database
- Share encryption keys between environments
- Commit `.env.local` to git
- Log or display decrypted API keys
- Send API keys over unencrypted connections

## Usage Example

```typescript
import { saveApiKeys, getApiKeys } from "@/utils/api-keys";

// Save API keys (automatically encrypted)
const result = await saveApiKeys(
  "user-api-key-from-squarespace",
  "https://mystore.squarespace.com"
);

// Retrieve API keys (automatically decrypted)
const { apiKey, storeUrl } = await getApiKeys();

// Use with Squarespace client
if (apiKey && storeUrl) {
  const client = createSquarespaceClient({ apiKey, storeUrl });
}
```

## Alternative: Supabase Vault (Enterprise)

If you have Supabase Pro/Enterprise, use Supabase Vault:

```sql
-- Using Supabase Vault (more secure, but Pro/Enterprise only)
INSERT INTO vault.secrets (name, secret)
VALUES ('squarespace_api_key', 'user-api-key-here');

-- Retrieve
SELECT decrypted_secret FROM vault.decrypted_secrets 
WHERE name = 'squarespace_api_key';
```

## Key Rotation

To rotate encryption keys:

1. Generate new key
2. Decrypt all existing keys with old key
3. Re-encrypt with new key
4. Update environment variable
5. Deploy

```typescript
// Key rotation script (run once)
async function rotateKeys(oldKey: string, newKey: string) {
  // Implementation depends on your needs
  // This is complex - plan carefully!
}
```
