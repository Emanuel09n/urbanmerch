import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { FiArrowLeft, FiShoppingBag, FiPackage } from 'react-icons/fi'

export default function Producto() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregar } = useCart()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null)
  const [fotoActual, setFotoActual] = useState(0)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:3002/api/productos/${id}/detalle`)
      .then(res => {
        setProducto(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleAgregar = () => {
    if (!tallaSeleccionada) {
      alert('Por favor selecciona una talla')
      return
    }
    agregar({ ...producto, talla: tallaSeleccionada })
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', paddingTop: '70px',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <p style={{ color: '#888', fontSize: '16px' }}>Cargando producto...</p>
    </div>
  )

  if (!producto) return (
    <div style={{
      minHeight: '100vh', paddingTop: '70px',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <p style={{ color: '#888' }}>Producto no encontrado</p>
    </div>
  )

  const todasFotos = [
    producto.imagen,
    ...producto.fotos.map(f => f.url)
  ].filter(Boolean)

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' }}>

        {/* VOLVER */}
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: '#888', fontSize: '14px', background: 'none',
          marginBottom: '48px', transition: 'color 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#000'}
          onMouseLeave={e => e.currentTarget.style.color = '#888'}>
          <FiArrowLeft /> Volver al catálogo
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>

          {/* FOTOS */}
          <div>
            {/* FOTO PRINCIPAL */}
            <div style={{
              borderRadius: '24px', overflow: 'hidden',
              background: '#f8f8f8', marginBottom: '16px',
              height: '520px', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              {todasFotos.length > 0 ? (
                <img
                  src={todasFotos[fotoActual]}
                  alt={producto.nombre}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', transition: 'opacity 0.3s'
                  }}
                />
              ) : (
                <span style={{ fontSize: '100px', opacity: 0.3 }}>👕</span>
              )}
            </div>

            {/* MINIATURAS */}
            {todasFotos.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {todasFotos.map((foto, i) => (
                  <div key={i}
                    onClick={() => setFotoActual(i)}
                    style={{
                      width: '80px', height: '80px',
                      borderRadius: '12px', overflow: 'hidden',
                      cursor: 'pointer', border: fotoActual === i
                        ? '2px solid #000' : '2px solid transparent',
                      transition: 'border 0.2s'
                    }}>
                    <img src={foto} alt={`foto ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            {producto.categoria && (
              <p style={{
                fontSize: '11px', letterSpacing: '3px',
                textTransform: 'uppercase', color: '#999', marginBottom: '12px'
              }}>{producto.categoria}</p>
            )}

            <h1 style={{
              fontSize: '40px', fontWeight: '900',
              letterSpacing: '-1.5px', marginBottom: '16px', lineHeight: '1.1'
            }}>{producto.nombre}</h1>

            <p style={{
              fontSize: '36px', fontWeight: '900',
              letterSpacing: '-1px', marginBottom: '24px'
            }}>${Number(producto.precio).toLocaleString('es-CO')}</p>

            <p style={{
              fontSize: '15px', color: '#666',
              lineHeight: '1.8', marginBottom: '32px'
            }}>{producto.descripcion}</p>

            {/* STOCK */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '32px'
            }}>
              <FiPackage size={16} color="#888" />
              <span style={{ fontSize: '14px', color: '#888' }}>
                {producto.stock} unidades disponibles
              </span>
            </div>

            {/* TALLAS */}
            {producto.tallas.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '16px'
                }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Talla {tallaSeleccionada && `— ${tallaSeleccionada}`}
                  </p>
                  <p style={{ fontSize: '13px', color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>
                    Guía de tallas
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {producto.tallas.map(t => (
                    <button key={t.id}
                      onClick={() => setTallaSeleccionada(t.talla)}
                      style={{
                        width: '56px', height: '56px',
                        borderRadius: '12px', fontSize: '14px', fontWeight: '600',
                        border: tallaSeleccionada === t.talla
                          ? '2px solid #000' : '1.5px solid #e0e0e0',
                        background: tallaSeleccionada === t.talla ? '#000' : '#fff',
                        color: tallaSeleccionada === t.talla ? '#fff' : '#000',
                        cursor: 'pointer', transition: 'all 0.2s',
                        position: 'relative'
                      }}>
                      {t.talla}
                      <span style={{
                        position: 'absolute', bottom: '-20px', left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '10px', color: '#aaa', whiteSpace: 'nowrap'
                      }}>{t.stock} uds</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* BOTÓN AGREGAR */}
            <button onClick={handleAgregar} style={{
              width: '100%', padding: '20px',
              background: agregado ? '#00aa00' : '#0a0a0a',
              color: '#fff', fontSize: '14px', fontWeight: '700',
              letterSpacing: '2px', textTransform: 'uppercase',
              borderRadius: '14px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              gap: '10px', transition: 'all 0.3s', marginTop: '40px'
            }}>
              <FiShoppingBag size={18} />
              {agregado ? '¡Agregado al carrito! ✓' : 'Agregar al carrito'}
            </button>

            {/* DETALLES */}
            <div style={{
              marginTop: '40px', borderTop: '1px solid #f0f0f0', paddingTop: '32px'
            }}>
              {[
                { titulo: 'Material', desc: '100% algodón premium' },
                { titulo: 'Cuidado', desc: 'Lavar a máquina máx 30°C' },
                { titulo: 'Envío', desc: 'Gratis en tu primer pedido' },
                { titulo: 'Devoluciones', desc: '30 días sin preguntas' },
              ].map((d, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '12px 0', borderBottom: '1px solid #f8f8f8',
                  fontSize: '14px'
                }}>
                  <span style={{ fontWeight: '600' }}>{d.titulo}</span>
                  <span style={{ color: '#888' }}>{d.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}