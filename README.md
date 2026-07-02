# phucCMS_Solution

A full-stack Content Management System (CMS) built with modern technologies.

## 🚀 Technologies Used

### Frontend (`cms.frontend`)
- **Framework:** React 19
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Build Tool:** Create React App (react-scripts)

### Backend (`CMS.Backend` & `CMS.Data`)
- **Framework:** .NET 8.0 (ASP.NET Core Web API / MVC)
- **Database ORM:** Entity Framework Core 8
- **Database Provider:** SQL Server
- **Authentication:** JWT Bearer & BCrypt
- **API Documentation:** Swagger (Swashbuckle.AspNetCore)

## 📁 Project Structure

```
phucCMS_Solution/
├── CMS.Backend/       # ASP.NET Core Web API / Controllers / Views
├── CMS.Data/          # Entity Framework Core Data Models & DbContext
├── cms.frontend/      # React Frontend Application
└── phucCMS_Solution.sln # Visual Studio Solution File
```

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (for frontend)
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (for backend)
- SQL Server

### Backend Setup
1. Open the solution file `phucCMS_Solution.sln` in Visual Studio or your preferred IDE.
2. Ensure your database connection string is properly configured in `CMS.Backend/appsettings.json`.
3. Apply database migrations to set up the SQL Server database.
   ```bash
   dotnet ef database update --project CMS.Data --startup-project CMS.Backend
   ```
4. Run the `CMS.Backend` project. This will start the API server (and Swagger UI if in development mode).

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd cms.frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `cms.frontend` directory and configure the base URL for the API (if necessary).
4. Start the development server:
   ```bash
   npm start
   ```

## 📝 License

This project is created by VoHongPhuc (Student ID: 2123110010).
