import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FiShoppingBag, FiSearch, FiX, FiSettings } from 'react-icons/fi'
import { useState } from 'react'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const { cantidad } = useCart()
  const navigate = useNavigate()
  const [busquedaOpen, setBusquedaOpen] = useState(false)
  const [busquedaTexto, setBusquedaTexto] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleBuscar = (e) => {
    e.preventDefault()
    if (busquedaTexto.trim()) {
      navigate(`/catalogo?busqueda=${busquedaTexto}`)
      setBusquedaOpen(false)
      setBusquedaTexto('')
    }
  }

  return (
    <>
      {/* BARRA SUPERIOR */}
      <div style={{
        background: '#0a0a0a', color: '#fff',
        textAlign: 'center', padding: '8px',
        fontSize: '12px', letterSpacing: '2px'
      }}>
        🚚 ENVÍO GRATIS EN TU PRIMER PEDIDO — USA EL CÓDIGO: <strong>URBAN15</strong>
      </div>

      <nav style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky', top: 0, zIndex: 1000
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', padding: '0 40px', height: '70px'
        }}>

          {/* LINKS IZQUIERDA */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {[
              { to: '/catalogo?seccion=hombre', label: 'Hombre', color: '#333' },
              { to: '/catalogo?seccion=mujer', label: 'Mujer', color: '#333' },
              { to: '/catalogo?seccion=todos', label: 'Colecciones', color: '#333' },
              { to: '/catalogo?seccion=sale', label: 'Sale 🔥', color: '#cc0000' },
            ].map((link, i) => (
              <Link key={i} to={link.to} style={{
                fontSize: '12px', fontWeight: '600', letterSpacing: '2px',
                textTransform: 'uppercase', color: link.color, transition: 'opacity 0.2s'
              }}
                onMouseEnter={e => e.target.style.opacity = '0.7'}
                onMouseLeave={e => e.target.style.opacity = '1'}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* LOGO CENTRADO */}
          <Link to="/">
            <img src="/logo.png" alt="URBANMERCH"
              style={{ height: '50px', objectFit: 'contain' }} />
          </Link>

          {/* ICONOS DERECHA */}
          <div style={{
            display: 'flex', gap: '20px', alignItems: 'center',
            justifyContent: 'flex-end'
          }}>

            {/* BUSCADOR */}
            <div style={{ position: 'relative' }}>
              {busquedaOpen
                ? <FiX size={20} color="#333" style={{ cursor: 'pointer' }}
                    onClick={() => setBusquedaOpen(false)} />
                : <FiSearch size={20} color="#333" style={{ cursor: 'pointer' }}
                    onClick={() => setBusquedaOpen(true)} />
              }
              {busquedaOpen && (
                <form onSubmit={handleBuscar} style={{
                  position: 'absolute', right: 0, top: '40px',
                  background: '#fff', borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  padding: '12px', display: 'flex', gap: '8px',
                  border: '1px solid #f0f0f0', width: '280px', zIndex: 10
                }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Buscar productos..."
                    value={busquedaTexto}
                    onChange={e => setBusquedaTexto(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 14px',
                      border: '1.5px solid #e0e0e0',
                      borderRadius: '8px', fontSize: '14px',
                      outline: 'none', fontFamily: 'inherit'
                    }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                  <button type="submit" style={{
                    background: '#0a0a0a', color: '#fff',
                    padding: '10px 16px', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                  }}>Ir</button>
                </form>
              )}
            </div>

            {/* USUARIO */}
            {usuario ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                {/* BOTÓN ADMIN */}
                {usuario.rol === 'admin' && (
                  <Link to="/admin" style={{
                    fontSize: '12px', fontWeight: '700', color: '#fff',
                    letterSpacing: '1px', textTransform: 'uppercase',
                    padding: '8px 16px', borderRadius: '100px',
                    background: '#2E7D32', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1B5E20'}
                    onMouseLeave={e => e.currentTarget.style.background = '#2E7D32'}>
                    <FiSettings size={14} /> Admin
                  </Link>
                )}

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#f5f5f5', padding: '6px 14px', borderRadius: '100px'
                }}>
                  <div style={{
                    width: '24px', height: '24px', background: '#0a0a0a',
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '11px', fontWeight: '700'
                  }}>
                    {usuario.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                    {usuario.nombre.split(' ')[0]}
                  </span>
                </div>

                <button onClick={handleLogout} style={{
                  fontSize: '12px', color: '#fff', background: '#0a0a0a',
                  letterSpacing: '1px', padding: '8px 16px',
                  borderRadius: '100px', fontWeight: '600', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#333'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                  Salir
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/login" style={{
                  fontSize: '12px', fontWeight: '600', color: '#333',
                  letterSpacing: '1px', textTransform: 'uppercase',
                  padding: '8px 16px', borderRadius: '100px',
                  border: '1.5px solid #e0e0e0', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#000'
                    e.currentTarget.style.color = '#000'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.color = '#333'
                  }}>
                  Iniciar sesión
                </Link>
                <Link to="/registro" style={{
                  fontSize: '12px', fontWeight: '700', color: '#fff',
                  letterSpacing: '1px', textTransform: 'uppercase',
                  padding: '8px 20px', borderRadius: '100px',
                  background: '#0a0a0a', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#333'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                  Crear cuenta
                </Link>
              </div>
            )}

            {/* CARRITO */}
            <Link to="/carrito" style={{ position: 'relative' }}>
              <FiShoppingBag size={20} color="#333" />
              {cantidad > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: '#0a0a0a', color: '#fff',
                  fontSize: '9px', fontWeight: '700',
                  width: '16px', height: '16px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{cantidad}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}