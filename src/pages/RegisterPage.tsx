import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, sendVerification } from '../api/auth';
import { useAuthStore } from '../stores/authStore';
import { BackendError } from '../api/client';
import { parseAuthClaims } from '../utils/authClaims';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'verify'>('email');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSendCode = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await sendVerification(email);
            setStep('verify');
        } catch(e) {
            setError(e instanceof BackendError ? e.message : 'Failed to send code');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const auth = await register(
                {
                    username: `user_${Date.now()}`,
                    email,
                    password: 'Test12345!',
                    firstName: 'Demo',
                    lastName: 'User',
                    phone: '+12025551234',
                    dateOfBirth: '1990-01-01',
                    addressLine1: '123 Demo St',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90001',
                    country: 'US',
                    code,
            });
            const claims = parseAuthClaims(auth.roles);
            setAuth(
                {
                    userId: auth.userId,
                    email: auth.email,
                    roles: claims.roles,
                    authorities: claims.authorities,
                },
                auth.accessToken
            );
            navigate('/app/dashboard', { replace: true});
        } catch (e) {
            setError(e instanceof BackendError ? e.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 40, maxWidth: 400, margin: '0 auto' }}>
          <h1>Register (Quick Test)</h1>
          <p style={{ color: '#666', fontSize: 14 }}>
            ⚠️ This is a placeholder form. Real registration form coming in F7.
          </p>
    
          {step === 'email' && (
            <form onSubmit={handleSendCode}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                style={{ width: '100%', padding: 8, marginBottom: 12 }}
              />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: 8 }}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}
    
          {step === 'verify' && (
            <form onSubmit={handleRegister}>
              <p>Code sent to <strong>{email}</strong></p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                required
                style={{ width: '100%', padding: 8, marginBottom: 12 }}
              />
              <button type="submit" disabled={loading} style={{ width: '100%', padding: 8 }}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          )}
    
          {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
    
          <p style={{ marginTop: 16 }}>
            Have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      );
}
