import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/authApi.js';
import { setAuthTokens } from '../storage/tokenStorage.js';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginRequest(username, password);
      setAuthTokens(data.data.accessToken, data.data.refreshToken);
      navigate('/dashboard');
    } catch (e) {
      setError(e.message || 'Could not connect to API.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 380, margin: '3rem auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1>openSIS Login</h1>
      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Username
          <input
            style={{ width: '100%', marginTop: 6, padding: 8 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          Password
          <input
            style={{ width: '100%', marginTop: 6, padding: 8 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}

        <button type="submit" disabled={loading} style={{ padding: '0.6rem 1rem' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}
