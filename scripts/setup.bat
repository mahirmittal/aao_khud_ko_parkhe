@echo off
echo 🚀 Setting up CG Portal Feedback System...

REM Check if MongoDB dependency exists
echo 📦 Checking dependencies...
if not exist "node_modules\mongodb" (
    echo Installing MongoDB dependency...
    npm install mongodb
)

REM Run database seeding
echo 🌱 Seeding database...
npm run seed

echo.
echo ✅ Setup completed!
echo 🌐 You can now access:
echo    - Main site: http://localhost:3000
echo    - Admin login: http://localhost:3000/admin/login
echo.
echo 👑 Admin credentials: admin / admin123
echo 👤 Executive credentials: executive / exec123
echo.
echo ⚠️  IMPORTANT: Change these passwords after first login!
pause
