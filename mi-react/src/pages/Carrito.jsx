import { useState } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiTag } from 'react-icons/fi'

export default function Carrito() {
  const { carrito, eliminar, vaciar, total } = useCart()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [cupon, setCupon] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState(null)
  const [cuponError, setCuponError] = useState('')
  const [loadingCupon, setLoadingCupon] = useState(false)

  const totalFinal = cuponAplicado ? cuponAplicado.total_final : total
  const descuento = cuponAplicado ? cuponAplicado.descuento : 0

  const aplicarCupon = async () => {
    if (!cupon.trim()) return
    setLoadingCupon(true)
    setCuponError('')
    setCuponAplicado(null)
    try {
      const res = await axios.post('http://localhost:3002/api/cupones/validar', {
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
    try {
      // Usar cupón si hay uno
      if (cuponAplicado) {
        await axios.post('http://localhost:3002/api/cupones/usar', { codigo: cuponAplicado.codigo })
      }
      const res = await axios.post('http://localhost:3002/api/pagos/crear-preferencia', {
        productos: carrito.map(p => ({
          id: p.id, nombre: p.nombre,
          cantidad: p.cantidad, precio: p.precio
        })),
        usuario: { email: usuario.email },
        descuento: descuento
      })
      window.location.href = res.data.init_point
    } catch (err) {
      alert('Error al procesar el pago, intenta de nuevo')
      console.error(err)
    }
  }

  if (carrito.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', paddingTop: '70px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#fff'
      }}>
        <span style={{ fontSize: '80px', marginBottom: '24px' }}>🛍️</span>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-1px' }}>
          Tu carrito está vacío
        </h2>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '15px' }}>
          Agrega productos para continuar
        </p>
        <Link to="/catalogo" style={{
          background: '#0a0a0a', color: '#fff', padding: '16px 40px',
          borderRadius: '10px', fontSize: '14px', fontWeight: '700',
          letterSpacing: '2px', textTransform: 'uppercase'
        }}>Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '70px', background: '#f5f5f5' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <Link to="/catalogo" style={{
            display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '14px'
          }}>
            <FiArrowLeft /> Seguir comprando
          </Link>
        </div>

        <h1 style={{ fontSize: '48px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '48px' }}>
          Mi carrito
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>

          {/* PRODUCTOS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {carrito.map(item => (
              <div key={item.id} style={{
                background: '#fff', borderRadius: '16px',
                padding: '24px', display: 'flex', gap: '20px', alignItems: 'center'
              }}>
                <div style={{
                  width: '80px', height: '80px', background: '#f5f5f5',
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
                }}>
                  {item.imagen
                    ? <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '32px' }}>👕</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{item.nombre}</h3>
                  <p style={{ color: '#888', fontSize: '13px' }}>Cantidad: {item.cantidad}</p>
                  {item.talla && <p style={{ color: '#888', fontSize: '13px' }}>Talla: {item.talla}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                    ${Number(item.precio * item.cantidad).toLocaleString('es-CO')}
                  </p>
                  <button onClick={() => eliminar(item.id)} style={{
                    background: '#fff0f0', color: '#cc0000', padding: '6px 12px',
                    borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <FiTrash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RESUMEN */}
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px',
            height: 'fit-content', position: 'sticky', top: '90px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '32px', letterSpacing: '-0.5px' }}>
              Resumen del pedido
            </h2>

            {/* CUPÓN */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '12px', fontWeight: '700', letterSpacing: '1px',
                textTransform: 'uppercase', marginBottom: '10px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <FiTag size={14} /> Cupón de descuento
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
                        : `$${Number(cuponAplicado.valor).toLocaleString('es-CO')} de descuento`}
                    </p>
                  </div>
                  <button onClick={() => { setCuponAplicado(null); setCupon('') }} style={{
                    background: 'none', color: '#cc0000', fontSize: '18px', fontWeight: '700'
                  }}>✕</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Ej: URBAN15"
                    value={cupon}
                    onChange={e => { setCupon(e.target.value.toUpperCase()); setCuponError('') }}
                    onKeyDown={e => e.key === 'Enter' && aplicarCupon()}
                    style={{
                      flex: 1, padding: '10px 14px', border: '1.5px solid #e0e0e0',
                      borderRadius: '8px', fontSize: '14px', outline: 'none',
                      fontFamily: 'inherit', letterSpacing: '1px', textTransform: 'uppercase',
                      transition: 'border 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                  <button onClick={aplicarCupon} disabled={loadingCupon} style={{
                    background: '#0a0a0a', color: '#fff', padding: '10px 16px',
                    borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                    transition: 'all 0.2s', whiteSpace: 'nowrap'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#333'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                    {loadingCupon ? '...' : 'Aplicar'}
                  </button>
                </div>
              )}
              {cuponError && (
                <p style={{ color: '#cc0000', fontSize: '12px', marginTop: '8px' }}>❌ {cuponError}</p>
              )}
            </div>

            {/* TOTALES */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#666' }}>
              <span>Subtotal</span>
              <span>${Number(total).toLocaleString('es-CO')}</span>
            </div>

            {descuento > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#00aa00' }}>
                <span>Descuento ({cuponAplicado.codigo})</span>
                <span>-${Number(descuento).toLocaleString('es-CO')}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#666' }}>
              <span>Envío</span>
              <span style={{ color: '#00aa00', fontWeight: '600' }}>Gratis</span>
            </div>

            <div style={{
              borderTop: '1px solid #f0f0f0', paddingTop: '16px',
              marginTop: '16px', display: 'flex',
              justifyContent: 'space-between', marginBottom: '32px'
            }}>
              <span style={{ fontSize: '18px', fontWeight: '800' }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1px' }}>
                ${Number(totalFinal).toLocaleString('es-CO')}
              </span>
            </div>

            <button onClick={handlePagar} style={{
              width: '100%', padding: '18px', background: '#0a0a0a', color: '#fff',
              fontSize: '14px', fontWeight: '700', letterSpacing: '2px',
              textTransform: 'uppercase', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', transition: 'all 0.3s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
              <FiShoppingBag size={18} /> Pagar ahora
            </button>

            <button onClick={vaciar} style={{
              width: '100%', padding: '14px', background: 'transparent',
              color: '#888', fontSize: '13px', marginTop: '12px',
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