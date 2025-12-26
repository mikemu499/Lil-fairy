import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/teachers');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password, { full_name: name });
      navigate('/teachers');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/teachers');
    return null;
  }

  return (
    <div className="landing-page">
      <div className="container">
        <header className="hero">
          <div className="hero-content">
            <h1>Celebrate learning — tiny wins, big smiles.</h1>
            <p className="lead">
              Lil Fairy helps teachers reward progress with colorful badges, playful celebrations, and printable reports — designed for joyful classrooms.
            </p>
            <div className="cta-row">
              <button 
                className="btn-primary" 
                onClick={() => setShowSignup(true)}
                disabled={loading}
              >
                Get Started — it's free
              </button>
              <button 
                className="btn-ghost"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore features
              </button>
            </div>
          </div>
          <div className="hero-illustration">
            {/* Decorative fairy scene */}
            <div className="fairy-scene">
              <div className="fairy-character">🧚‍♀️</div>
              <div className="sparkles">
                <span>✨</span>
                <span>✨</span>
                <span>✨</span>
              </div>
            </div>
          </div>
        </header>

        {!showSignup ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Log In</h2>
            {error && <div className="error">{error}</div>}
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <p className="auth-toggle">
              Don't have an account?{' '}
              <button type="button" onClick={() => setShowSignup(true)}>
                Sign up
              </button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignup}>
            <h2>Create Account</h2>
            {error && <div className="error">{error}</div>}
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <p className="auth-toggle">
              Already have an account?{' '}
              <button type="button" onClick={() => setShowSignup(false)}>
                Log in
              </button>
            </p>
          </form>
        )}

        <section id="features" className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>For Teachers</h3>
              <p>Quick setup, class management, and reports</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>For Students</h3>
              <p>Playful animations and stickers that encourage growth</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Reports</h3>
              <p>Generate colorful printable summaries for parents</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;