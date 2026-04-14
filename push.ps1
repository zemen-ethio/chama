# This tells the script to look at the folder it is currently sitting in
$currentDir = $PSScriptRoot
Set-Location -Path $currentDir

Write-Host "--- Initializing Sync from: $currentDir ---" -ForegroundColor Magent

# 1. Pull any remote changes (prevents conflicts)
Write-Host "Checking for remote updates..." -ForegroundColor Yellow
git pull origin main

# 2. Stage all local changes
Write-Host "Staging files..." -ForegroundColor Yellow
git add .

# 3. Create commit with date/time
$dt = Get-Date -Format "dd-MMM-yyyy HH:mm"
$msg = "Update: $dt"
Write-Host "Committing: $msg" -ForegroundColor Cyan
git commit -m $msg

# 4. Push to zemen-ethio/chama
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push origin main

Write-Host "--- Successfully Synced! ---" -ForegroundColor Green
Start-Sleep -Seconds 3