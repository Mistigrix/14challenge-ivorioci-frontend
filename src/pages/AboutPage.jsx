import { videos, categoriesData, profiles } from '../data/mockData';

const CI_O = '#FF8C00';
const CI_G = '#009E49';
const CARD = '#1A1A22';
const BORDER = '#2A2A35';
const SURFACE = '#131318';
const TEXT_P = '#F0EDE6';
const TEXT_S = '#777';
const TEXT_DIM = '#444';

const team = [
  { name: 'Bath Dorgeles',   role: 'Chef de projet & Front' },
  { name: 'Oclin Marcel C.', role: 'Dev Front-end (React.js)' },
  { name: 'Rayane Irie',     role: 'Back-end (Go + Python + Node.js)' },
];

const stack = [
  'React.js (Web)',
  'Go (Microservices)',
  'Python (Recommandations)',
  'Node.js (API Gateway)',
  'HLS Streaming',
];

const stats = [
  { value: videos.length,        label: 'Vidéos',     color: CI_O },
  { value: categoriesData.length, label: 'Catégories', color: CI_G },
  { value: profiles.length,      label: 'Profils',    color: CI_O },
  { value: '4',                  label: 'Langages',   color: CI_G },
];

const getInitials = (name) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

export default function AboutPage() {
  return (
    <div className="page-container" style={{ maxWidth: 700, margin: '0 auto', padding: '88px 32px 40px' }}>

      {/* ——— Description ——— */}
      <div style={{
        background: CARD, borderRadius: 20,
        border: `1px solid ${BORDER}`, padding: '36px 24px', marginBottom: 24,
      }}>
        <div style={{
          display: 'flex', width: 56, height: 35, borderRadius: 6,
          overflow: 'hidden', marginBottom: 20, border: `1px solid ${BORDER}`,
        }}>
          <div style={{ flex: 1, background: CI_O }} />
          <div style={{ flex: 1, background: '#FFF' }} />
          <div style={{ flex: 1, background: CI_G }} />
        </div>

        <h2 style={{
          fontSize: 28, fontWeight: 800, color: CI_O,
          margin: '0 0 16px', letterSpacing: -0.5,
        }}>IvorioCI</h2>

        <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_S, margin: '0 0 16px' }}>
          Jour 13 du Challenge 14-14-14. IvorioCI est une plateforme de streaming vidéo
          dédiée au contenu ivoirien et africain. Films, séries, documentaires — tout le cinéma
          de Côte d'Ivoire en un seul endroit.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_S, margin: 0 }}>
          Multi-profils, recommandations personnalisées, streaming adaptatif.
          Le projet le plus ambitieux du challenge avec 4 langages et une architecture microservices.
        </p>
      </div>

      {/* ——— Stats ——— */}
      <div className="stats-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, marginBottom: 24,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: 20, borderRadius: 14,
            background: CARD, border: `1px solid ${BORDER}`,
          }}>
            <p style={{
              fontSize: 28, fontWeight: 800, margin: '0 0 4px', color: s.color,
            }}>{s.value}</p>
            <p style={{ fontSize: 11, color: TEXT_S, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ——— Équipe + Stack ——— */}
      <div className="about-grid" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 16, marginBottom: 24,
      }}>

        {/* Équipe */}
        <div style={{
          background: CARD, borderRadius: 16,
          border: `1px solid ${BORDER}`, padding: 24,
        }}>
          <p style={{
            fontSize: 10, color: TEXT_DIM, margin: '0 0 14px',
            textTransform: 'uppercase', letterSpacing: 1.5,
          }}>L'équipe</p>
          {team.map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: i < team.length - 1 ? 12 : 0,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(135deg, ${CI_O}, ${CI_G})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFF', fontSize: 11, fontWeight: 700,
              }}>{getInitials(m.name)}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: TEXT_P, margin: 0 }}>
                  {m.name}
                </p>
                <p style={{ fontSize: 10, color: TEXT_S, margin: 0 }}>{m.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div style={{
          background: CARD, borderRadius: 16,
          border: `1px solid ${BORDER}`, padding: 24,
        }}>
          <p style={{
            fontSize: 10, color: TEXT_DIM, margin: '0 0 14px',
            textTransform: 'uppercase', letterSpacing: 1.5,
          }}>Stack technique</p>
          {stack.map((t, i) => (
            <div key={i} style={{
              padding: '8px 12px', borderRadius: 8,
              background: SURFACE, border: `1px solid ${BORDER}`,
              marginBottom: i < stack.length - 1 ? 6 : 0,
            }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: CI_G }}>{t}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ——— Footer ——— */}
      <div style={{
        textAlign: 'center', padding: 16, borderRadius: 12,
        background: CARD, border: `1px solid ${BORDER}`,
      }}>
        <p style={{ fontSize: 12, color: TEXT_S, margin: 0 }}>
          Open Source sur{' '}
          <a href="https://225os.com" target="_blank" rel="noreferrer"
            style={{ color: CI_O, fontWeight: 600, textDecoration: 'none' }}>
            225os.com
          </a>
          {' & '}
          <a href="https://github.com/bath01" target="_blank" rel="noreferrer"
            style={{ color: CI_G, fontWeight: 600, textDecoration: 'none' }}>
            GitHub
          </a>
        </p>
      </div>

    </div>
  );
}