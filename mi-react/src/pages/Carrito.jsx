import { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiTag, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'

export default function Carrito() {
  const { carrito, eliminar, vaciar, total } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [cupon, setCupon] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState(null)
  const [cuponError, setCuponError] = useState('')
  const [loadingCupon, setLoadingCupon] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [envio, setEnvio] = useState({
    nombre: '', direccion: '', ciudad: '', telefono: ''
  })
  const [envioError, setEnvioError] = useState('')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prellenar nombre si está logueado
  useEffect(() => {
    if (usuario) setEnvio(prev => ({ ...prev, nombre: usuario.nombre }))
  }, [usuario])

  const totalFinal = cuponAplicado ? cuponAplicado.total_final : total
  const descuento = cuponAplicado ? cuponAplicado.descuento : 0

  const aplicarCupon = async () => {
    if (!cupon.trim()) return
    setLoadingCupon(true)
    setCuponError('')
    setCuponAplicado(null)
    try {
      const res = await axios.post('https://urbanmerch-production.up.railway.app/api/cupones/validar', {
        codigo: cupon, total
      })
      setCuponAplicado(res.data.cupon)
    } catch (err) {
      setCuponError(err.response?.data?.error || 'Cupón inválido')
    }
    setLoadingCupon(false)
  }

  const handlePagar = async () => {
    if (!usuario) { navigate('/login'); return }

    // Validar envío
    if (!envio.nombre || !envio.direccion || !envio.ciudad || !envio.telefono) {
      setEnvioError('Por favor completa todos los datos de envío')
      document.getElementById('form-envio').scrollIntoView({ behavior: 'smooth' })
      return
    }
    setEnvioError('')

    try {
      if (cuponAplicado) {
        await axios.post('https://urbanmerch-production.up.railway.app/api/cupones/usar', { codigo: cuponAplicado.codigo })
      }
      const res = await axios.post('https://urbanmerch-production.up.railway.app/api/pagos/crear-preferencia', {
        productos: carrito.map(p => ({
          id: p.id, nombre: p.nombre, cantidad: p.cantidad, precio: p.precio
        })),
        usuario: {
          email: usuario.email,
          nombre: envio.nombre
        },
        envio,
        descuento: descuento
      })
      window.location.href = res.data.init_point
    } catch (err) {
      alert('Error al procesar el pago, intenta de nuevo')
    }
  }

  if (carrito.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', paddingTop: '70px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#fff',
        padding: '40px 24px'
      }}>
        <span style={{ fontSize: '72px', marginBottom: '20px' }}>🛍️</span>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px' }}>
          Tu carrito está vacío
        </h2>
        <p style={{ color: '#888', marginBottom: '32px', fontSize: '14px', textAlign: 'center' }}>
          Agrega productos para continuar
        p>
        <Link to="/catalogo" style={{
          background: '#0a0a0a', color: '#fff', padding: '14px 36px',
          borderRadius: '10px', fontSize: '13px', fontWeight: '700',
          letterSpacing: '2px', textTransform: 'uppercase'
        }}>Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '70px', background: '#f5f5f5' }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: isMobile ? '24px 16px' : '60px 40px'
      }}>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Link to="/catalogo" style={{
            display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '14px'
          }}>
            <FiArrowLeft /> Seguir comprando
          </Link>
        </div>

        <h1 style={{
          fontSize: isMobile ? '32px' : '48px',
          fontWeight: '900', letterSpacing: '-2px', marginBottom: '32px'
        }}>
          Mi carrito
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
          gap: '24px'
        }}>

          {/* IZQUIERDA — PRODUCTOS + FORMULARIO ENVÍO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* PRODUCTOS */}
            {carrito.map(item => (
              <div key={item.id} style={{
                background: '#fff', borderRadius: '16px',
                padding: isMobile ? '16px' : '24px',
                display: 'flex', gap: '16px', alignItems: 'center'
              }}>
                <div style={{
                  width: isMobile ? '64px' : '80px',
                  height: isMobile ? '64px' : '80px',
                  background: '#f5f5f5', borderRadius: '10px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
                }}>
                  {item.imagen
                    ? <img src={item.imagen} alt={item.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '28px' }}>👕</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '700', marginBottom: '4px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{item.nombre}</h3>
                  <p style={{ color: '#888', fontSize: '12px' }}>Cant: {item.cantidad}</p>
                  {item.talla && <p style={{ color: '#888', fontSize: '12px' }}>Talla: {item.talla}</p>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{
                    fontSize: isMobile ? '15px' : '20px',
                    fontWeight: '800', marginBottom: '8px'
                  }}>
                    ${Number(item.precio * item.cantidad).toLocaleString('es-CO')}
                  </p>
                  <button onClick={() => eliminar(item.id)} style={{
                    background: '#fff0f0', color: '#cc0000',
                    padding: '6px 10px', borderRadius: '8px',
                    fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <FiTrash2 size={13} />
                    {!isMobile && 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}

            {/* FORMULARIO DE ENVÍO */}
            <div id="form-envio" style={{
              background: '#fff', borderRadius: '16px',
              padding: isMobile ? '20px' : '28px'
            }}>
              <h2 style={{
                fontSize: '18px', fontWeight: '800',
                marginBottom: '20px', letterSpacing: '-0.5px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <FiMapPin size={20} /> Datos de envío
              </h2>

              {envioError && (
                <div style={{
                  background: '#fff0f0', border: '1px solid #ffcccc',
                  borderRadius: '8px', padding: '12px 16px',
                  color: '#cc0000', fontSize: '13px', marginBottom: '16px'
                }}>❌ {envioError}</div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                {/* NOMBRE */}
                <div>
                  <label style={{
                    fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                    textTransform: 'uppercase', color: '#333', display: 'flex',
                    alignItems: 'center', gap: '6px', marginBottom: '8px'
                  }}>
                    <FiUser size={12} /> Nombre completo
                  </label>
                  <input
                    type="text" placeholder="Tu nombre completo"
                    value={envio.nombre}
                    onChange={e => setEnvio({ ...envio, nombre: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: '1.5px solid #e0e0e0', borderRadius: '10px',
                      fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box', transition: 'border 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* TELÉFONO */}
                <div>
                  <label style={{
                    fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                    textTransform: 'uppercase', color: '#333', display: 'flex',
                    alignItems: 'center', gap: '6px', marginBottom: '8px'
                  }}>
                    <FiPhone size={12} /> Teléfono
                  </label>
                  <input
                    type="tel" placeholder="300 000 0000"
                    value={envio.telefono}
                    onChange={e => setEnvio({ ...envio, telefono: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: '1.5px solid #e0e0e0', borderRadius: '10px',
                      fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box', transition: 'border 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* CIUDAD */}
                <div>
                  <label style={{
                    fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                    textTransform: 'uppercase', color: '#333', display: 'flex',
                    alignItems: 'center', gap: '6px', marginBottom: '8px'
                  }}>
                    <FiMapPin size={12} /> Ciudad
                  </label>
                  <input
                    type="text" placeholder="Tu ciudad"
                    value={envio.ciudad}
                    onChange={e => setEnvio({ ...envio, ciudad: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: '1.5px solid #e0e0e0', borderRadius: '10px',
                      fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box', transition: 'border 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* DIRECCIÓN */}
                <div>
                  <label style={{
                    fontSize: '11px', fontWeight: '700', letterSpacing: '1px',
                    textTransform: 'uppercase', color: '#333', display: 'flex',
                    alignItems: 'center', gap: '6px', marginBottom: '8px'
                  }}>
                    <FiMapPin size={12} /> Dirección
                  </label>
                  <input
                    type="text" placeholder="Calle 00 # 00-00"
                    value={envio.direccion}
                    onChange={e => setEnvio({ ...envio, direccion: e.target.value })}
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: '1.5px solid #e0e0e0', borderRadius: '10px',
                      fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box', transition: 'border 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RESUMEN */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: isMobile ? '20px' : '32px',
            height: 'fit-content',
            position: isMobile ? 'relative' : 'sticky',
            top: isMobile ? 'auto' : '90px'
          }}>
            <h2 style={{
              fontSize: '18px', fontWeight: '800',
              marginBottom: '24px', letterSpacing: '-0.5px'
            }}>
              Resumen del pedido
            </h2>

            {/* CUPÓN */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{
                fontSize: '12px', fontWeight: '700', letterSpacing: '1px',
                textTransform: 'uppercase', marginBottom: '10px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <FiTag size={13} /> Cupón de descuento
              </p>
              {cuponAplicado ? (
                <div style={{
                  background: '#f0fff0', border: '1px solid #00aa00',
                  borderRadius: '10px', padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontWeight: '700', color: '#00aa00', fontSize: '14px' }}>
                      ✅ {cuponAplicado.codigo}
                    </p>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      {cuponAplicado.tipo === 'porcentaje'
                        ? `${cuponAplicado.valor}% de descuento`
                        : `$${Number(cuponAplicado.valor).toLocaleString('es-CO')} off`}
                    </p>
                  </div>
                  <button onClick={() => { setCuponAplicado(null); setCupon('') }} style={{
                    background: 'none', color: '#cc0000', fontSize: '18px', fontWeight: '700'
                  }}>✕</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text" placeholder="Ej: URBAN15"
                    value={cupon}
                    onChange={e => { setCupon(e.target.value.toUpperCase()); setCuponError('') }}
                    onKeyDown={e => e.key === 'Enter' && aplicarCupon()}
                    style={{
                      flex: 1, padding: '10px 12px',
                      border: '1.5px solid #e0e0e0', borderRadius: '8px',
                      fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                      letterSpacing: '1px', textTransform: 'uppercase'
                    }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                  <button onClick={aplicarCupon} disabled={loadingCupon} style={{
                    background: '#0a0a0a', color: '#fff', padding: '10px 14px',
                    borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    {loadingCupon ? '...' : 'Aplicar'}
                  </button>
                </div>
              )}
              {cuponError && (
                <p style={{ color: '#cc0000', fontSize: '12px', marginTop: '8px' }}>❌ {cuponError}</p>
              )}
            </div>

            {/* TOTALES */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
              <span>Subtotal</span>
              <span>${Number(total).toLocaleString('es-CO')}</span>
            </div>

            {descuento > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#00aa00' }}>
                <span>Descuento</span>
                <span>-${Number(descuento).toLocaleString('es-CO')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
              <span>Envío</span>
              <span style={{ color: '#00aa00', fontWeight: '600' }}>Gratis</span>
            </div>

            <div style={{
              borderTop: '1px solid #f0f0f0', paddingTop: '14px',
              marginTop: '14px', display: 'flex',
              justifyContent: 'space-between', marginBottom: '24px'
            }}>
              <span style={{ fontSize: '16px', fontWeight: '800' }}>Total</span>
              <span style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '900', letterSpacing: '-1px' }}>
                ${Number(totalFinal).toLocaleString('es-CO')}
              </span>
            </div>

            {/* RESUMEN ENVÍO */}
            {envio.direccion && (
              <div style={{
                background: '#f8f8f8', borderRadius: '10px',
                padding: '12px 16px', marginBottom: '16px',
                fontSize: '13px', color: '#666'
              }}>
                <p style={{ fontWeight: '700', color: '#333', marginBottom: '4px' }}>📦 Enviar a:</p>
                <p>{envio.nombre}</p>
                <p>{envio.direccion}, {envio.ciudad}</p>
                <p>{envio.telefono}</p>
              </div>
            )}

            <button onClick={handlePagar} style={{
              width: '100%', padding: '16px', background: '#0a0a0a', color: '#fff',
              fontSize: '13px', fontWeight: '700', letterSpacing: '2px',
              textTransform: 'uppercase', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <FiShoppingBag size={17} /> Pagar ahora
            </button>

            <button onClick={vaciar} style={{
              width: '100%', padding: '12px', background: 'transparent',
              color: '#888', fontSize: '13px', marginTop: '10px',
              borderRadius: '10px', border: '1px solid #e0e0e0'
            }}>
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}