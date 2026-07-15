import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        login(data.user, data.accessToken, data.refreshToken);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetMessage('');
    setResetLoading(true);

    try {
      await api.post('/auth/forgot-password', { email: resetEmail });
      setResetMessage('If an account with that email exists, password reset instructions have been sent to your HR administrator.');
    } catch {
      // Always show success to prevent email enumeration
      setResetMessage('If an account with that email exists, password reset instructions have been sent to your HR administrator.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="hero-content" style={{ textAlign: 'center' }}>
          <img src="/favicon.jpeg" alt="Damodara Smart Logo" style={{ width: '80px', height: '80px', borderRadius: '12px', margin: '0 auto 24px', display: 'block', objectFit: 'cover' }} />
          <h1>
            Damodara Smart<br />
            HRMS Portal
          </h1>
        </div>
      </div>

      <main className="login-panel">
        <div className="login-card">
          {showForgotPassword ? (
            <>
              <h2>Reset Password</h2>
              <p className="login-subtitle">Enter your email and we'll notify HR to reset your password</p>

              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-email">Email Address</label>
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@damodara.com"
                    required
                    autoFocus
                  />
                </div>

                {resetMessage && <p className="success-message">{resetMessage}</p>}

                <button type="submit" className="btn btn-primary" disabled={resetLoading}>
                  {resetLoading ? 'Sending...' : 'Request Password Reset'}
                </button>

                <div className="login-meta">
                  <button type="button" onClick={() => { setShowForgotPassword(false); setResetMessage(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer' }}>
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>Welcome back</h2>
              <p className="login-subtitle">Sign in to your HRMS account</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@damodara.com"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="login-meta">
                  <button type="button" onClick={() => setShowForgotPassword(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
