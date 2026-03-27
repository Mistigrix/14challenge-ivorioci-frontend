const CI_O = '#FF8C00';
const CI_G = '#009E49';

export default function FlagBar({ width = 32, height = 3 }) {
  return (
    <div style={{
      display: 'flex', width, height,
      borderRadius: 2, overflow: 'hidden',
    }}>
      <div style={{ flex: 1, background: CI_O }} />
      <div style={{ flex: 1, background: '#FFF' }} />
      <div style={{ flex: 1, background: CI_G }} />
    </div>
  );
}