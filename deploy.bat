@echo off
echo ========================================
echo Building Network VAPT Assessment
echo ========================================
echo.

echo Step 1: Verifying favicon is in public folder...
if not exist "frontend\public\favicon\cyberaran-favicon.png" (
    echo Warning: Favicon not found in public folder. Copying from assets...
    if exist "frontend\src\assets\favicon\cyberaran-favicon.png" (
        copy "frontend\src\assets\favicon\cyberaran-favicon.png" "frontend\public\favicon\cyberaran-favicon.png"
        echo Favicon copied successfully.
    ) else (
        echo Error: Favicon source file not found!
    )
)

echo.
echo Step 2: Installing dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo Step 4: Verifying build output...
if not exist "build\index.html" (
    echo Error: Build output not found
    pause
    exit /b 1
)

cd ..
echo.
echo Step 5: Deploying to Firebase...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo Error: Deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment completed successfully!
echo ========================================
pause
