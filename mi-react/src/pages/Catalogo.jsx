import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { FiShoppingBag, FiSearch } from 'react-icons/fi'

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
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
    if (busquedaUrl) setBusqueda(busquedaUrl)
  }, [busquedaUrl])

  useEffect(() => {
    setLoading(true)
    let url = 'http://localhost:3002/api/productos'
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
      <div style={{ background: '#0a0a0a', padding: '80px', textAlign: 'center' }}>
        <p style={{
          fontSize: '12px', letterSpacing: '4px',
          color: '#666', textTransform: 'uppercase', marginBottom: '16px'
        }}>
          {seccion === 'todos' ? 'Toda nuestra ropa' :
           seccion === 'hombre' ? 'Colección masculina' :
           seccion === 'mujer' ? 'Colección femenina' : '🔥 Ofertas especiales'}
        </p>
        <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#fff', letterSpacing: '-2px' }}>
          {seccion === 'todos' ? 'CATÁLOGO' :
           seccion === 'hombre' ? 'HOMBRE' :
           seccion === 'mujer' ? 'MUJER' : 'SALE'}
        </h1>
      </div>

      {/* FILTROS Y BUSCADOR */}
      <div style={{
        padding: '32px 80px', borderBottom: '1px solid #f0f0f0',
        display: 'flex', gap: '24px', alignItems: 'center',
        flexWrap: 'wrap', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {secciones.map(s => (
            <button key={s.key}
              onClick={() => { setSearchParams({ seccion: s.key }); setBusqueda('') }}
              style={{
                padding: '10px 24px',
                background: seccion === s.key ? '#0a0a0a' : '#f5f5f5',
                color: s.key === 'sale' && seccion !== s.key ? '#cc0000' : seccion === s.key ? '#fff' : '#333',
                borderRadius: '100px', fontSize: '13px',
                fontWeight: '600', letterSpacing: '1px',
                transition: 'all 0.2s',
                border: s.key === 'sale' && seccion !== s.key ? '1px solid #ffcccc' : 'none'
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* BUSCADOR */}
        <div style={{ position: 'relative' }}>
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
              outline: 'none', width: '260px',
              transition: 'border 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#000'}
            onBlur={e => e.target.style.borderColor = '#e0e0e0'}
          />
        </div>
      </div>

      {/* PRODUCTOS */}
      <div style={{ padding: '60px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>
            Cargando productos...
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
            <p style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              No hay productos
            </p>
            <p style={{ color: '#888' }}>Intenta con otra búsqueda</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {filtrados.map(producto => (
              <div key={producto.id}
                onClick={() => navigate(`/producto/${producto.id}`)}
                style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid #f0f0f0', overflow: 'hidden',
                  transition: 'all 0.3s', cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>

                {/* BADGE SALE */}
                {producto.en_sale == 1 && (
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: '#cc0000', color: '#fff',
                    fontSize: '11px', fontWeight: '700',
                    padding: '4px 12px', borderRadius: '100px',
                    zIndex: 1, letterSpacing: '1px'
                  }}>SALE</div>
                )}

                <div style={{
                  height: '280px', background: '#f5f5f5',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', overflow: 'hidden'
                }}>
                  {producto.imagen ? (
                    <img src={producto.imagen} alt={producto.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '80px', opacity: 0.3 }}>👕</span>
                  )}
                </div>

                <div style={{ padding: '24px' }}>
                  {producto.categoria && (
                    <span style={{
                      fontSize: '11px', fontWeight: '600',
                      letterSpacing: '2px', textTransform: 'uppercase',
                      color: '#888', display: 'block', marginBottom: '8px'
                    }}>{producto.categoria}</span>
                  )}
                  <h3 style={{
                    fontSize: '18px', fontWeight: '700',
                    marginBottom: '8px', letterSpacing: '-0.5px'
                  }}>{producto.nombre}</h3>
                  <p style={{
                    fontSize: '13px', color: '#888',
                    lineHeight: '1.6', marginBottom: '20px'
                  }}>{producto.descripcion}</p>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      {producto.precio_antes && (
                        <span style={{
                          fontSize: '14px', color: '#aaa',
                          textDecoration: 'line-through', display: 'block'
                        }}>
                          ${Number(producto.precio_antes).toLocaleString('es-CO')}
                        </span>
                      )}
                      <span style={{
                        fontSize: '22px', fontWeight: '800', letterSpacing: '-1px',
                        color: producto.en_sale ? '#cc0000' : '#000'
                      }}>
                        ${Number(producto.precio).toLocaleString('es-CO')}
                      </span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); agregar(producto) }}
                      style={{
                        background: '#0a0a0a', color: '#fff',
                        padding: '12px 20px', borderRadius: '10px',
                        fontSize: '13px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#333'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                      <FiShoppingBag size={16} /> Agregar
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