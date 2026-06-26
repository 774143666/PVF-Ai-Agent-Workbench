@echo off
setlocal
set "WORKBENCH_ROOT=%~dp0"
call "%WORKBENCH_ROOT%core\pvf-agent-core\scripts\resolve-node.bat"
if errorlevel 1 exit /b 1
"%NODE_EXE%" "%WORKBENCH_ROOT%core\pvf-agent-core\scripts\workbench.js" --root "%WORKBENCH_ROOT%." %*
exit /b %ERRORLEVEL%
