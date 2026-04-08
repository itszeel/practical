# Task Manager Dashboard

**Live Demo**: [https://task-management-z.vercel.app](https://task-management-z.vercel.app)

## Project Structure

```text
src/
├── components/
│   ├── auth/         # Login and Signup forms
│   ├── dashboard/    # Kanban Board, Task Table, Filters, Pagination
│   └── ui/           # Generic UI components
├── contexts/         # Global App State (TasksProvider)
├── pages/            # Top-level route components (Dashboard, Login, Signup)
└── schema/           # Form validation schemas
```

## Setup and Run Locally

1. **Clone the repository**:

   ```bash
   git clone https://github.com/itszeel/task-management.git
   cd task-management
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Access the application**: Open [http://localhost:5173](http://localhost:5173) in your browser.
