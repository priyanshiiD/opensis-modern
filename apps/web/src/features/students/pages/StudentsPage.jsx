import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiBaseUrl } from '../../../shared/config/env.js';
import { logoutRequest } from '../../auth/api/authApi.js';
import { clearAuthTokens, getAccessToken, getRefreshToken } from '../../auth/storage/tokenStorage.js';

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError('Missing token. Please login.');
      return;
    }

    fetch(`${apiBaseUrl}/students`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message || 'Failed to load students');
        }
        setStudents(data.data?.students || []);
      })
      .catch((e) => setError(e.message));
  }, []);

  async function onLogout() {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    try {
      await logoutRequest(accessToken, refreshToken);
    } catch {
      // Local cleanup must still happen if logout call fails.
    }

    clearAuthTokens();
  }

  return (
    <main style={{ fontFamily: 'Segoe UI, sans-serif', padding: '2rem' }}>
      <h1>Students List</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: 12 }}>
        <Link to="/dashboard">Back to Dashboard</Link>
        <Link
          to="/login"
          onClick={() => {
            void onLogout();
          }}
        >
          Logout
        </Link>
      </div>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>ID</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>First Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId}>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{student.studentId}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{student.firstName}</td>
              <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{student.lastName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
