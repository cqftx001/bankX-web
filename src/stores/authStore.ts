import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenStorage } from '../api/client';

/**
 * Authenticated user info stored in the auth state.
 * This is a subset of AuthResponse — only what the UI needs to display.
 */
export interface AuthUser {
  userId: string;
  email: string;
  roles: string[];
  authorities: string[];
}

/**
 * Auth store shape: state + actions.
 *
 * Convention: actions are co-located with state on the same object.
 * Pure read-only properties go above; mutating functions go below.
 */
interface AuthState {
  // ─── State ─────────────────────────────
  user: AuthUser | null;
  isAuthenticated: boolean;

  // ─── Actions ───────────────────────────
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  hasRole: (role: string) => boolean;
  hasAuthority: (authority: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // initial state
      user: null,
      isAuthenticated: false,

      // login or register success
      setAuth: (user, token) => {
        tokenStorage.set(token);
        set({ user, isAuthenticated: true });
      },

      // logout or 401
      clearAuth: () => {
        tokenStorage.clear();
        set({ user: null, isAuthenticated: false });
      },

      // role check helper for UI gating
      // (e.g. only show admin menu if user has ROLE_ADMIN)
      hasRole: (role) => {
        const user = get().user;
        return user?.roles.includes(role) ?? false;
      },
      hasAuthority: (authority) => {
        const user = get().user;
        return user?.authorities.includes(authority) ?? false;
      },
    }),
    {
      name: 'bankx-auth',                                // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      // ↑ only persist user + isAuthenticated, not the methods
    }
  )
);
