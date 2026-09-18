$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$port = 8765
$url = "http://127.0.0.1:$port"

Write-Host ""
Write-Host "  Certificate Studio — سازنده گواهینامه" -ForegroundColor Cyan
Write-Host "  $url" -ForegroundColor Yellow
Write-Host ""

function Start-Browser {
  Start-Process $url
}

if (Get-Command python -ErrorAction SilentlyContinue) {
  Start-Browser
  python -m http.server $port
  exit 0
}
if (Get-Command py -ErrorAction SilentlyContinue) {
  Start-Browser
  py -3 -m http.server $port
  exit 0
}
if (Get-Command node -ErrorAction SilentlyContinue) {
  Start-Browser
  npx --yes serve -l $port .
  exit 0
}

Write-Host "Python یا Node.js نصب نیست. index.html را مستقیم باز کنید." -ForegroundColor Red
Start-Process (Join-Path $PSScriptRoot "index.html")
