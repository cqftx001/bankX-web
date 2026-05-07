// ForbiddenPage.tsx
import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>403 - Forbidden</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/app/dashboard">Go to Dashboard</Link>
    </div>
  );
}
