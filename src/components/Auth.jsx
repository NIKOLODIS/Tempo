import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e1e1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#ffffff'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '40px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '8px',
          textAlign: 'center'
        }}>FY Tempo Calendar</h1>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          marginBottom: '32px',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>{isSignUp ? 'Create Account' : 'Sign In'}</p>

        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          {error && (
            <div style={{
              padding: '12px',
              marginBottom: '12px',
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '4px',
              color: '#ff6b6b',
              fontSize: '13px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(100, 160, 220, 0.8)',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
}
