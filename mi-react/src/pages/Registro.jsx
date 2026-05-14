import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('https://urbanmerch-production.up.railway.app/api/auth/registro', form)
      navigate('/login')
    } catch (err) {
      setError('Este email ya está registrado')
    }
    setLoading(false)
  }

  const fields = [
    { label: 'Nombre completo', key: 'nombre', type: 'text', placeholder: 'Tu nombre', icon: <FiUser /> },
    { label: 'Email', key: 'email', type: 'email', placeholder: 'tu@email.com', icon: <FiMail /> },
    { label: 'Contraseña', key: 'password', type: 'password', placeholder: '••••••••', icon: <FiLock /> },
  ]

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '90px 16px 40px',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* FONDO DECORATIVO */}
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 2 }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/logo.png" alt="URBANMERCH"
            style={{ height: '56px', objectFit: 'contain', filter: 'brightness(10)', marginBottom: '20px' }} />
          <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#555', textTransform: 'uppercase' }}>
            Crear cuenta
          </p>
        </div>

        {/* CARD */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px', padding: '40px 36px',
          backdropFilter: 'blur(20px)'
        }}>
          <h1 style={{
            fontSize: '28px', fontWeight: '900', color: '#fff',
            letterSpacing: '-1px', marginBottom: '8px'
          }}>Únete</h1>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>
            Crea tu cuenta en URBANMERCH
          </p>

          {error && (
            <div style={{
              background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.3)',
              borderRadius: '10px', padding: '12px 16px',
              color: '#ff6666', fontSize: '13px', marginBottom: '20px'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map(field => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{
                  fontSize: '11px', fontWeight: '600', letterSpacing: '1px',
                  textTransform: 'uppercase', color: '#666',
                  display: 'block', marginBottom: '8px'
                }}>{field.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)', color: '#555', fontSize: '16px',
                    display: 'flex', alignItems: 'center'
                  }}>{field.icon}</span>
                  <input type={field.type} required placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={{
                      width: '100%', padding: '14px 16px 14px 48px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px', fontSize: '15px',
                      outline: 'none', color: '#fff',
                      transition: 'all 0.2s', boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                      e.target.style.background = 'rgba(255,255,255,0.09)'
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.target.style.background = 'rgba(255,255,255,0.06)'
                    }}
                  />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '16px', marginTop: '12px',
              background: loading ? '#333' : '#fff',
              color: '#000', fontSize: '13px', fontWeight: '800',
              letterSpacing: '2px', textTransform: 'uppercase',
              borderRadius: '12px', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px'
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#e0e0e0' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#fff' }}>
              {loading ? 'Creando cuenta...' : <><span>Crear cuenta</span> <FiArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: '#555', fontSize: '12px' }}>o</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#fff', fontWeight: '700', textDecoration: 'none' }}>
              Ingresar
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#333' }}>
          © 2025 URBANMERCH. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}