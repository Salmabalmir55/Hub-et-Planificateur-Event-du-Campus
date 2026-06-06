# Script PowerShell pour démarrer l'application complète
# Usage: .\run-app.ps1

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Hub et Planificateur d'Événements du Campus" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectPath = "C:\Users\SANAE PC\Downloads\Hub-et-Planificateur-Event-du-Campus"

Write-Host "Changement répertoire: $ProjectPath"
Set-Location $ProjectPath

Write-Host ""
Write-Host "[1/2] Démarrage du Backend Spring Boot (Port 8080)..." -ForegroundColor Yellow
Write-Host "================================================"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

Write-Host "Attente de 10 secondes pour le démarrage du backend..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "[2/2] Démarrage du Frontend Angular (Port 4200)..." -ForegroundColor Yellow
Write-Host "================================================"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "Application démarrée !" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend : http://localhost:4200" -ForegroundColor Cyan
Write-Host "Backend  : http://localhost:8080" -ForegroundColor Cyan
Write-Host "Swagger  : http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
