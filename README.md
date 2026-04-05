# Finance Data Processing and Access Control Backend

This is a backend project for a Finance Dashboard system, featuring User Role Management, Financial Records processing, Dashboard Aggregation APIs, and Role-Based Access Control (RBAC).

## Technology Stack
- **Language / Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (in-memory/file storage via `sqlite3` and `sqlite`)
- **Authentication:** Mocked JSON Web Token (JWT) using `jsonwebtoken`
- **Validation:** `express-validator`

## Access Control Matrix
| User Role | View Dashboard | View Records | Create Records | Update/Delete Records | Manage Users |
| --------- | :------------: | :----------: | :------------: | :-------------------: | :----------: |
| Viewer    | ✅             | ❌           | ❌             | ❌                    | ❌           |
| Analyst   | ✅             | ✅           | ❌             | ❌                    | ❌           |
| Admin     | ✅             | ✅           | ✅             | ✅                    | ✅           |

## Installation & Setup

1. Make sure you have [Node.js](https://nodejs.org/) installed.
2. In the project directory, run:
   ```bash
   npm install
   ```
3. Start the server (runs on port 3000 by default):
   ```bash
   node src/server.js
   ```

*The database initializes automatically in `./database.sqlite` when the server starts. Pre-configured users are added for convenience.*

## Pre-configured Test Users
You can log in with any of these users to test the roles:
- **Admin**: `username`: admin, `password`: admin123
- **Analyst**: `username`: analyst, `password`: analyst123
- **Viewer**: `username`: viewer, `password`: viewer123

## API Walkthrough

### Authentication
**Endpoint:** `POST /api/auth/login`
```json
{
  "username": "admin",
  "password": "admin123"
}
```
*Response will contain a `token` to be used in the `Authorization: Bearer <token>` header for subsequent requests.*

### User Management (Admin Only)
- **Get Users:** `GET /api/users`
- **Create User:** `POST /api/users`
  ```json
  { "username": "newanalyst", "password": "password123", "role": "Analyst" }
  ```
- **Update User:** `PUT /api/users/:id` (roles, status)
- **Delete User:** `DELETE /api/users/:id`

### Financial Records
- **Get Records:** `GET /api/records` (Analyst, Admin) 
  *Supports filtering via query params: `?type=income&category=Salary&startDate=2024-01-01`*
- **Create Record:** `POST /api/records` (Admin)
  ```json
  { "amount": 1500, "type": "income", "category": "Salary", "date": "2024-04-01", "notes": "Monthly salary" }
  ```
- **Update Record:** `PUT /api/records/:id` (Admin)
- **Delete Record:** `DELETE /api/records/:id` (Admin)

### Dashboard Summaries
- **Get Summary:** `GET /api/dashboard/summary` (Viewer, Analyst, Admin)
  *Returns total income, total expenses, net balance*
- **Get Category Totals:** `GET /api/dashboard/category-totals` (Viewer, Analyst, Admin)
