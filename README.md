# Склад Техники (66bit-intership)

Это корпоративная система учёта техники, разработанная в рамках тестового задания / стажировки в 66bit.
Проект доступен по ссылке: [https://for66bit.ru:2053](https://for66bit.ru:2053)
Развернут на личном слабом вирутальном сервере  

---

## Архитектура проекта

Проект представляет собой современное SPA-приложение с клиент-серверной архитектурой.
### 1. Frontend
*   **Технологии:** React 18, TypeScript, Vite.
*   **Стилизация:** Material-UI (MUI).
### 2. Backend
*   **Технологии:** C#, ASP.NET Core 9.0 Web API.
*   **База данных:** PostgreSQL + Entity Framework Core.

### 3. Деплой (CI/CD)
Приложение контейнеризировано с помощью Docker.

*   **Docker Compose:** Три сервиса: db, backend и frontend.
*   **Nginx:** Работает как reverse-proxy на сервере (VPS). Перехватывает HTTPS трафик на порту 2053, отдаёт статику Frontend'а и проксирует /api на Backend внутри Docker.
*   **SSL:** Настроен бесплатный сертификат от Let's Encrypt.
*   **CI/CD:** Настроен GitHub Actions (`.github/workflows/deploy.yml`). При каждом пуше в ветку `main`, GitHub автоматически подключается к VPS по SSH, скачивает новую версию кода и перезапускает Docker-контейнеры. Ручной деплой больше не требуется.

---

### Как запустить локально:
1. Просто дважды кликните по файлу `compose up.bat` в корне проекта (внутри docker-compose -f "docker-compose.yml" up --build).
2. Доступно по адресу `http://localhost:5173` (Frontend) и `http://localhost:5020/swagger/index.html` (Backend).

Чтобы остановить локальный сервер, просто закройте окно командной строки, в котором работает скрипт, или выполните `docker-compose down`.
