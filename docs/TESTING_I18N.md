# Testing Multi-Language Support

## Quick Start

1. **Start the development server**:
   ```bash
   pnpm dev
   ```

2. **Open the application** in your browser at `http://localhost:3000`

3. **Test Language Switching**:
   - Look for the language switcher icon (🌐) in the footer
   - Click on it to see the dropdown with English and French options
   - Select "Français" to switch to French
   - The page will reload and all text should be in French
   - Switch back to "English" to return to English

## What to Test

### Home Page (`/`)
- [x] Title: "Epok Panel" / "Panneau Epok"
- [x] Subtitle about shop management
- [x] "Get Started" / "Commencer" button
- [x] "Sign Up" / "S'inscrire" button
- [x] Feature cards (Product Management, Templates, Bulk Operations)
- [x] Footer copyright text
- [x] Language switcher visible

### Login Page (`/auth/login`)
- [x] "Login" / "Connexion" title
- [x] Email and Password labels
- [x] "Forgot your password?" / "Mot de passe oublié ?" link
- [x] "Login" / "Se connecter" button
- [x] "Don't have an account?" / "Vous n'avez pas de compte ?" text
- [x] "Sign up" / "S'inscrire" link

### Sign-Up Page (`/auth/sign-up`)
- [x] "Sign up" / "Inscription" title
- [x] Email, Password, Repeat Password labels
- [x] "Sign up" / "S'inscrire" button
- [x] "Already have an account?" / "Vous avez déjà un compte ?" text
- [x] Error message for password mismatch in French

### Forgot Password Page (`/auth/forgot-password`)
- [x] "Reset Your Password" / "Réinitialiser votre mot de passe" title
- [x] "Send reset email" / "Envoyer l'e-mail de réinitialisation" button
- [x] Success message in both languages

### Dashboard (`/protected` - requires login)
- [x] "Dashboard" / "Tableau de bord" title
- [x] Welcome message
- [x] Card titles: Total Products, Active Items, Recent Updates, API Status
- [x] Card descriptions for connected/not connected states
- [x] Navigation: Dashboard, Products, Settings

### Products Page (`/protected/products` - requires login)
- [x] "Products" / "Produits" title
- [x] "Bulk Edit" / "Édition en masse" button
- [x] "Add Product" / "Ajouter un produit" button
- [x] Product cards with badges (Visible/Hidden, Sale/Promo)
- [x] Error messages in case of API issues

### Settings Page (`/protected/settings` - requires login)
- [x] "Settings" / "Paramètres" title
- [x] API Configuration card
- [x] Form labels: "API Key" / "Clé API", "Store URL" / "URL de la boutique"
- [x] "Save Configuration" / "Enregistrer la configuration" button
- [x] Success/error messages

## Persistence Test

1. Switch to French
2. Close the browser tab
3. Open the application again
4. The language should still be French (cookie-based persistence)
5. Clear cookies and reload - should default to English

## Browser Console Check

- Open browser dev tools (F12)
- Check for any console errors
- Verify no missing translation warnings

## Edge Cases to Test

1. **Missing translation**: If a key doesn't exist, it should show the key itself
2. **Variable substitution**: Test greeting with email (after login)
3. **Pluralization**: Products count (1 product vs 2 products)
4. **Long text**: French text is often longer - check UI doesn't break

## Common Issues & Solutions

### Issue: Language doesn't change
- **Solution**: Check if `NEXT_LOCALE` cookie is being set
- Clear browser cookies and try again

### Issue: Text shows as key (e.g., "auth.login.title")
- **Solution**: Translation missing in JSON file
- Add the translation to both `en.json` and `fr.json`

### Issue: Build fails
- **Solution**: Check for TypeScript errors in components
- Ensure all pages using client-side translations have `export const dynamic = 'force-dynamic'`

## Production Build Test

```bash
# Build the application
pnpm build

# Start production server
pnpm start

# Test at http://localhost:3000
```

All pages should work in both languages in production mode.

## Next Steps

To add more languages (e.g., Spanish):
1. Create `i18n/messages/es.json`
2. Copy structure from `en.json` and translate
3. Add `{ code: "es", label: "Español", flag: "🇪🇸" }` to `language-switcher.tsx`
4. Test the new language
