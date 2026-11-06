@echo off
echo ========================================================
echo   Subiendo Aura Salon a GitHub (MartinSilva2603/peluqueria)
echo ========================================================
echo.

echo [1/4] Inicializando repositorio Git...
git init

echo.
echo [2/4] Vinculando con tu repositorio en GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/MartinSilva2603/peluqueria.git

echo.
echo [3/4] Agregando archivos del proyecto...
git add .
git commit -m "Aura Salon - Codigo y Workflow APK"

echo.
echo [4/4] Subiendo a GitHub (rama main)...
git branch -M main
git push -u origin main --force

echo.
echo ========================================================
echo   Listo! Proyecto subido con exito a GitHub.
echo   Ve a tu navegador en:
echo   https://github.com/MartinSilva2603/peluqueria/actions
echo   para ver la compilacion del APK.
echo ========================================================
pause
