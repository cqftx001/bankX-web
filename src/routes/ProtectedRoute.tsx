import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
    /** Children to render when access is granted */
    children: ReactNode;
    /** Optional: required role(s). If specified, user must have at least one. */
    requiredRoles?: string[];
    /** Optional: required authority(s). If specified, user must have at least one. */
    requiredAuthorities?: string[];
  }

/**
 * Wraps routes that require authentication.
 *
 * Behavior:
 *   - Not authenticated → redirect to /login (preserving intended destination)
 *   - Authenticated but missing required role → redirect to /403
 *   - Otherwise → render children
 *
 * Usage:
 *   <ProtectedRoute><DashboardPage /></ProtectedRoute>
 *   <ProtectedRoute requiredRoles={['ROLE_ADMIN']}><AdminPage /></ProtectedRoute>
 */
export function ProtectedRoute({ children, requiredRoles, requiredAuthorities }: ProtectedRouteProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const hasRole = useAuthStore((state) => state.hasRole);
    const hasAuthority = useAuthStore((state) => state.hasAuthority);
    const location = useLocation();
  
    // Not logged in → redirect to login, remembering where the user wanted to go
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    // Logged in but missing required role
    if (requiredRoles && !requiredRoles.some((role) => hasRole(role))) {
      return <Navigate to="/403" replace />;
    }

    if (requiredAuthorities && !requiredAuthorities.some((authority) => hasAuthority(authority))) {
      return <Navigate to="/403" replace />;
    }
  
    return <>{children}</>;
  }
