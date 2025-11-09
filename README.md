<h1 align="center">Epok Panel - Squarespace Shop Management</h1>

<p align="center">
 A powerful management panel for Squarespace shops with enhanced product management capabilities
</p>

<p align="center">
  <a href="#about"><strong>About</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a>
</p>
<br/>

## About

This is a management panel designed to simplify and enhance Squarespace shop operations through the Squarespace API. The panel provides an intuitive interface for managing products, enabling bulk operations, and streamlining workflows that are otherwise cumbersome in the standard Squarespace interface.

## Features

### Current Features
- **Enhanced Product Management**: Easier and more intuitive product management compared to the native Squarespace interface
- **Bulk Edit Capabilities**: Edit multiple products simultaneously to save time
- **Template-Based Product Creation**: Choose between different product templates:
  - **Paintings**: Automatically sets appropriate categories, tags, and stock to 1
  - **Sculptures**: Pre-configured with relevant categories, tags, and stock settings
  - Custom templates ensure consistency and reduce manual data entry

### Planned Features
- Additional management tools to further streamline shop operations
- Advanced filtering and search capabilities
- Analytics and reporting features
- Custom automation workflows

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) with App Router
- **Authentication**: [Supabase Auth](https://supabase.com/auth) with cookie-based sessions
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **API Integration**: Squarespace API

## Getting Started

1. Clone the repository

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables by creating a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=[YOUR_SUPABASE_PROJECT_URL]
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[YOUR_SUPABASE_PUBLISHABLE_KEY]
   ```

   You can find these values in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

4. Run the development server:
   ```bash
   pnpm dev
   ```

   The application should now be running on [localhost:3000](http://localhost:3000/)

## Development

This project uses:
- TypeScript for type safety
- ESLint for code quality
- Supabase for authentication and backend services
- Next.js middleware for protected routes
