@echo off
setlocal EnableDelayedExpansion

rem -------------------------------
rem 配置参数
rem -------------------------------
set CONTAINER_NAME=sqlserver-container
set DB_NAME=StudentAttendanceSystem
rem 备份存放目录（确保该目录已挂载到容器内的备份卷，同时在 Windows 上可访问）
set BACKUP_DIR=C:\Users\Irene\source\repos\attendance1.WebApp.BackUp\DbBackUp
set SA_PASSWORD=yourStrong(!)Password

rem -------------------------------
rem 检查备份目录中是否存在 .bak 文件
rem -------------------------------
if not exist "%BACKUP_DIR%\*.bak" (
    echo Did not find backup file, start to back up...
    set NEED_BACKUP=1
) else (
    rem 利用 PowerShell 获取最新备份文件距当前的时间差（小时）
    for /f "delims=" %%A in ('powershell -NoProfile -Command "if ((Get-ChildItem '%BACKUP_DIR%\*.bak' | Sort-Object LastWriteTime -Descending | Select-Object -First 1) -ne $null) { [int]((New-TimeSpan -Start ((Get-ChildItem '%BACKUP_DIR%\*.bak' | Sort-Object LastWriteTime -Descending | Select-Object -First 1).LastWriteTime) -End (Get-Date)).TotalHours } else { 999 }"') do set HOURS_DIFF=%%A
    echo Last backup is !HOURS_DIFF! hours before.
    if !HOURS_DIFF! GEQ 24 (
        set NEED_BACKUP=1
    ) else (
        set NEED_BACKUP=0
    )
)

if %NEED_BACKUP%==0 (
    echo backup havent exceed 24 hours, no need to backup.
    goto :EOF
)

rem -------------------------------
rem 生成当前时间戳作为备份文件名的一部分
rem 采用 WMIC 获取格式化的当前日期时间（格式：YYYYMMDDHHMMSS），此处取前12位（YYYYMMDDHHMM）
rem -------------------------------
for /f "tokens=2 delims==." %%I in ('wmic os get localdatetime /value ^| find "="') do set LDT=%%I
set TIMESTAMP=%LDT:~0,12%

set BACKUP_FILE=%BACKUP_DIR%\%DB_NAME%_%TIMESTAMP%.bak

echo [%DATE% %TIME%] Start to backup database %DB_NAME%...
docker exec %CONTAINER_NAME% /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P %SA_PASSWORD% -Q "BACKUP DATABASE [%DB_NAME%] TO DISK='%BACKUP_FILE%' WITH FORMAT, MEDIANAME='SQLServerBackups', NAME='Full Backup of %DB_NAME%';"

if %ERRORLEVEL%==0 (
    echo [%DATE% %TIME%] Successfully backup：%BACKUP_FILE%
) else (
    echo [%DATE% %TIME%] Failed to backup!
)

endlocal
