@echo off
REM Script pour démarrer l'application complète (Backend + Frontend)
REM Usage: run-app.bat

echo.
echo ================================================
echo   Hub et Planificateur d'Événements du Campus
echo ================================================
echo.

setlocal enabledelayedexpansion
set PROJECT_PATH=C:\Users\SANAE PC\Downloads\Hub-et-Planificateur-Event-du-Campus

echo Changement répertoire: %PROJECT_PATH%
cd /d "%PROJECT_PATH%" || exit /b 1

echo.
echo [1/2] Démarrage du Backend Spring Boot (Port 8080)...
echo ================================================
start cmd /k "mvn spring-boot:run"

echo Attente de 10 secondes pour le démarrage du backend...
timeout /t 10 /nobreak

echo.
echo [2/2] Démarrage du Frontend Angular (Port 4200)...
echo ================================================
start cmd /k "npm start"

echo.
echo ================================================
echo Application démarrée !
echo.
echo Frontend : http://localhost:4200
echo Backend  : http://localhost:8080
echo Swagger  : http://localhost:8080/swagger-ui.html
echo ================================================
echo.
echo Appuyez sur n'importe quelle touche pour fermer cette fenêtre...
pause >nul
