import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { FiShoppingBag, FiSearch } from 'react-icons/fi'

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [agregadoId, setAgregadoId] = useState(null)
  const { agregar } = useCart()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const seccion = searchParams.get('seccion') || 'todos'
  const busquedaUrl = searchParams.get('busqueda') || ''

  const secciones = [
    { key: 'todos', label: 'Todo' },
    { key: 'hombre', label: 'Hombre' },
    { key: 'mujer', label: 'Mujer' },
    { key: 'sale', label: '🔥 Sale' },
  ]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (busquedaUrl) setBusqueda(busquedaUrl)
  }, [busquedaUrl])

  useEffect(() => {
    setLoading(true)
    let url = 'https://urbanmerch-production.up.railway.app/api/productos'
    if (seccion === 'hombre') url += '?genero=hombre'
    else if (seccion === 'mujer') url += '?genero=mujer'
    else if (seccion === 'sale') url += '?sale=true'
    axios.get(url)
      .then(res => { setProductos(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [seccion])

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#fff' }}>

      {/* HEADER */}
      <div style={{
        background: '#0a0a0a',
        padding: isMobile ? '48px 24px' : '80px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '11px', letterSpacing: '3px',
          color: '#666', textTransform: 'uppercase', marginBottom: '12px'
        }}>
          {seccion === 'todos' ? 'Toda nuestra ropa' :
           seccion === 'hombre' ? 'Colección masculina' :
           seccion === 'mujer' ? 'Colección femenina' : '🔥 Ofertas especiales'}
        </p>
        <h1 style={{
          fontSize: isMobile ? '36px' : '56px',
          fontWeight: '900', color: '#fff',
          letterSpacing: isMobile ? '-1px' : '-2px'
        }}>
          {seccion === 'todos' ? 'CATÁLOGO' :
           seccion === 'hombre' ? 'HOMBRE' :
           seccion === 'mujer' ? 'MUJER' : 'SALE'}
        </h1>
      </div>

      {/* FILTROS Y BUSCADOR */}
      <div style={{
        padding: isMobile ? '20px 16px' : '32px 80px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        gap: '16px', alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between'
      }}>
        {/* FILTROS */}
        <div style={{
          display: 'flex', gap: '8px',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          {secciones.map(s => (
            <button key={s.key}
              onClick={() => { setSearchParams({ seccion: s.key }); setBusqueda('') }}
              style={{
                padding: isMobile ? '8px 16px' : '10px 24px',
                background: seccion === s.key ? '#0a0a0a' : '#f5f5f5',
                color: s.key === 'sale' && seccion !== s.key ? '#cc0000' : seccion === s.key ? '#fff' : '#333',
                borderRadius: '100px', fontSize: isMobile ? '12px' : '13px',
                fontWeight: '600', letterSpacing: '1px', transition: 'all 0.2s',
                border: s.key === 'sale' && seccion !== s.key ? '1px solid #ffcccc' : 'none',
                flex: isMobile ? '1' : 'none'
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* BUSCADOR */}
        <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
          <FiSearch style={{
            position: 'absolute', left: '14px',
            top: '50%', transform: 'translateY(-50%)',
            color: '#888', fontSize: '16px'
          }} />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{
              padding: '12px 16px 12px 44px',
              border: '1.5px solid #e0e0e0',
              borderRadius: '100px', fontSize: '14px',
              outline: 'none',
              width: isMobile ? '100%' : '260px',
              transition: 'border 0.2s', boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#000'}
            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
      </div>

      {/* PRODUCTOS */}
      <div style={{ padding: isMobile ? '24px 16px' : '60px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
            Cargando productos...
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
            <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No hay productos</p>
            <p style={{ color: '#888' }}>Intenta con otra búsqueda</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: isMobile ? '16px' : '32px'
          }}>
            {filtrados.map(producto => (
              <div key={producto.id}
                onClick={() => navigate(`/producto/${producto.id}`)}
                style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid #f0f0f0', overflow: 'hidden',
                  transition: 'all 0.3s', cursor: 'pointer', position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>

                {producto.en_sale == 1 && (
                  <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: '#cc0000', color: '#fff',
                    fontSize: '10px', fontWeight: '700',
                    padding: '3px 10px', borderRadius: '100px',
                    zIndex: 1, letterSpacing: '1px'
                  }}>SALE</div>
                )}

                <div style={{
                  height: isMobile ? '160px' : '280px',
                  background: '#f5f5f5', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  {producto.imagen
                    ? <img src={producto.imagen} alt={producto.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: isMobile ? '48px' : '80px', opacity: 0.3 }}>👕</span>
                  }
                </div>

                <div style={{ padding: isMobile ? '12px' : '24px' }}>
                  {producto.categoria && (
                    <span style={{
                      fontSize: '10px', fontWeight: '600',
                      letterSpacing: '1px', textTransform: 'uppercase',
                      color: '#888', display: 'block', marginBottom: '4px'
                    }}>{producto.categoria}</span>
                  )}
                  <h3 style={{
                    fontSize: isMobile ? '13px' : '18px',
                    fontWeight: '700', marginBottom: '4px',
                    letterSpacing: '-0.3px',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>{producto.nombre}</h3>

                  {!isMobile && (
                    <p style={{
                      fontSize: '13px', color: '#888',
                      lineHeight: '1.6', marginBottom: '16px'
                    }}>{producto.descripcion}</p>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: isMobile ? '8px' : '0'
                  }}>
                    <span style={{
                      fontSize: isMobile ? '15px' : '22px',
                      fontWeight: '800', letterSpacing: '-0.5px',
                      color: producto.en_sale == 1 ? '#cc0000' : '#000'
                    }}>
                      ${Number(producto.precio).toLocaleString('es-CO')}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        agregar(producto)
                        setAgregadoId(producto.id)
                        setTimeout(() => setAgregadoId(null), 2000)
                      }}
                      style={{
                        background: agregadoId === producto.id ? '#00aa00' : '#0a0a0a',
                        color: '#fff',
                        padding: isMobile ? '8px 10px' : '12px 20px',
                        borderRadius: '8px',
                        fontSize: isMobile ? '11px' : '13px',
                        fontWeight: '600',
                        display: 'flex', alignItems: 'center',
                        gap: isMobile ? '4px' : '8px',
                        transition: 'all 0.3s'
                      }}>
                      <FiShoppingBag size={isMobile ? 13 : 16} />
                      {isMobile
                        ? agregadoId === producto.id ? '✓' : ''
                        : agregadoId === producto.id ? '¡Agregado! ✓' : 'Agregar'
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}