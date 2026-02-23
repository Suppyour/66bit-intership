FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "WebAPI/WebAPI.csproj"
RUN dotnet build "WebAPI/WebAPI.csproj" -c Release -o /app/build
RUN dotnet publish "WebAPI/WebAPI.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
EXPOSE 5020
ENV ASPNETCORE_URLS=http://+:5020
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WebAPI.dll"]
