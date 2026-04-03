import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/Login';
import { Loader2 } from 'lucide-react';

// Optimized route-level code splitting
const RegisterPage = lazy(() => import('./pages/Register').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPasswordPage })));
const EmailVerificationPage = lazy(() => import('./pages/EmailVerification').then(m => ({ default: m.EmailVerificationPage })));
const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'));
const CompanyList = lazy(() => import('./pages/CompanyList'));
const WalletPage = lazy(() => import('./pages/Wallet'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const MyFleetPage = lazy(() => import('./pages/MyFleet'));
const ContractCreationPage = lazy(() => import('./pages/ContractCreation'));

const RouteLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading View...</p>
  </div>
);

function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Driver Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Driver']} />}>
              <Route path="/driver" element={<DriverDashboard />} />
              <Route path="/driver/vehicle" element={<MyFleetPage />} />
            </Route>

            {/* Owner Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Owner']} />}>
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/fleet" element={<MyFleetPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/vehicles" element={<MyFleetPage />} />
              <Route path="/admin/contracts/create" element={<ContractCreationPage />} />
            </Route>

            {/* SuperAdmin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SuperAdmin']} />}>
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
              <Route path="/superadmin/companies" element={<CompanyList />} />
              <Route path="/superadmin/vehicles" element={<MyFleetPage />} />
            </Route>

            {/* Shared Protected Routes */}
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/unauthorized" element={<div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest">Unauthorized Access</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
