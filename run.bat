@echo off
title npm run
:home
cls
echo.
echo ����������������������������������������
echo ��  1. ���� - ����                ��
echo ��  2. ���� - ����                ��
echo ��  3. ���߸��                       ��
echo ��  4. ����                           ��
echo ����������������������������������������

set /p s=��� ����:
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
