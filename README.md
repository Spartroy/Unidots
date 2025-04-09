# Unidots Digital Platform

A comprehensive digital workflow platform for Unidots, a flexography printing company. This system replaces paper-based workflows with a modern digital system that connects clients, designers, prepress employees, and managers.

## Core Features

### Multi-Portal System

- **Client Portal**: Submit orders, track status, view history, file claims
- **Employee Portal**: View assigned tasks, update order status, confirm prepress stages
- **Manager Portal**: Assign tasks, monitor progress, generate reports

### Key Features

#### For Clients
- Order submission with file uploads (AI/PDF/images)
- Real-time order tracking with progress visualization
- Order history and detailed viewing
- Claim submission system with photo evidence upload
- Cost calculation based on material, dimensions, and order type

#### For Employees
- Task dashboard showing assigned orders
- Prepress process tracking system
- Stage completion confirmation tools
- File viewing and management system

#### For Managers
- Comprehensive dashboard with real-time metrics
- Task assignment interface
- Order monitoring across all stages
- Analytics and reporting tools

### File Handling
- Support for high-resolution images and Illustrator files
- Efficient storage and transfer of large design files
- Preview generation for uploaded files
- Version control for design iterations

## Tech Stack

- **Frontend**: React.js with Tailwind CSS for styling
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT for secure role-based access

## Project Structure

### Backend

```
backend/
  ├── config/           # Configuration files
  │   └── db.js         # Database connection
  ├── controllers/      # Request handlers
  │   ├── userController.js
  │   ├── orderController.js
  │   ├── fileController.js
  │   ├── claimController.js
  │   ├── taskController.js
  │   └── reportController.js
  ├── middleware/       # Middleware functions
  │   ├── authMiddleware.js
  │   └── errorMiddleware.js
  ├── models/           # Database models
  │   ├── userModel.js
  │   ├── orderModel.js
  │   ├── fileModel.js
  │   ├── claimModel.js
  │   └── taskModel.js
  ├── routes/           # API routes
  │   ├── userRoutes.js
  │   ├── orderRoutes.js
  │   ├── fileRoutes.js
  │   ├── claimRoutes.js
  │   ├── taskRoutes.js
  │   └── reportRoutes.js
  └── server.js         # Entry point
```

### Frontend

```
frontend/
  ├── public/           # Static files
  └── src/
      ├── assets/       # Images, fonts, etc.
      ├── components/   # Reusable components
      │   ├── common/   # Shared components
      │   ├── client/   # Client-specific components
      │   ├── employee/ # Employee-specific components
      │   └── manager/  # Manager-specific components
      ├── context/      # React context
      ├── hooks/        # Custom hooks
      ├── pages/        # Page components
      │   ├── auth/     # Authentication pages
      │   ├── client/   # Client portal pages
      │   ├── employee/ # Employee portal pages
      │   └── manager/  # Manager portal pages
      ├── services/     # API services
      ├── utils/        # Utility functions
      ├── App.js        # Main component
      └── index.js      # Entry point
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install server dependencies:
   ```
   npm install
   ```
3. Install client dependencies:
   ```
   cd frontend
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Run the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users` - Register user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (managers only)
- `GET /api/users/:id` - Get user by ID (managers only)
- `PUT /api/users/:id` - Update user (managers only)
- `DELETE /api/users/:id` - Delete user (managers only)

### Orders
- `POST /api/orders` - Create order (clients only)
- `GET /api/orders` - Get all orders (filtered by role)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/status` - Update order status (staff only)
- `PUT /api/orders/:id/assign` - Assign order stage (managers only)
- `POST /api/orders/:id/cost` - Calculate order cost

### Files
- `POST /api/files` - Upload file
- `GET /api/files` - Get all files
- `GET /api/files/:id` - Get file by ID
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/:id/download` - Download file

### Claims
- `POST /api/claims` - Create claim (clients only)
- `GET /api/claims` - Get all claims (filtered by role)
- `GET /api/claims/:id` - Get claim by ID
- `PUT /api/claims/:id` - Update claim
- `PUT /api/claims/:id/status` - Update claim status (staff only)
- `PUT /api/claims/:id/assign` - Assign claim (managers only)

### Tasks
- `POST /api/tasks` - Create task (managers only)
- `GET /api/tasks` - Get all tasks (filtered by role)
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (managers only)
- `PUT /api/tasks/:id/complete` - Complete task (staff only)
- `PUT /api/tasks/:id/assign` - Assign task (managers only)

### Reports
- `GET /api/reports` - Get available reports (managers only)
- `POST /api/reports/orders` - Generate order report (managers only)
- `POST /api/reports/claims` - Generate claim report (managers only)
- `POST /api/reports/employees` - Generate employee performance report (managers only)
- `POST /api/reports/clients` - Generate client report (managers only)

## Future AI Integration

The system architecture is designed to accommodate a future AI module for halftone deformation detection in flexographic printing plates. This will be integrated into the prepress workflow to automatically detect and flag potential printing issues before production.