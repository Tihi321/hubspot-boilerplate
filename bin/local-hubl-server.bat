@echo off

rem   =====================================================
rem   Environment variables that can be defined externally:
rem
rem   HUBL_BIN - bin directory (must end in \)
rem   HUBL_LAUNCH - java.exe (default) or javaw.exe
rem   JVM_ARGS - additional java options, e.g. -Dprop=val
rem   HUBL_START - set this to "start" to launch in a separate window
rem              this is used by the local-hubl-serverw.cmd script.
rem
rem   =====================================================

setlocal

rem Minimal version to run
set MINIMAL_VERSION=8

for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    rem @echo Debug Output: %%g
    set JAVAVER=%%g
)
if not defined JAVAVER (
    @echo Not able to find Java executable or version. Please check your Java installation.
    set ERRORLEVEL=2
    goto pause
)
set JAVAVER=%JAVAVER:"=%
for /f "delims=. tokens=1-3" %%v in ("%JAVAVER%") do (
    set current_version=%%w
)

for /f "delims=. tokens=1-2" %%v in ("%JAVAVER%") do (
    set current_major=%%w
)

if 1 LSS %current_major% (
    set current_version=%current_major%
)

if not defined current_version (
    @echo Not able to find Java executable or version. Please check your Java installation.
    set ERRORLEVEL=2
    goto pause
)
rem @echo Debug: CURRENT=%current_version% - MINIMAL=%MINIMAL_VERSION%
if %current_version% LSS %MINIMAL_VERSION% (
    @echo Error: Java version -- %JAVAVER% -- is too low to run. Needs a Java version greater than or equal to %MINIMAL_VERSION%
    set ERRORLEVEL=3
    goto pause
)

if .%HUBL_LAUNCH% == . set HUBL_LAUNCH=java.exe

if exist local-hubl-server.bat goto winNT1
if .%HUBL_HOME% == . set HUBL_HOME=%~dp0

:winNT1
rem On NT/2K grab all arguments at once

rem See the unix startup file for the rationale of the following parameters,
rem including some tuning recommendations
set HEAP=-Xmx1g

rem Server mode
rem Collect the settings defined above
set ARGS=%HEAP%

pushd "%~dp0"\..
%HUBL_START% %HUBL_LAUNCH% -classpath "lib\*" com.hubspot.content.hubl.dev.LocalHubLDevService server "conf\config.yaml"

rem If the errorlevel is not zero, then display it and pause

if NOT errorlevel 0 goto pause
if errorlevel 1 goto pause

goto end

:pause
echo errorlevel=%ERRORLEVEL%
pause

:end
