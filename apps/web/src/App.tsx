import React from 'react';
import { Button } from '@prj/ui';
import { formatGreeting } from '@prj/utils';
import { useEffect, useState } from 'react';
import BookmarkService from './BookmarkService';

export function App() {
  const [count, setCount] = React.useState(0);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');

  useEffect(() => {
    fetch('http://localhost:4000/health')
      .then((r) => r.json())
      .then((d) => setApiStatus(d.status === 'ok' ? 'ok' : 'error'))
      .catch(() => setApiStatus('error'));
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold mb-4">
          {formatGreeting('Namul Family')}
        </h1>
        <p className="text-sm text-gray-600 mb-2">
          API: {apiStatus === 'unknown' ? 'checking…' : apiStatus}
          {' '}<a className="text-blue-600 underline" href="http://localhost:4000/health" target="_blank" rel="noreferrer">/health</a>
        </p>
        <div className="space-x-3">
          <Button onClick={() => setCount((c) => c + 1)}>
            Clicked {count} times
          </Button>
          <Button variant="secondary" onClick={() => setCount(0)}>
            Reset
          </Button>
        </div>
      </header>

      {/* ✅ 여기서 BookmarkService 렌더링 */}
      <main>
        <BookmarkService />
      </main>
    </div>
  );
}

export default App;
