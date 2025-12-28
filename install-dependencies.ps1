# PowerShell script to install all Node.js dependencies

Write-Host "Installing Node.js dependencies..." -ForegroundColor Green

# Check if dependencies.txt exists
if (-Not (Test-Path "dependencies.txt")) {
    Write-Host "Error: dependencies.txt file not found!" -ForegroundColor Red
    exit 1
}

# Read dependencies from file
$dependencies = Get-Content "dependencies.txt" | Where-Object { $_.Trim() -ne "" -and -not $_.StartsWith("#") }

if ($dependencies.Count -eq 0) {
    Write-Host "No dependencies found in dependencies.txt" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($dependencies.Count) dependencies to install:" -ForegroundColor Cyan
$dependencies | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }

# Create npm install command
$installCommand = "npm install " + ($dependencies -join " ")

Write-Host "`nExecuting: $installCommand" -ForegroundColor Yellow

# Execute the installation
try {
    Invoke-Expression $installCommand
    Write-Host "`nAll dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "`nError during installation: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Optional: Display installed packages
Write-Host "`nVerifying installation..." -ForegroundColor Cyan
npm list --depth=0