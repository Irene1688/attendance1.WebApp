# 1. 使用 Node.js 作为构建环境
FROM node:18 AS build

# 2. 设置工作目录
WORKDIR /app

# 3. 复制 package.json 和 package-lock.json
COPY package*.json ./

# 4. 安装依赖
RUN npm install

# 5. 复制项目文件
COPY . .

# 6. 构建 Vite 应用
RUN npm run build

# 7. 使用 Nginx 作为生产环境服务器
FROM nginx:latest

# 8. 复制构建的前端文件到 Nginx 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 9. 复制自定义的 nginx.conf 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 10. 暴露 Nginx 默认的端口（80）
EXPOSE 80

# 11. 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
