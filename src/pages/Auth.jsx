import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, Sparkles, UserRound, Mail as MailIcon, RotateCcw, Code2 as GithubIcon, Globe as ChromeIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/validators';
import './Auth.css';

export function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  const isSignup = location.pathname === '/register';
  const [form, setForm] = useState({ name: '', email: '', password: '', newsletter: true });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState('auth'); // 'auth' | 'forgot'
  const destination = location.state?.from?.pathname || '/account';

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (mode === 'forgot') {
      if (!validateEmail(form.email)) return setError('Please enter a valid email address.');
      setError('');
      setSuccess('If an account exists for that email, a reset link has been sent.');
      // In a real app: call API to send reset email
      return;
    }
    if (isSignup && form.name.trim().length < 2) return setError('Please enter your name.');
    if (!validateEmail(form.email)) return setError('Please enter a valid email address.');
    if (!validatePassword(form.password)) return setError('Use at least 8 characters with uppercase, lowercase, and a number.');
    setError('');
    setSuccess('');
    if (isSignup) await signup(form);
    else await login(form.email, form.password);
    navigate(destination, { replace: true });
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setSuccess('');
    // Mock social login - in real app this would redirect to OAuth
    setForm({ ...form, name: '', email: `demo@${provider}.com`, password: 'DemoPass123', newsletter: true });
    if (isSignup) await signup({ name: provider.charAt(0).toUpperCase() + provider.slice(1) + ' User', email: `demo@${provider}.com`, password: 'DemoPass123', newsletter: true });
    else await login(`demo@${provider}.com`, 'DemoPass123');
    navigate(destination, { replace: true });
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setForm({ name: '', email: '', password: '', newsletter: true });
  };

  return (
    <div className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-mark"><Sparkles size={23} aria-hidden="true" /></div>
        <p className="auth-eyebrow">A calmer way to shop</p>
        {mode === 'forgot' ? (
          <>
            <h1 id="auth-title">Reset your password</h1>
            <p className="auth-intro">Enter your email and we'll send you a link to create a new password.</p>
          </>
        ) : (
          <>
            <h1 id="auth-title">{isSignup ? 'Create your calm space' : 'Welcome back'}</h1>
            <p className="auth-intro">{isSignup ? 'Save your favorites and make checkout feel effortless.' : 'Sign in to continue your thoughtful collection.'}</p>
          </>
        )}
        <form className="auth-form" onSubmit={submit} noValidate>
          {mode !== 'forgot' && isSignup && <label>Name<input name="name" value={form.name} onChange={updateField} autoComplete="name" placeholder="Your name" /><UserRound size={18} aria-hidden="true" /></label>}
          <label>Email<input name="email" type="email" value={form.email} onChange={updateField} autoComplete={mode === 'forgot' ? 'email' : (isSignup ? 'email' : 'email')} placeholder="you@example.com" /><MailIcon size={18} aria-hidden="true" /></label>
          {mode !== 'forgot' && <label>Password<input name="password" type="password" value={form.password} onChange={updateField} autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="••••••••" /><LockKeyhole size={18} aria-hidden="true" /></label>}
          {isSignup && mode !== 'forgot' && <label className="newsletter"><input name="newsletter" type="checkbox" checked={form.newsletter} onChange={updateField} /> Send me thoughtful product notes and updates.</label>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          {success && <p className="auth-success" role="status">{success}</p>}
          <button className="btn btn-primary auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait…' : mode === 'forgot' ? 'Send reset link' : isSignup ? 'Create account' : 'Sign in'}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="auth-divider">
              <span>or continue with</span>
            </div>
            <div className="social-buttons" role="group" aria-label="Social login options">
              <button type="button" className="btn btn-social" onClick={() => handleSocialLogin('google')} aria-label="Continue with Google">
                <ChromeIcon size={18} aria-hidden="true" />
                <span>Google</span>
              </button>
              <button type="button" className="btn btn-social" onClick={() => handleSocialLogin('github')} aria-label="Continue with GitHub">
                <GithubIcon size={18} aria-hidden="true" />
                <span>GitHub</span>
              </button>
            </div>
          </>
        )}

        <p className="auth-switch">
          {mode === 'forgot' ? (
            <Link to={isSignup ? '/register' : '/login'} state={location.state} onClick={() => toggleMode('auth')}>
              Back to sign in
            </Link>
          ) : isSignup ? (
            <>
              Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
            </>
          ) : (
            <>
              New to calmshop? <Link to="/register" state={location.state}>Create an account</Link>
            </>
          )}
        </p>
        <p className="auth-switch">
          {mode !== 'forgot' && (
            <Link to={isSignup ? '/register' : '/login'} state={location.state} onClick={(e) => { e.preventDefault(); toggleMode('forgot'); }}>
              Forgot password?
            </Link>
          )}
        </p>
        <p className="auth-note">Demo authentication only—no real credentials are stored. Use any email/password.</p>
      </section>
    </div>
  );
}
