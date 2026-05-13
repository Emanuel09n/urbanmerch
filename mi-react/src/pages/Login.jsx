import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

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
      minHeight: '100vh', background: '#f5f5f5',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', paddingTop: '70px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px',
        padding: '60px', width: '100%', maxWidth: '440px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{
          fontSize: '32px', fontWeight: '800',
          marginBottom: '8px', letterSpacing: '-1px'
        }}>Bienvenido</h1>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '14px' }}>
          Ingresa a tu cuenta URBANMERCH
        </p>

        {error && (
          <div style={{
            background: '#fff0f0', border: '1px solid #ffcccc',
            borderRadius: '8px', padding: '12px 16px',
            color: '#cc0000', fontSize: '13px', marginBottom: '24px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '12px', fontWeight: '600',
              letterSpacing: '1px', textTransform: 'uppercase',
              color: '#333', display: 'block', marginBottom: '8px'
            }}>Email</label>
            <input
              type="email" required
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%', padding: '14px 16px',
                border: '1.5px solid #e0e0e0', borderRadius: '10px',
                fontSize: '15px', outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#000'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              fontSize: '12px', fontWeight: '600',
              letterSpacing: '1px', textTransform: 'uppercase',
              color: '#333', display: 'block', marginBottom: '8px'
            }}>Contraseña</label>
            <input
              type="password" required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%', padding: '14px 16px',
                border: '1.5px solid #e0e0e0', borderRadius: '10px',
                fontSize: '15px', outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#000'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '16px',
            background: loading ? '#ccc' : '#0a0a0a',
            color: '#fff', fontSize: '14px',
            fontWeight: '700', letterSpacing: '2px',
            textTransform: 'uppercase', borderRadius: '10px',
            transition: 'all 0.3s'
          }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '24px',
          fontSize: '14px', color: '#888'
        }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: '#000', fontWeight: '600' }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}