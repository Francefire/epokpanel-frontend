# Internationalization (i18n) Implementation

## Overview
The application now supports multiple languages using **next-intl**, a powerful internationalization library for Next.js 15 App Router. Currently supports:
- 🇬🇧 English (default)
- 🇫🇷 French

## Architecture

### Configuration Files
- **`i18n/request.ts`**: Main i18n configuration for Next.js
- **`i18n/messages/en.json`**: English translations
- **`i18n/messages/fr.json`**: French translations
- **`next.config.ts`**: Updated with next-intl plugin

### Translation Structure
Translations are organized by feature/section:
```json
{
  "common": { /* Shared text like buttons, labels */ },
  "nav": { /* Navigation items */ },
  "home": { /* Landing page */ },
  "auth": { 
    "login": { /* Login page */ },
    "signUp": { /* Sign-up page */ },
    "forgotPassword": { /* Password reset */ }
  },
  "dashboard": { /* Dashboard page */ },
  "products": { /* Products page */ },
  "settings": { /* Settings page */ }
}
```

## Usage

### Client Components
```tsx
"use client";
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  return <h1>{t('title')}</h1>;
}
```

### Server Components
```tsx
import { useTranslations } from 'next-intl';

export default async function MyPage() {
  const t = useTranslations('namespace');
  return <h1>{t('title')}</h1>;
}
```

### With Variables
```tsx
// Translation: "Hello, {name}!"
t('greeting', { name: userName })
```

### Cross-Namespace References
```tsx
// Access common translations from other namespaces
t('email', { ns: 'common' })
```

## Language Switching

### LanguageSwitcher Component
Located at `components/language-switcher.tsx`. Available in:
- Home page footer
- Protected pages footer

Uses cookie-based persistence (`NEXT_LOCALE` cookie) to remember user preference across sessions.

### How It Works
1. User selects language from dropdown
2. Cookie is set with selected locale
3. Page refreshes to apply new language
4. Middleware reads cookie and serves appropriate translations

## Updated Files

### Components
- ✅ `app/page.tsx` - Home page
- ✅ `components/login-form.tsx` - Login form
- ✅ `components/sign-up-form.tsx` - Sign-up form
- ✅ `components/forgot-password-form.tsx` - Password reset
- ✅ `components/settings-form.tsx` - Settings form
- ✅ `components/auth-button.tsx` - Auth buttons
- ✅ `components/language-switcher.tsx` - Language switcher (NEW)

### Pages
- ✅ `app/protected/layout.tsx` - Protected area layout
- ✅ `app/protected/page.tsx` - Dashboard
- ✅ `app/protected/settings/page.tsx` - Settings page

## Adding New Translations

### 1. Add to JSON files
Update both `i18n/messages/en.json` and `i18n/messages/fr.json`:

```json
// en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}

// fr.json
{
  "myFeature": {
    "title": "Ma fonctionnalité",
    "description": "Description de la fonctionnalité"
  }
}
```

### 2. Use in Components
```tsx
const t = useTranslations('myFeature');
<h1>{t('title')}</h1>
<p>{t('description')}</p>
```

## Adding New Languages

### 1. Create Translation File
Create `i18n/messages/{locale}.json` (e.g., `es.json` for Spanish)

### 2. Update LanguageSwitcher
Add new language to `components/language-switcher.tsx`:
```tsx
const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" }, // NEW
];
```

## Best Practices

1. **Namespace Organization**: Group related translations together
2. **Consistent Keys**: Use camelCase for translation keys
3. **Variables**: Use placeholders for dynamic content
4. **Context**: Provide enough context in keys (e.g., `auth.login.title` not just `title`)
5. **Fallback**: English is the default fallback language
6. **Testing**: Test all language switches to ensure no missing translations

## Development Workflow

1. Add English text first in `en.json`
2. Use `t()` calls in components
3. Test English version works
4. Add French translations in `fr.json`
5. Test language switching

## Notes

- Cookie-based locale storage ensures persistence
- Middleware handles locale detection automatically
- Server and client components use the same `useTranslations` API
- Translation files are loaded dynamically based on user's locale
