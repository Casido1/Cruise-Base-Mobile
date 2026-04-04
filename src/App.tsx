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

const ProfilePage = lazy(() => import('./pages/Profile'));
const MyFleetPage = lazy(() => import('./pages/MyFleet'));
const ContractCreationPage = lazy(() => import('./pages/ContractCreation'));
const NotificationsPage = lazy(() => import('./pages/Notifications'));
const VehicleDetails = lazy(() => import('./pages/VehicleDetails'));

const RouteLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
    <div className="relative flex items-center justify-center w-24 h-24">
       <div className="absolute w-full h-full border-2 border-blue-500/20 rounded-full animate-ping"></div>
       <div className="absolute w-[140%] h-[140%] border-2 border-emerald-500/10 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
       <div className="relative z-10 w-12 h-12 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-full animate-pulse shadow-[0_0_40px_rgba(59,130,246,0.5)]"></div>
    </div>
    <div className="flex flex-col items-center gap-2">
       <h2 className="text-xl font-black text-white tracking-widest uppercase">CruiseBase</h2>
       <div className="flex items-center gap-1.5 mt-1">
         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
       </div>
    </div>
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
              <Route path="/driver/vehicle/:id" element={<VehicleDetails />} />
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

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
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
