import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Auth = ({ onAuth }: { onAuth: () => void }) => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        if (!isLogin) {
          setError('Check your email for confirmation');
        } else {
          onAuth();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        backgroundColor: '#2a2a2a',
        borderRadius: '8px',
        width: '300px',
      }}>
        <h2 style={{ textAlign: 'center', margin: 0 }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        {error && <div style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ padding: '0.5rem' }}>
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#4dabf7', cursor: 'pointer' }}
        >
          {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
        </button>
      </form>
    </div>
  );
};
