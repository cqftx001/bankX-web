// NotFoundPage.tsx
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>404 - Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/app/dashboard">Go to Dashboard</Link>
    </div>
  );
}
