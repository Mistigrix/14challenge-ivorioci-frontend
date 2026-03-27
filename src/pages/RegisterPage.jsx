import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FlagBar from '../components/FlagBar';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const CARD = '#1A1A22';
const BORDER = '#2A2A35';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const INPUT_BG = '#111116';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordsMatch = () => formData.password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch()) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      // TODO: remplace par ton appel API réel
      // const response = await api.post('/auth/register', formData);
      // localStorage.setItem('token', response.data.token);

      // Simulation pour l'instant
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/');

    } catch (err) {
      setErrorMessage(
        err.response?.status === 409
          ? 'Cet email est déjà utilisé'
          : 'Une erreur est survenue, réessayez'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (hasError = false, hasSuccess = false) => ({
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: `1px solid ${hasError ? '#E53935' : hasSuccess ? CI_G : BORDER}`,
    background: INPUT_BG, fontSize: 13, color: TEXT_P,
    outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s',
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0E', padding: '24px 16px',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: CARD, borderRadius: 20,
        border: `1px solid ${BORDER}`, padding: '40px 36px',
      }}>

        {/* ——— Logo ——— */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <FlagBar width={48} height={4} />
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: TEXT_P,
            margin: '0 0 8px', letterSpacing: -0.5,
          }}>
            Ivorio<span style={{ color: CI_O }}>CI</span>
          </h1>
          <p style={{ fontSize: 13, color: TEXT_S, margin: 0 }}>
            Rejoignez IvorioCI gratuitement
          </p>
        </div>

        {/* ——— Erreur ——— */}
        {errorMessage && (
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 20,
            background: 'rgba(229,57,53,0.1)',
            border: '1px solid rgba(229,57,53,0.3)',
            color: '#E53935', fontSize: 12,
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* ——— Formulaire ——— */}
        <form onSubmit={handleSubmit}>

          {/* Nom */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 11, color: TEXT_S, fontWeight: 500,
              display: 'block', marginBottom: 6,
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>Nom complet</label>
            <input
              type="text"
              placeholder="Kouame Aya"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              style={inputStyle()}
              onFocus={e => e.target.style.borderColor = CI_O}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 11, color: TEXT_S, fontWeight: 500,
              display: 'block', marginBottom: 6,
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>Email</label>
            <input
              type="email"
              placeholder="jean@mail.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              style={inputStyle()}
              onFocus={e => e.target.style.borderColor = CI_O}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 11, color: TEXT_S, fontWeight: 500,
              display: 'block', marginBottom: 6,
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>Mot de passe</label>
            <input
              type="password"
              placeholder="Minimum 8 caractères"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              style={inputStyle()}
              onFocus={e => e.target.style.borderColor = CI_O}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
          </div>

          {/* Confirmer mot de passe */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              fontSize: 11, color: TEXT_S, fontWeight: 500,
              display: 'block', marginBottom: 6,
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="Répétez le mot de passe"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={inputStyle(
                confirmPassword && !passwordsMatch(),
                confirmPassword && passwordsMatch(),
              )}
              onFocus={e => e.target.style.borderColor = CI_O}
              onBlur={e => {
                e.target.style.borderColor = confirmPassword
                  ? passwordsMatch() ? CI_G : '#E53935'
                  : BORDER;
              }}
            />
            {confirmPassword && !passwordsMatch() && (
              <p style={{ fontSize: 11, color: '#E53935', margin: '6px 0 0' }}>
                ✗ Les mots de passe ne correspondent pas
              </p>
            )}
            {confirmPassword && passwordsMatch() && (
              <p style={{ fontSize: 11, color: CI_G, margin: '6px 0 0' }}>
                ✓ Les mots de passe correspondent
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passwordsMatch()}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 12,
              border: 'none',
              cursor: isLoading || !passwordsMatch() ? 'not-allowed' : 'pointer',
              background: `linear-gradient(135deg, ${CI_O}, #FFa040)`,
              color: '#FFF', fontSize: 14, fontWeight: 700,
              boxShadow: `0 4px 16px ${CI_O}30`,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
              opacity: isLoading || !passwordsMatch() ? 0.6 : 1,
              transition: 'all 0.2s',
            }}>
            {isLoading ? (
              <>
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Inscription...
              </>
            ) : '👤 S\'inscrire'}
          </button>

        </form>

        {/* ——— Footer ——— */}
        <p style={{
          textAlign: 'center', fontSize: 13,
          color: TEXT_S, margin: '20px 0 0',
        }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{
            color: CI_O, fontWeight: 700, textDecoration: 'none',
          }}>Se connecter</Link>
        </p>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}