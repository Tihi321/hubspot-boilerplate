@echo off
rem   Run local-hubl-server using javaw

set HUBL_START=start
set HUBL_LAUNCH=javaw.exe

rem Only works in Win2K
call local-hubl-server %*

set HUBL_START=
set HUBL_LAUNCH=