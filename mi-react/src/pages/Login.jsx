import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('https://urbanmerch-production.up.railway.app/api/auth/login', form)
      login(res.data.usuario, res.data.token)
      navigate('/')
    } catch (err) {
      setError('Email o contraseña incorrectos')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '90px 16px 40px',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* FONDO DECORATIVO */}
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        position: 'relative', zIndex: 2
      }}>
        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/logo.png" alt="URBANMERCH"
            style={{ height: '56px', objectFit: 'contain', filter: 'brightness(10)', marginBottom: '20px' }} />
          <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#555', textTransform: 'uppercase' }}>
            Iniciar sesión
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
          }}>Bienvenido</h1>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>
            Ingresa a tu cuenta URBANMERCH
          </p>

          {error && (
            <div style={{
              background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.3)',
              borderRadius: '10px', padding: '12px 16px',
              color: '#ff6666', fontSize: '13px', marginBottom: '20px'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '11px', fontWeight: '600', letterSpacing: '1px',
                textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '8px'
              }}>Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)', color: '#555', fontSize: '16px'
                }} />
                <input type="email" required placeholder="tu@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
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

            {/* CONTRASEÑA */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                fontSize: '11px', fontWeight: '600', letterSpacing: '1px',
                textTransform: 'uppercase', color: '#666', display: 'block', marginBottom: '8px'
              }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute', left: '16px', top: '50%',
                  transform: 'translateY(-50%)', color: '#555', fontSize: '16px'
                }} />
                <input type="password" required placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
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

            {/* BOTÓN */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '16px',
              background: loading ? '#333' : '#fff',
              color: '#000', fontSize: '13px', fontWeight: '800',
              letterSpacing: '2px', textTransform: 'uppercase',
              borderRadius: '12px', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px'
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#e0e0e0' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#fff' }}>
              {loading ? 'Ingresando...' : <><span>Ingresar</span> <FiArrowRight size={16} /></>}
            </button>
          </form>

          {/* DIVISOR */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '24px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: '#555', fontSize: '12px' }}>o</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ color: '#fff', fontWeight: '700', textDecoration: 'none' }}>
              Regístrate gratis
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