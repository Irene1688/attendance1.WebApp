$serverInstance = "127.0.0.1,1434"  # SQL Server instance name
$databaseName = "StudentAttendanceSystem"  # db name
$username = "sa"  # SQL Server Authentication username
$password = "yourStrong(!)Password"  # SQL Server Authentication password
$backupFolder = "C:\Users\Student\source\repos\IreneFYP\DbBackup"
$daysToKeep = 3  # days to keep backup
$backupInterval = 1  # interval day-range to execute backup
$logFile = "C:\Users\Student\source\repos\IreneFYP\DbBackup\backup_log.txt"  # log path

# Using SQL Server Authentication for the connection
$connectionString = "Server=$serverInstance;Database=$databaseName;User Id=$username;Password=$password;"

# function for write the log to logbook and powershell
function Write-Log {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "$timestamp - $message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

# check path is exist
if (!(Test-Path -Path $backupFolder)) {
    New-Item -ItemType Directory -Force -Path $backupFolder
}

# check previous backup date
$lastBackupFile = Get-ChildItem -Path $backupFolder -Filter "*.bak" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($lastBackupFile) {
    $hoursSinceLastBackup = (Get-Date) - $lastBackupFile.LastWriteTime
    if ($hoursSinceLastBackup.TotalHours -lt ($backupInterval * 24)) {
        $shouldBackup = $false
        Write-Log "Latest backup is executed $([math]::floor($hoursSinceLastBackup.TotalHours)) hours ago. No need to backup today."
    } else {
        $shouldBackup = $true
        Write-Log "Latest backup is executed $([math]::floor($hoursSinceLastBackup.TotalHours)) hours ago. Today will execute backup."
    }
} else {
    $shouldBackup = $true
    Write-Log "No previous backup found. A backup will be created today."
}


if ($shouldBackup) {
    # generate filename with date
    $backupFile = "$databaseName`_$(Get-Date -Format 'yyyyMMdd').bak"

    # execute database backup
    $query = "BACKUP DATABASE [$databaseName] TO DISK = N'/var/opt/mssql/backups/$backupFile' WITH NOFORMAT, INIT, NAME = N'$databaseName-Full Database Backup', SKIP, NOREWIND, NOUNLOAD, STATS = 10"
    Invoke-Sqlcmd -ServerInstance $serverInstance -Query $query -Username "sa" -Password "yourStrong(!)Password"

    Write-Log "Complete backup：$backupFile"

    # delete the old backup files that over 3 days
    Get-ChildItem -Path $backupFolder -Filter "*.bak" | Where-Object {
        $_.LastWriteTime -lt (Get-Date).AddDays(-$daysToKeep)
    } | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Log "Delete the old backup file：$($_.Name)"
    }

    Write-Log "Completed backup task. Cleared old backup file."
} else {
    Write-Log "No need to backup today."
}