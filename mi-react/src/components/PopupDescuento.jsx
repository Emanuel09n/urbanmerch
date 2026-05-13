import { useState } from 'react'
import { FiX } from 'react-icons/fi'

export default function PopupDescuento() {
  const [visible, setVisible] = useState(true)
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 2000, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
      animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: '480px',
        borderRadius: '20px', overflow: 'hidden',
        animation: 'scaleIn 0.4s ease', position: 'relative'
      }}>
        {/* CERRAR */}
        <button onClick={() => setVisible(false)} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(0,0,0,0.1)', border: 'none',
          width: '32px', height: '32px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 1
        }}>
          <FiX size={16} />
        </button>

        {/* HEADER NEGRO */}
        <div style={{
          background: '#0a0a0a', padding: '48px 40px',
          textAlign: 'center'
        }}>
          <img src="/logo.png" alt="URBANMERCH"
            style={{ height: '60px', objectFit: 'contain', marginBottom: '20px' }} />
          <p style={{
            color: '#888', fontSize: '13px',
            letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '8px'
          }}>Suscríbete y obtén</p>
          <p style={{
            color: '#fff', fontSize: '64px', fontWeight: '900',
            letterSpacing: '-3px', lineHeight: '1'
          }}>15% OFF</p>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
            En tu primera compra
          </p>
        </div>

        {/* FORMULARIO */}
        <div style={{ padding: '32px 40px' }}>
          {enviado ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🎉</span>
              <p style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
                ¡Listo!
              </p>
              <p style={{ color: '#888', marginBottom: '8px' }}>Tu código de descuento es:</p>
              <p style={{
                fontSize: '28px', fontWeight: '900', letterSpacing: '4px',
                background: '#f5f5f5', padding: '16px', borderRadius: '12px'
              }}>URBAN15</p>
              <button onClick={() => setVisible(false)} style={{
                marginTop: '20px', background: '#0a0a0a', color: '#fff',
                padding: '14px 32px', borderRadius: '100px',
                fontSize: '13px', fontWeight: '700', letterSpacing: '2px',
                textTransform: 'uppercase', width: '100%'
              }}>
                Ir a comprar
              </button>
            </div>
          ) : (
            <>
              <input
                type="email" placeholder="Tu correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '14px 18px',
                  border: '1.5px solid #e8e8e8', borderRadius: '12px',
                  fontSize: '15px', outline: 'none', marginBottom: '12px',
                  fontFamily: 'inherit', transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#000'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
              <button
                onClick={() => { if (email) setEnviado(true) }}
                style={{
                  width: '100%', padding: '16px',
                  background: '#0a0a0a', color: '#fff',
                  fontSize: '13px', fontWeight: '700',
                  letterSpacing: '2px', textTransform: 'uppercase',
                  borderRadius: '12px', transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                ¡Quiero mi cupón!
              </button>
              <p style={{
                textAlign: 'center', marginTop: '16px',
                fontSize: '12px', color: '#ccc', cursor: 'pointer'
              }} onClick={() => setVisible(false)}>
                No gracias
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}