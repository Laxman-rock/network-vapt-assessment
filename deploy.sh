#!/bin/bash

echo "========================================"
echo "Building Network VAPT Assessment"
echo "========================================"
echo ""

echo "Step 1: Verifying favicon is in public folder..."
if [ ! -f "frontend/public/favicon/cyberaran-favicon.png" ]; then
    echo "Warning: Favicon not found in public folder. Copying from assets..."
    if [ -f "frontend/src/assets/favicon/cyberaran-favicon.png" ]; then
        cp "frontend/src/assets/favicon/cyberaran-favicon.png" "frontend/public/favicon/cyberaran-favicon.png"
        echo "Favicon copied successfully."
    else
        echo "Error: Favicon source file not found!"
    fi
fi

echo ""
echo "Step 2: Installing dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "Step 3: Building production bundle..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
fi

echo ""
echo "Step 4: Verifying build output..."
if [ ! -f "build/index.html" ]; then
    echo "Error: Build output not found"
    exit 1
fi

cd ..
echo ""
echo "Step 5: Deploying to Firebase..."
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "Error: Deployment failed"
    exit 1
fi

echo ""
echo "========================================"
echo "Deployment completed successfully!"
echo "========================================"
