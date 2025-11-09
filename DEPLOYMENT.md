# Deployment Setup Guide

## Overview
This project is configured for automatic deployment to CapRover using GitHub Container Registry (GHCR) and GitHub Actions CI/CD pipeline.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **CapRover Server**: A running CapRover instance
3. **GitHub Secrets**: Configure the following secrets in your GitHub repository

## Required GitHub Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### Environment Variables (for Docker build)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Your Supabase publishable/anon key
- `ENCRYPTION_KEY`: Encryption key for API key storage

### CapRover Deployment
- `CAPROVER_SERVER`: Your CapRover server URL (e.g., `https://captain.yourdomain.com`)
- `CAPROVER_APP_NAME`: The name of your app in CapRover (e.g., `epokpanel-frontend`)
- `CAPROVER_APP_TOKEN`: Your CapRover app token (get from CapRover dashboard)

## Setup Steps

### 1. Create CapRover App

1. Log into your CapRover dashboard
2. Go to "Apps" → "One-Click Apps/Databases"
3. Create a new app with your desired name (e.g., `epokpanel-frontend`)
4. Note the app name for GitHub secrets

### 2. Get CapRover App Token

1. In CapRover dashboard, go to "Apps" → Select your app
2. Navigate to "Deployment" tab
3. Scroll to "Method 3: Deploy from Github/Bitbucket/Gitlab"
4. Copy the "App Token" value

### 3. Configure GitHub Secrets

Add all the required secrets listed above to your GitHub repository.

### 4. Enable GitHub Container Registry

The workflow automatically uses GHCR. No additional setup needed - the `GITHUB_TOKEN` is automatically provided by GitHub Actions.

### 5. Configure CapRover Environment Variables (Optional)

In your CapRover app settings, you can also set environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ENCRYPTION_KEY`

**Note**: Environment variables set in GitHub Secrets are baked into the Docker image during build. CapRover environment variables can override these at runtime.

## Deployment Process

### Automatic Deployment
The CI/CD pipeline triggers automatically on:
- Push to `main` branch
- Manual workflow dispatch

### Deployment Flow
1. **Build Stage**: GitHub Actions builds the Docker image with build arguments
2. **Push Stage**: Image is pushed to GHCR (`ghcr.io/francefire/epokpanel-frontend:latest`)
3. **Deploy Stage**: CapRover pulls the image from GHCR and deploys it

### Manual Deployment
To manually trigger deployment:
1. Go to your GitHub repository → Actions
2. Select "Build and Deploy to CapRover" workflow
3. Click "Run workflow" → "Run workflow"

## Image Tags

The workflow creates the following tags:
- `latest`: Latest build from main branch
- `main-<sha>`: Branch name with git commit SHA
- `main`: Branch name

## Accessing Your Application

After successful deployment:
1. Go to your CapRover dashboard
2. Navigate to your app
3. Click "Enable HTTPS" (recommended)
4. Access your app at the provided URL

## Troubleshooting

### Build Fails
- Check GitHub Actions logs for build errors
- Verify all environment variables are set correctly
- Ensure Next.js builds successfully locally: `pnpm build`

### Deployment Fails
- Verify CapRover server URL and app token are correct
- Check CapRover logs in the dashboard
- Ensure your CapRover server can access GHCR (internet connectivity)

### App Not Working After Deployment
- Check CapRover app logs
- Verify environment variables are set correctly
- Ensure port 3000 is exposed (configured in Dockerfile)
- Check that `captain-definition` file is present in repository

## File Structure

```
.
├── Dockerfile                    # Multi-stage Docker build
├── .dockerignore                 # Docker build exclusions
├── captain-definition            # CapRover deployment config
├── next.config.ts                # Next.js config with standalone output
└── .github/
    └── workflows/
        └── deploy.yml            # CI/CD pipeline
```

## Security Notes

- Never commit `.env` files or secrets to the repository
- Use GitHub Secrets for all sensitive data
- GHCR images are private by default for private repositories
- Enable HTTPS on CapRover for production deployments
- Regularly rotate your CapRover app tokens

## Updating the Application

Simply push changes to the `main` branch:
```bash
git add .
git commit -m "Update application"
git push origin main
```

The CI/CD pipeline will automatically build and deploy the changes.

## Local Docker Testing

To test the Docker image locally:

```bash
# Build the image
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your-url \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-key \
  --build-arg ENCRYPTION_KEY=your-encryption-key \
  -t epokpanel-frontend .

# Run the container
docker run -p 3000:3000 epokpanel-frontend
```

Access the app at `http://localhost:3000`
