import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Auth } from './components/Auth';
import { Game } from './components/Game';

function App() {
  const { user, loading } = useAuth();
  const [inGame, setInGame] = useState(false);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth onAuth={() => setInGame(true)} />;
  }

  if (!inGame) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white',
        gap: '1rem',
      }}>
        <h1>Survival Game MVP</h1>
        <button
          onClick={() => setInGame(true)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
        >
          Start Game
        </button>
      </div>
    );
  }

  return <Game />;
}

export default App;
