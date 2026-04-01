import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  db: string;
  error?: string;
};

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/health')
      .then((res) => res.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch(() => setHealth({ status: 'error', db: 'disconnected' }));
  }, []);

  return (
    <main style={{ fontFamily: 'Segoe UI, sans-serif', padding: '2rem' }}>
      <h1>openSIS Modern</h1>
      <p>Migration workspace initialized.</p>
      <p>
        API health:{' '}
        {health ? `${health.status} (${health.db})` : 'checking...'}
      </p>
    </main>
  );
}
