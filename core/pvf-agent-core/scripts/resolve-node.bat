@echo off

if defined NODE_EXE (
  if exist "%NODE_EXE%" exit /b 0
)

if not defined WORKBENCH_ROOT (
  set "WORKBENCH_ROOT=%~dp0..\..\..\"
)

set "NODE_EXE=%WORKBENCH_ROOT%runtime\node\node.exe"
if exist "%NODE_EXE%" exit /b 0

for /f "delims=" %%N in ('where node 2^>nul') do (
  set "NODE_EXE=%%N"
  exit /b 0
)

echo ERROR Node.js runtime was not found.
echo Expected portable Node at "%WORKBENCH_ROOT%runtime\node\node.exe".
exit /b 1
