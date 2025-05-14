@echo off
TITLE Ambient Server - Ambient

cd webroot/product/testtide
node --max-old-space-size=8096 --expose-gc server.js 
pause
