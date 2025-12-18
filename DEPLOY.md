# Firebase Deployment Guide

This guide will help you deploy the Network VAPT Assessment application to Firebase Hosting.

## Prerequisites

1. **Firebase CLI** - Install if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Account** - Make sure you're logged in:
   ```bash
   firebase login
   ```

3. **Node.js and npm/yarn** - Required for building the frontend

## Deployment Steps

### Step 1: Verify Favicon is in Public Folder

Make sure the favicon file is in the `frontend/public/favicon/` directory. Vite will copy files from the `public` folder to the build output root.

The favicon should be at: `frontend/public/favicon/cyberaran-favicon.png`

If it's not there, copy it from `frontend/src/assets/favicon/` to `frontend/public/favicon/`.

### Step 2: Build the Frontend

Navigate to the frontend directory and build the application:

```bash
cd frontend
npm install  # or yarn install
npm run build  # or yarn build
```

This will create a `build` folder in the `frontend` directory with the production-ready files.

### Step 3: Verify Firebase Configuration

Make sure your `.firebaserc` file has the correct project ID:
```json
{
  "projects": {
    "default": "network-vapt-assessment"
  }
}
```

### Step 4: Deploy to Firebase

From the root directory of the project:

```bash
firebase deploy --only hosting
```

Or if you want to deploy everything:
```bash
firebase deploy
```

### Step 5: Verify Deployment

After deployment, Firebase will provide you with a URL like:
```
https://network-vapt-assessment.web.app
```
or
```
https://network-vapt-assessment.firebaseapp.com
```

## Quick Deploy Script

You can also create a simple deploy script. Create a file `deploy.sh` (or `deploy.bat` for Windows):

**For Linux/Mac (deploy.sh):**
```bash
#!/bin/bash
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..
echo "Deploying to Firebase..."
firebase deploy --only hosting
```

**For Windows (deploy.bat):**
```batch
@echo off
echo Building frontend...
cd frontend
call npm install
call npm run build
cd ..
echo Deploying to Firebase...
firebase deploy --only hosting
```

Make it executable (Linux/Mac):
```bash
chmod +x deploy.sh
./deploy.sh
```

## Environment Variables

The application uses EmailJS for sending emails. Before deploying, make sure to:

1. **Create a `.env` file** in the `frontend` directory with your EmailJS credentials:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

2. **Important**: Environment variables prefixed with `VITE_` are embedded into the build at build time. They are public and visible in the browser, so only use public keys.

3. **Build-time variables**: These variables are replaced during the build process, so make sure your `.env` file is in place before running `npm run build`.

4. **Don't commit `.env`**: Make sure `.env` is in your `.gitignore` file (it should already be there).

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `npm install` or `yarn install`
- Check for any TypeScript or linting errors
- Verify Node.js version compatibility

### Deployment Fails
- Ensure you're logged in: `firebase login`
- Check that the project ID in `.firebaserc` matches your Firebase project
- Verify the build folder exists: `frontend/build`

### 404 Errors After Deployment
- The `rewrites` rule in `firebase.json` should handle all routes
- Make sure `index.html` exists in the build folder
- Check that React Router is configured correctly

### Assets Not Loading
- Verify that assets in `public` folder are being copied to build
- Check that paths in your code use relative paths or `/` for public assets

### Favicon Not Showing
- Make sure `cyberaran-favicon.png` is in `frontend/public/favicon/` directory
- Verify the path in `index.html` is `/favicon/cyberaran-favicon.png`
- After building, check that `build/favicon/cyberaran-favicon.png` exists
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Continuous Deployment (Optional)

You can set up GitHub Actions or similar CI/CD to automatically deploy on push:

1. Add Firebase token as GitHub secret
2. Create `.github/workflows/deploy.yml`
3. Configure to build and deploy on push to main branch

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Vite Build Documentation](https://vitejs.dev/guide/build.html)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
