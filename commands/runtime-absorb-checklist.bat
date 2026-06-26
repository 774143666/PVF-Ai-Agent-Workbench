@echo off
setlocal

for %%I in ("%~dp0..") do set "WORKBENCH_ROOT=%%~fI\"
call "%WORKBENCH_ROOT%core\pvf-agent-core\scripts\resolve-node.bat"
if errorlevel 1 (
  echo ERROR Node.js is required for runtime absorption checklist generation.
  exit /b 1
)

"%NODE_EXE%" "%WORKBENCH_ROOT%core\pvf-agent-core\scripts\runtime-absorb-checklist.js" --root "%WORKBENCH_ROOT%." %*
exit /b %ERRORLEVEL%
