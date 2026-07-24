Deployment guide
================

This repository contains a Vite React frontend (`client/`) and an Express backend (`server/`). The GitHub Actions workflows provided now run a combined fullstack deployment: frontend to GitHub Pages and backend to Render.

What I added
- `.github/workflows/frontend-deploy.yml` — builds `client`, deploys to GitHub Pages, and triggers a backend redeploy on Render when Render secrets are configured.
- `.github/workflows/backend-ci-deploy.yml` — installs server deps and will deploy to Heroku if Heroku secrets are configured.

Quick setup

1. Create a GitHub repository and push this project's files to the `main` branch.

2. Set repository secrets (Settings → Secrets and variables → Actions):
   - (Optional, for Heroku) `HEROKU_API_KEY`, `HEROKU_APP_NAME`, `HEROKU_EMAIL`

3. Frontend deploy (GitHub Pages): the `frontend-deploy` workflow will build `client` and publish `client/dist` to the repository Pages site. No additional secrets required.

4. Backend deploy (Heroku): if you set the Heroku secrets, the `backend-ci-deploy` workflow will run and push to Heroku.

Notes & next steps
- If you prefer Render, Vercel, or another host for the backend, I can update the workflow to use Render's API or Vercel CLI.
- Add test scripts to `server/package.json` to run automated tests in CI.
- Configure environment variables for production (MongoDB connection, email creds, JWT secret) in your host provider's settings.
