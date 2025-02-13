# 使用官方 .NET 运行时镜像作为基础镜像（生产环境）
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

# 使用 .NET SDK 镜像作为构建环境
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 在 Dockerfile 中设置 ASPNETCORE_URLS 环境变量
ENV ASPNETCORE_URLS="http://0.0.0.0:5000"

# 复制整个解决方案并还原依赖
COPY ["attendance1.WebApi/attendance1.WebApi.csproj", "attendance1.WebApi/"]
COPY ["attendance1.Application/attendance1.Application.csproj", "attendance1.Application/"]
COPY ["attendance1.Infrastructure/attendance1.Infrastructure.csproj", "attendance1.Infrastructure/"]
COPY ["attendance1.Domain/attendance1.Domain.csproj", "attendance1.Domain/"]
RUN dotnet restore "attendance1.WebApi/attendance1.WebApi.csproj"

# 复制所有项目代码并构建应用
COPY . .
WORKDIR "/src/attendance1.WebApi"
RUN dotnet publish -c Release -o /app/publish

# 运行最终的应用
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "attendance1.WebApi.dll"]
