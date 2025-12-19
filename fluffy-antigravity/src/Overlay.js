// import { Logo } from './Logo'

// We can make a simple Logo component or just text for now
// Let's assume we use SVG or text
const SimpleLogo = () => (
    <div style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.05em' }}>
        ZERO-G <span style={{ color: '#ff69b4' }}>FLOOF</span>
    </div>
)

export function Overlay() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px',
      boxSizing: 'border-box'
    }}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'auto' }}>
        <SimpleLogo />
        <nav style={{ display: 'flex', gap: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>ABOUT</a>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>ADOPT</a>
            <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>MERCH</a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ 
            fontSize: '6vw', 
            lineHeight: '0.9', 
            margin: '0 0 20px 0', 
            fontWeight: '800' 
        }}>
            FLOAT FREE.<br />
            BE <span style={{ color: '#ff69b4' }}>FLUFFY.</span>
        </h1>
        <p style={{ fontSize: '1.2rem', margin: '0 0 40px 0', opacity: 0.8 }}>
            Experience the weightlessness of the fluffiest creature in the metaverse. 
            Poke it, spin it, love it.
        </p>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '20px' }}>
            <button style={{ 
                background: '#fff', 
                color: '#000', 
                border: 'none', 
                padding: '15px 40px', 
                borderRadius: '50px', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
            }}>
                ADOPT A FLOOF
            </button>
            <button style={{ 
                background: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                color: '#fff', 
                border: '1px solid rgba(255,255,255,0.2)', 
                padding: '15px 40px', 
                borderRadius: '50px', 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
            }}>
                LEARN MORE
            </button>
        </div>
      </div>

      {/* FOOTER / STATUS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', fontSize: '0.8rem', opacity: 0.5 }}>
        <div>
            GRAVITY: 0.0 m/s²<br />
            WIND: 12 km/h
        </div>
        <div>
           SCROLL TO EXPLORE
        </div>
      </div>
    </div>
  )
}
