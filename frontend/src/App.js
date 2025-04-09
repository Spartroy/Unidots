import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Context Provider
import { AuthProvider } from './context/AuthContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Client Portal Pages
import ClientDashboard from './pages/client/Dashboard';
import ClientOrders from './pages/client/Orders';
import ClientOrderDetail from './pages/client/OrderDetail';
import ClientNewOrder from './pages/client/NewOrder';
import ClientClaims from './pages/client/Claims';
import ClientClaimDetail from './pages/client/ClaimDetail';
import ClientNewClaim from './pages/client/NewClaim';
import ClientProfile from './pages/client/Profile';

// Employee Portal Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeTasks from './pages/employee/Tasks';
import EmployeeTaskDetail from './pages/employee/TaskDetail';
import EmployeeOrders from './pages/employee/Orders';
import EmployeeOrderDetail from './pages/employee/OrderDetail';
import EmployeeClaims from './pages/employee/Claims';
import EmployeeClaimDetail from './pages/employee/ClaimDetail';
import EmployeeProfile from './pages/employee/Profile';

// Manager Portal Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerOrders from './pages/manager/Orders';
import ManagerOrderDetail from './pages/manager/OrderDetail';
import ManagerClaims from './pages/manager/Claims';
import ManagerClaimDetail from './pages/manager/ClaimDetail';
import ManagerTasks from './pages/manager/Tasks';
import ManagerTaskDetail from './pages/manager/TaskDetail';
import ManagerEmployees from './pages/manager/Employees';
import ManagerEmployeeDetail from './pages/manager/EmployeeDetail';
import ManagerClients from './pages/manager/Clients';
import ManagerClientDetail from './pages/manager/ClientDetail';
import ManagerReports from './pages/manager/Reports';
import ManagerProfile from './pages/manager/Profile';

// Layouts
import ClientLayout from './components/layouts/ClientLayout';
import EmployeeLayout from './components/layouts/EmployeeLayout';
import ManagerLayout from './components/layouts/ManagerLayout';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client Portal Routes */}
        <Route path="/client" element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ClientDashboard />} />
          <Route path="orders" element={<ClientOrders />} />
          <Route path="orders/:id" element={<ClientOrderDetail />} />
          <Route path="orders/new" element={<ClientNewOrder />} />
          <Route path="claims" element={<ClientClaims />} />
          <Route path="claims/:id" element={<ClientClaimDetail />} />
          <Route path="claims/new" element={<ClientNewClaim />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* Employee Portal Routes */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeLayout />
          </ProtectedRoute>
        }>
          <Route index element={<EmployeeDashboard />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="tasks/:id" element={<EmployeeTaskDetail />} />
          <Route path="orders" element={<EmployeeOrders />} />
          <Route path="orders/:id" element={<EmployeeOrderDetail />} />
          <Route path="claims" element={<EmployeeClaims />} />
          <Route path="claims/:id" element={<EmployeeClaimDetail />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        {/* Manager Portal Routes */}
        <Route path="/manager" element={
          <ProtectedRoute allowedRoles={['manager', 'admin']}>
            <ManagerLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ManagerDashboard />} />
          <Route path="orders" element={<ManagerOrders />} />
          <Route path="orders/:id" element={<ManagerOrderDetail />} />
          <Route path="claims" element={<ManagerClaims />} />
          <Route path="claims/:id" element={<ManagerClaimDetail />} />
          <Route path="tasks" element={<ManagerTasks />} />
          <Route path="tasks/:id" element={<ManagerTaskDetail />} />
          <Route path="employees" element={<ManagerEmployees />} />
          <Route path="employees/:id" element={<ManagerEmployeeDetail />} />
          <Route path="clients" element={<ManagerClients />} />
          <Route path="clients/:id" element={<ManagerClientDetail />} />
          <Route path="reports" element={<ManagerReports />} />
          <Route path="profile" element={<ManagerProfile />} />
        </Route>

        {/* Redirect root to appropriate dashboard based on role */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  );
}

export default App;