@echo off
title npm run
:home
cls
echo.
echo ┌──────────────────┐
echo │  1. 운영모드 - 빌드                │
echo │  2. 운영모드 - 시작                │
echo │  3. 개발모드                       │
echo │  4. 종료                           │
echo └──────────────────┘

set /p s=모드 선택:
if %s%==1 goto product_build
if %s%==2 goto product_start
if %s%==3 goto development
if %s%==4 goto exit

:product_build
cls
npm run build
pause

:product_start
cls
npm run start
pause

:development
cls
npm run development
pause
