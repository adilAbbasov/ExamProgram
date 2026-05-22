# Exam Program

School exam management application. Register lessons, students, and exam results, all in Azerbaijani.

## Tech stack

- **Backend**: ASP.NET Core 8 Web API + EF Core
- **Frontend**: Angular 21 + Angular Material
- **Database**: Microsoft SQL Server (LocalDB)

## Project structure

```
ExamProgram/
├── Database/          SQL scripts (schema + sample data)
├── ExamProgram.Api/   ASP.NET Core Web API
└── ExamProgram.Web/   Angular client
```

## Setup

### 1. Database

Run the SQL scripts against your local SQL Server instance:

```bash
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -i Database/ExamProgram.sql
sqlcmd -S "(localdb)\MSSQLLocalDB" -E -i Database/SampleData.sql -f 65001
```

The `-f 65001` flag tells sqlcmd to read the file as UTF-8 so Azerbaijani characters are stored correctly.

If you're using a different SQL Server instance, update the connection string in `ExamProgram.Api/appsettings.json`.

### 2. Backend

```bash
cd ExamProgram.Api
dotnet restore
dotnet run --urls "http://localhost:5000"
```

API will be available at `http://localhost:5000/api` with Swagger at `http://localhost:5000/swagger`.

### 3. Frontend

```bash
cd ExamProgram.Web
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

## Features

- CRUD for Dərslər (Lessons), Şagirdlər (Students), İmtahanlar (Exams)
- Search and column sorting with Azerbaijani locale-aware comparison
- Pagination
- Material Design 3 theme with custom Azerbaijani date picker
- Cascade delete: removing a lesson or student also removes related exam records

## Requirements

- .NET 8 SDK
- Node.js 22+ and npm
- Angular CLI 21+
- SQL Server (LocalDB or full instance)
