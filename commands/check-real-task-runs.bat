@echo off
setlocal

for %%I in ("%~dp0..") do set "WORKBENCH_ROOT=%%~fI\"
call "%WORKBENCH_ROOT%core\pvf-agent-core\scripts\resolve-node.bat"
if errorlevel 1 (
  echo ERROR Node.js is required for check-real-task-runs.
  exit /b 1
)

"%NODE_EXE%" "%WORKBENCH_ROOT%core\pvf-agent-core\scripts\check-real-task-runs.js" --root "%WORKBENCH_ROOT%." %*
exit /b %ERRORLEVEL%
