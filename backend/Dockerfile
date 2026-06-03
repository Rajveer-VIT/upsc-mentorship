# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY . .

# Restore dependencies
RUN dotnet restore src/Api/Api.csproj

# Publish the app
RUN dotnet publish src/Api/Api.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Expose port (Render uses 10000 or dynamic PORT)
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Run the app
ENTRYPOINT ["dotnet", "Api.dll"]
