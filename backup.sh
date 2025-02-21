#!/bin/sh
# backup.sh - 定期备份 SQL Server 数据库

# 配置变量
CONTAINER_NAME="sqlserver-container"
DB_NAME="StudentAttendanceSystem"
BACKUP_DIR="/var/opt/mssql/backup"   # 与 Docker Compose 中挂载的目录一致
SA_PASSWORD="yourStrong(!)Password"

# 生成当前时间戳，构造备份文件名
TIMESTAMP=$(date +"%Y%m%d%H%M")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.bak"

echo "[$(date +"%Y-%m-%d %H:%M:%S")] 开始备份数据库 ${DB_NAME}..."

# 执行备份命令
docker exec "${CONTAINER_NAME}" /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "${SA_PASSWORD}" \
  -Q "BACKUP DATABASE [${DB_NAME}] TO DISK='${BACKUP_FILE}' WITH FORMAT, MEDIANAME='SQLServerBackups', NAME='Full Backup of ${DB_NAME}';"

if [ $? -eq 0 ]; then
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] 备份成功：${BACKUP_FILE}"
else
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] 备份失败！"
fi
