@echo off
setlocal
for %%I in ("%~dp0..") do set "WORKBENCH_ROOT=%%~fI\"
call "%WORKBENCH_ROOT%core\pvf-agent-core\scripts\resolve-node.bat"
if errorlevel 1 exit /b 1
"%NODE_EXE%" "%WORKBENCH_ROOT%core\pvf-agent-core\scripts\portable-cold-start-dry-run.js" --root "%WORKBENCH_ROOT%." %*
exit /b %ERRORLEVEL%
