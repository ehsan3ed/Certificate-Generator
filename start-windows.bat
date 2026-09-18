@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set PORT=8765
set URL=http://127.0.0.1:%PORT%

echo.
echo  ========================================
echo   Certificate Studio - سازنده گواهینامه
echo  ========================================
echo.

where python >nul 2>&1
if %ERRORLEVEL%==0 (
  echo  [Python] سرور روی %URL%
  start "" "%URL%"
  python -m http.server %PORT%
  goto :eof
)

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  echo  [py launcher] سرور روی %URL%
  start "" "%URL%"
  py -3 -m http.server %PORT%
  goto :eof
)

where node >nul 2>&1
if %ERRORLEVEL%==0 (
  echo  [Node] سرور روی %URL%
  start "" "%URL%"
  npx --yes serve -l %PORT% .
  goto :eof
)

echo  خطا: Python یا Node.js پیدا نشد.
echo  یکی را نصب کنید، یا index.html را مستقیم در مرورگر باز کنید.
pause
