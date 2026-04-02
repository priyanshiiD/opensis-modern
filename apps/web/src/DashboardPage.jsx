import { Link } from 'react-router-dom';
import { clearAuthTokens } from './auth';

export function DashboardPage() {
  return (
    <main style={{ fontFamily: 'Segoe UI, sans-serif', padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>First migration milestone is active.</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/students">Go to Students List</Link>
        <Link
          to="/login"
          onClick={() => {
            clearAuthTokens();
          }}
        >
          Logout
        </Link>
      </div>
    </main>
  );
}
