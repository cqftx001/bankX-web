import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { AccountListPage } from '../pages/AccountListPage';
import { TransactionListPage } from '../pages/TransactionListPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminUserListPage } from '../pages/AdminUserListPage';
import { AdminAccountListPage } from '../pages/AdminAccountListPage';
import { AdminAuditLogPage } from '../pages/AdminAuditLogPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (no layout) */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        {/* Customer domain routes */}
        <Route element={ <ProtectedRoute><MainLayout /></ProtectedRoute> }>
          <Route path="/app/dashboard"    element={<DashboardPage />} />
          <Route path="/app/accounts"     element={<AccountListPage />} />
          <Route path="/app/transactions" element={<TransactionListPage />} />
          <Route path="/app/profile"      element={<ProfilePage />} />
        </Route>

        {/* Admin domain routes */}
        <Route element={<ProtectedRoute requiredAuthorities={['USER:READ_ALL', 'AUDIT_LOG:READ']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin/dashboard"     element={<AdminDashboardPage />} />
          <Route path="/admin/users"         element={<AdminUserListPage />} />
          <Route path="/admin/accounts"      element={<AdminAccountListPage />} />
          <Route path="/admin/audit-logs"    element={<AdminAuditLogPage />} />
        </Route>

        {/* Error pages (no layout, no auth required) */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/accounts" element={<Navigate to="/app/accounts" replace />} />
        <Route path="/transactions" element={<Navigate to="/app/transactions" replace />} />
        <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
