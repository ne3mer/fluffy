import React from 'react'
import { cvData } from './cvData'

const SectionButton = ({ id, current, onClick, color }) => (
    <button 
        onClick={() => onClick(id)}
        style={{
            background: current === id ? color : 'transparent',
            border: `1px solid ${color}`,
            color: current === id ? '#000' : color,
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease'
        }}
    >
        {id}
    </button>
)

export function CreativeOverlay({ section, setSection }) {
  const data = cvData[section]

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
      pointerEvents: 'none', display: 'flex', flexDirection: 'column', 
      padding: '40px', boxSizing: 'border-box'
    }}>
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.05em' }}>
                NIMA <span style={{ color: data.color }}>AFSHARFAR</span>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                PHD CANDIDATE PORTFOLIO
            </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div style={{ 
                background: 'rgba(10,10,10, 0.7)', 
                backdropFilter: 'blur(20px)', 
                borderLeft: `4px solid ${data.color}`,
                padding: '40px', 
                maxWidth: '500px',
                pointerEvents: 'auto',
                transition: 'all 0.5s ease'
            }}>
                <h2 style={{ 
                    color: data.color, margin: '0 0 10px 0', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px' 
                }}>
                    {data.subtitle}
                </h2>
                <h1 style={{ 
                    fontSize: '3rem', margin: '0 0 20px 0', lineHeight: 0.9, textTransform: 'uppercase' 
                }}>
                    {data.title}
                </h1>
                <p style={{ lineHeight: 1.6, opacity: 0.9, marginBottom: '30px', fontSize: '1.1rem' }}>
                    {data.text}
                </p>

                {/* DETAILS GRID */}
                {data.details && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                        {data.details.map((d, i) => (
                            <div key={i}>
                                <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>{d.label}</div>
                                <div style={{ fontWeight: 'bold' }}>{d.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAGS */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {data.tags.map(tag => (
                        <span key={tag} style={{ 
                            background: data.color, color: '#000', 
                            padding: '5px 10px', borderRadius: '4px', 
                            fontSize: '0.8rem', fontWeight: 'bold' 
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* NAVIGATION FOOTER */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {Object.keys(cvData).map(key => (
                <SectionButton 
                    key={key} 
                    id={key} 
                    current={section} 
                    onClick={setSection} 
                    color={cvData[key].color} 
                />
            ))}
        </div>
    </div>
  )
}
