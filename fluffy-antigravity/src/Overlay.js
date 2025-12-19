import React, { useState } from 'react'

const SimpleLogo = () => (
    <div style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.05em' }}>
        NIMA <span style={{ color: '#ff69b4' }}>AFSHARFAR</span>
    </div>
)

export function Overlay() {
  const [showCV, setShowCV] = useState(false)

  // Styles for the glassmorphism panels
  const glassStyle = {
    background: 'rgba(20, 20, 20, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '40px',
    color: '#eee',
    maxWidth: '800px',
    margin: '0 auto',
    pointerEvents: 'auto',
    maxHeight: '80vh',
    overflowY: 'auto'
  }

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, left: 0, width: '100%', height: '100%', 
      pointerEvents: 'none',
      display: 'flex', flexDirection: 'column',
      padding: '40px', boxSizing: 'border-box'
    }}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'auto' }}>
        <SimpleLogo />
        <nav style={{ display: 'flex', gap: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
             {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" onClick={() => setShowCV(false)} style={{ textDecoration: 'none', color: !showCV ? '#ff69b4' : 'inherit' }}>HOME</a>
             {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" onClick={() => setShowCV(true)} style={{ textDecoration: 'none', color: showCV ? '#ff69b4' : 'inherit' }}>CURRICULUM VITAE</a>
            <a href="https://github.com/ne3mer" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>GITHUB</a>
            <a href="https://linkedin.com/in/nima-afsharfar-230a21176" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>LINKEDIN</a>
        </nav>
      </header>

      {/* BODY */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {!showCV ? (
            /* HOME VIEW */
            <div style={{ maxWidth: '600px', pointerEvents: 'auto' }}>
                <h1 style={{ fontSize: '5vw', lineHeight: '0.9', margin: '0 0 20px 0', fontWeight: '800' }}>
                    ARCHITECTURE &<br />
                    <span style={{ color: '#ff69b4' }}>ALGORITHM.</span>
                </h1>
                <p style={{ fontSize: '1.2rem', margin: '0 0 40px 0', opacity: 0.8, lineHeight: '1.5' }}>
                    I bridge the gap between computational capability and organizational implementation. 
                    Merging rigorous Computer Engineering with Sustainable Supply Chain Management.
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button 
                        onClick={() => setShowCV(true)}
                        style={{ 
                        background: '#fff', color: '#000', border: 'none', 
                        padding: '15px 40px', borderRadius: '50px', 
                        fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' 
                    }}>
                        VIEW FULL CV
                    </button>
                </div>
            </div>
        ) : (
            /* CV VIEW */
            <div style={glassStyle}>
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Mohammad (Nima) Afsharfar</h2>
                <p><strong>Prospective Degree:</strong> PhD</p>
                <p><strong>Phone:</strong> +36 70 402 6493 | <strong>Email:</strong> ne3mer@gmail.com</p>
                
                <h3>Research Interests</h3>
                <p>Human-Centered AI • Sustainable Supply Chain Optimization • Explainable AI (XAI) • Full-Stack Research Artifacts</p>
                
                <h3>Technical Foundation</h3>
                <p>
                    <strong>B.Sc. Computer Engineering (Software)</strong> | GPA: 17.60/20.00 (Top Tier)<br/>
                    <em>Islamic Azad University, North Tehran Branch (July 2020)</em><br/>
                    Core: Data Structures, Algorithm Design, AI, Software Engineering.
                </p>

                <h3>Professional Experience</h3>
                <p>
                    <strong>Full-Stack Developer & Applied Researcher</strong> (2023 – Present)<br/>
                    Architecting research-oriented applications using the <strong>MERN Stack</strong>. Hands-on experience with TypeScript, Python (TensorFlow), and Data Visualization (Recharts).
                </p>

                <h3>Academic Research</h3>
                <p>
                    <strong>MBA Thesis: Ethical AI & Sustainable Supply Chains</strong> (Expected 2026)<br/>
                    <em>Budapest Metropolitan University</em><br/>
                    Designed and coded "OptiSupply," a decision-support system to test ethical scoring algorithms.
                </p>
                
                <h3>Why Me?</h3>
                <p>
                    I possess a unique dual competency: I can architect sophisticated AI systems (Engineering), and I understand the governance required to deploy them (Management).
                </p>
            </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', fontSize: '0.8rem', opacity: 0.5 }}>
        <div>
            BUDAPEST, HUNGARY<br />
            AVAILABLE FOR PHD ADMISSION
        </div>
        <div>
           SCROLL TO READ
        </div>
      </div>
    </div>
  )
}
