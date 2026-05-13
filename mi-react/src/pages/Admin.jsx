import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign,
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
  FiBarChart2, FiTag, FiTrendingUp
} from 'react-icons/fi'

export default function Admin() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('dashboard')
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [cupones, setCupones] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalProducto, setModalProducto] = useState(false)
  const [modalCupon, setModalCupon] = useState(false)
  const [productoEdit, setProductoEdit] = useState(null)
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '',
    stock: '', imagen: '', categoria_id: '', genero: 'unisex'
  })
  const [formCupon, setFormCupon] = useState({
    codigo: '', tipo: 'porcentaje', valor: '',
    minimo: '', usos_max: '100', expira: ''
  })

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') { navigate('/'); return }
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [prods, cats, anal, cups] = await Promise.all([
        axios.get('http://localhost:3002/api/productos'),
        axios.get('http://localhost:3002/api/categorias'),
        axios.get('http://localhost:3002/api/analytics'),
        axios.get('http://localhost:3002/api/cupones'),
      ])
      setProductos(prods.data)
      setCategorias(cats.data)
      setAnalytics(anal.data)
      setCupones(cups.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const abrirModal = (producto = null) => {
    if (producto) {
      setProductoEdit(producto)
      setForm({
        nombre: producto.nombre, descripcion: producto.descripcion || '',
        precio: producto.precio, stock: producto.stock,
        imagen: producto.imagen || '', categoria_id: producto.categoria_id || '',
        genero: producto.genero || 'unisex'
      })
    } else {
      setProductoEdit(null)
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '', categoria_id: '', genero: 'unisex' })
    }
    setModalProducto(true)
  }

  const guardarProducto = async () => {
    try {
      if (productoEdit) await axios.put(`http://localhost:3002/api/productos/${productoEdit.id}`, form)
      else await axios.post('http://localhost:3002/api/productos', form)
      setModalProducto(false)
      cargarDatos()
    } catch (err) { alert('Error guardando producto') }
  }

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    try {
      await axios.delete(`http://localhost:3002/api/productos/${id}`)
      cargarDatos()
    } catch (err) { alert('Error eliminando producto') }
  }

  const guardarCupon = async () => {
    try {
      await axios.post('http://localhost:3002/api/cupones', formCupon)
      setModalCupon(false)
      setFormCupon({ codigo: '', tipo: 'porcentaje', valor: '', minimo: '', usos_max: '100', expira: '' })
      cargarDatos()
    } catch (err) { alert('Error guardando cupón') }
  }

  const eliminarCupon = async (id) => {
    if (!window.confirm('¿Eliminar este cupón?')) return
    try {
      await axios.delete(`http://localhost:3002/api/cupones/${id}`)
      cargarDatos()
    } catch (err) { alert('Error eliminando cupón') }
  }

  const totalVentas = analytics?.totalVentas?.[0]?.total || 0
  const totalPedidos = analytics?.totalPedidos?.[0]?.total || 0
  const totalUsuarios = analytics?.totalUsuarios?.[0]?.total || 0
  const totalProductos = analytics?.totalProductos?.[0]?.total || 0

  const statsCards = [
    { icon: <FiDollarSign size={22} />, label: 'Ventas totales', valor: `$${Number(totalVentas).toLocaleString('es-CO')}`, color: '#00aa00', bg: '#e8f5e9' },
    { icon: <FiShoppingBag size={22} />, label: 'Pedidos', valor: totalPedidos, color: '#0066cc', bg: '#e3f2fd' },
    { icon: <FiUsers size={22} />, label: 'Clientes', valor: totalUsuarios, color: '#9c27b0', bg: '#f3e5f5' },
    { icon: <FiPackage size={22} />, label: 'Productos', valor: totalProductos, color: '#ff6f00', bg: '#fff3e0' },
  ]

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 size={18} /> },
    { key: 'productos', label: 'Productos', icon: <FiPackage size={18} /> },
    { key: 'cupones', label: 'Cupones', icon: <FiTag size={18} /> },
    { key: 'categorias', label: 'Categorías', icon: <FiShoppingBag size={18} /> },
  ]

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8f8f8', display: 'flex' }}>

      {/* SIDEBAR */}
      <div style={{
        width: '260px', background: '#0a0a0a',
        minHeight: 'calc(100vh - 70px)',
        padding: '32px 0', position: 'sticky',
        top: '70px', flexShrink: 0
      }}>
        <div style={{ padding: '0 24px', marginBottom: '40px' }}>
          <p style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Panel Admin
          </p>
          <p style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>{usuario?.nombre}</p>
          <p style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>Administrador</p>
        </div>

        {menuItems.map(item => (
          <button key={item.key} onClick={() => setSeccion(item.key)} style={{
            width: '100%', padding: '14px 24px',
            display: 'flex', alignItems: 'center', gap: '12px',
            background: seccion === item.key ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: seccion === item.key ? '#fff' : '#666',
            fontSize: '14px', fontWeight: '500',
            borderLeft: seccion === item.key ? '3px solid #fff' : '3px solid transparent',
            transition: 'all 0.2s', textAlign: 'left'
          }}>
            {item.icon} {item.label}
          </button>
        ))}

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
          <button onClick={() => navigate('/')} style={{
            width: '100%', padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            color: '#666', fontSize: '13px', borderRadius: '8px', transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            ← Volver a la tienda
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>

        {/* ── DASHBOARD ── */}
        {seccion === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ color: '#888', marginBottom: '40px' }}>Resumen de tu tienda URBANMERCH</p>

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px', marginBottom: '32px' }}>
              {statsCards.map((s, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: '16px',
                  padding: '28px', border: '1px solid #f0f0f0',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{
                    width: '48px', height: '48px', background: s.bg,
                    borderRadius: '12px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: s.color, marginBottom: '16px'
                  }}>{s.icon}</div>
                  <p style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '4px' }}>
                    {s.valor}
                  </p>
                  <p style={{ fontSize: '13px', color: '#888' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* PRODUCTOS MÁS VENDIDOS */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #f0f0f0' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiTrendingUp size={18} /> Más vendidos
                </h2>
                {analytics?.productosMasVendidos?.length > 0 ? (
                  analytics.productosMasVendidos.map((p, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 0', borderBottom: '1px solid #f8f8f8'
                    }}>
                      <span style={{
                        width: '24px', height: '24px', background: '#0a0a0a',
                        color: '#fff', borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: '700', flexShrink: 0
                      }}>{i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '600' }}>{p.nombre}</p>
                      </div>
                      <span style={{
                        background: '#e8f5e9', color: '#2e7d32',
                        padding: '4px 10px', borderRadius: '100px',
                        fontSize: '12px', fontWeight: '700'
                      }}>{p.vendidos} vendidos</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                    Aún no hay ventas registradas
                  </p>
                )}
              </div>

              {/* CLIENTES RECIENTES */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #f0f0f0' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiUsers size={18} /> Clientes recientes
                </h2>
                {analytics?.clientesRecientes?.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 0', borderBottom: '1px solid #f8f8f8'
                  }}>
                    <div style={{
                      width: '36px', height: '36px', background: '#0a0a0a',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#fff', fontSize: '14px',
                      fontWeight: '700', flexShrink: 0
                    }}>{c.nombre.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: '600' }}>{c.nombre}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{c.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PEDIDOS POR ESTADO */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #f0f0f0', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Estado de pedidos</h2>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { estado: 'pendiente', color: '#ff6f00', bg: '#fff3e0' },
                  { estado: 'pagado', color: '#00aa00', bg: '#e8f5e9' },
                  { estado: 'enviado', color: '#0066cc', bg: '#e3f2fd' },
                  { estado: 'entregado', color: '#9c27b0', bg: '#f3e5f5' },
                ].map(({ estado, color, bg }) => {
                  const data = analytics?.pedidosPorEstado?.find(p => p.estado === estado)
                  return (
                    <div key={estado} style={{
                      flex: 1, minWidth: '120px', background: bg,
                      borderRadius: '12px', padding: '20px', textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '28px', fontWeight: '900', color, marginBottom: '4px' }}>
                        {data?.cantidad || 0}
                      </p>
                      <p style={{ fontSize: '12px', color, textTransform: 'capitalize', fontWeight: '600' }}>
                        {estado}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* TABLA PRODUCTOS */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px' }}>Productos recientes</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    {['Producto', 'Categoría', 'Precio', 'Stock', 'Estado'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: '11px', fontWeight: '700',
                        letterSpacing: '1px', textTransform: 'uppercase', color: '#888'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productos.slice(0, 5).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                      <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px', height: '40px', background: '#f5f5f5',
                          borderRadius: '8px', overflow: 'hidden', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {p.imagen
                            ? <img src={p.imagen} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontSize: '20px' }}>👕</span>
                          }
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{p.nombre}</span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#888' }}>{p.categoria || '—'}</td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700' }}>
                        ${Number(p.precio).toLocaleString('es-CO')}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{p.stock}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '100px',
                          fontSize: '11px', fontWeight: '700',
                          background: p.stock > 0 ? '#e8f5e9' : '#ffebee',
                          color: p.stock > 0 ? '#2e7d32' : '#c62828'
                        }}>
                          {p.stock > 0 ? 'Disponible' : 'Sin stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PRODUCTOS ── */}
        {seccion === 'productos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '4px' }}>Productos</h1>
                <p style={{ color: '#888' }}>{productos.length} productos en total</p>
              </div>
              <button onClick={() => abrirModal()} style={{
                background: '#0a0a0a', color: '#fff', padding: '14px 24px',
                borderRadius: '12px', fontSize: '14px', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                <FiPlus size={18} /> Agregar producto
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {productos.map(p => (
                <div key={p.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                  <div style={{
                    height: '180px', background: '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                  }}>
                    {p.imagen
                      ? <img src={p.imagen} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '60px', opacity: 0.3 }}>👕</span>
                    }
                    {p.en_sale == 1 && (
                      <span style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: '#cc0000', color: '#fff', fontSize: '10px',
                        fontWeight: '700', padding: '3px 10px', borderRadius: '100px'
                      }}>SALE</span>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <p style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{p.nombre}</p>
                    <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                      Stock: {p.stock} — ${Number(p.precio).toLocaleString('es-CO')}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => abrirModal(p)} style={{
                        flex: 1, padding: '8px', background: '#f5f5f5',
                        borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e0e0e0'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>
                        <FiEdit2 size={14} /> Editar
                      </button>
                      <button onClick={() => eliminarProducto(p.id)} style={{
                        padding: '8px 12px', background: '#fff0f0',
                        borderRadius: '8px', color: '#cc0000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#ffdddd'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff0f0'}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CUPONES ── */}
        {seccion === 'cupones' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '4px' }}>Cupones</h1>
                <p style={{ color: '#888' }}>{cupones.length} cupones activos</p>
              </div>
              <button onClick={() => setModalCupon(true)} style={{
                background: '#0a0a0a', color: '#fff', padding: '14px 24px',
                borderRadius: '12px', fontSize: '14px', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#333'}
                onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
                <FiPlus size={18} /> Crear cupón
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f8f8', borderBottom: '1px solid #f0f0f0' }}>
                    {['Código', 'Tipo', 'Valor', 'Mínimo', 'Usos', 'Estado', ''].map(h => (
                      <th key={h} style={{
                        padding: '14px 16px', textAlign: 'left',
                        fontSize: '11px', fontWeight: '700',
                        letterSpacing: '1px', textTransform: 'uppercase', color: '#888'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cupones.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: '#f5f5f5', padding: '6px 12px',
                          borderRadius: '8px', fontWeight: '700',
                          fontSize: '14px', letterSpacing: '1px'
                        }}>{c.codigo}</span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#888', textTransform: 'capitalize' }}>
                        {c.tipo}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', color: '#00aa00' }}>
                        {c.tipo === 'porcentaje' ? `${c.valor}%` : `$${Number(c.valor).toLocaleString('es-CO')}`}
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#888' }}>
                        {c.minimo > 0 ? `$${Number(c.minimo).toLocaleString('es-CO')}` : 'Sin mínimo'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px' }}>
                        {c.usos_actuales}/{c.usos_max}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '100px',
                          fontSize: '11px', fontWeight: '700',
                          background: c.activo ? '#e8f5e9' : '#ffebee',
                          color: c.activo ? '#2e7d32' : '#c62828'
                        }}>
                          {c.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button onClick={() => eliminarCupon(c.id)} style={{
                          background: '#fff0f0', color: '#cc0000',
                          padding: '6px 10px', borderRadius: '8px',
                          display: 'flex', alignItems: 'center'
                        }}>
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CATEGORIAS ── */}
        {seccion === 'categorias' && (
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', marginBottom: '8px' }}>Categorías</h1>
            <p style={{ color: '#888', marginBottom: '40px' }}>{categorias.length} categorías</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {categorias.map(cat => (
                <div key={cat.id} style={{
                  background: '#fff', borderRadius: '16px', padding: '24px',
                  border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                  <div style={{
                    width: '44px', height: '44px', background: '#0a0a0a',
                    borderRadius: '12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '20px'
                  }}>🏷️</div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '15px' }}>{cat.nombre}</p>
                    <p style={{ fontSize: '12px', color: '#888' }}>
                      {productos.filter(p => p.categoria_id === cat.id).length} productos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL PRODUCTO */}
      {modalProducto && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '40px',
            width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>
                {productoEdit ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button onClick={() => setModalProducto(false)} style={{
                background: '#f5f5f5', borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FiX size={18} />
              </button>
            </div>

            {[
              { label: 'Nombre', key: 'nombre', type: 'text', placeholder: 'Nombre del producto' },
              { label: 'Descripción', key: 'descripcion', type: 'text', placeholder: 'Descripción breve' },
              { label: 'Precio', key: 'precio', type: 'number', placeholder: '45000' },
              { label: 'Stock', key: 'stock', type: 'number', placeholder: '50' },
              { label: 'URL de imagen', key: 'imagen', type: 'text', placeholder: '/Productos/camisa1.png' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{
                  fontSize: '12px', fontWeight: '600', letterSpacing: '1px',
                  textTransform: 'uppercase', color: '#333', display: 'block', marginBottom: '8px'
                }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 16px', border: '1.5px solid #e0e0e0',
                    borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = '#000'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            ))}

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '600', letterSpacing: '1px',
                textTransform: 'uppercase', color: '#333', display: 'block', marginBottom: '8px'
              }}>Categoría</label>
              <select value={form.categoria_id}
                onChange={e => setForm({ ...form, categoria_id: e.target.value })}
                style={{
                  width: '100%', padding: '12px 16px', border: '1.5px solid #e0e0e0',
                  borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit'
                }}>
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '600', letterSpacing: '1px',
                textTransform: 'uppercase', color: '#333', display: 'block', marginBottom: '8px'
              }}>Género</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['unisex', 'hombre', 'mujer'].map(g => (
                  <button key={g} onClick={() => setForm({ ...form, genero: g })} style={{
                    flex: 1, padding: '10px',
                    background: form.genero === g ? '#0a0a0a' : '#f5f5f5',
                    color: form.genero === g ? '#fff' : '#333',
                    borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                    textTransform: 'capitalize', transition: 'all 0.2s'
                  }}>{g}</button>
                ))}
              </div>
            </div>

            <button onClick={guardarProducto} style={{
              width: '100%', padding: '16px', background: '#0a0a0a', color: '#fff',
              fontSize: '14px', fontWeight: '700', letterSpacing: '2px',
              textTransform: 'uppercase', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
              <FiCheck size={18} /> {productoEdit ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL CUPÓN */}
      {modalCupon && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '40px',
            width: '100%', maxWidth: '480px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Nuevo cupón</h2>
              <button onClick={() => setModalCupon(false)} style={{
                background: '#f5f5f5', borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FiX size={18} />
              </button>
            </div>

            {[
              { label: 'Código', key: 'codigo', type: 'text', placeholder: 'VERANO20' },
              { label: 'Valor', key: 'valor', type: 'number', placeholder: '20' },
              { label: 'Mínimo de compra', key: 'minimo', type: 'number', placeholder: '50000' },
              { label: 'Máximo de usos', key: 'usos_max', type: 'number', placeholder: '100' },
              { label: 'Fecha de expiración', key: 'expira', type: 'date', placeholder: '' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{
                  fontSize: '12px', fontWeight: '600', letterSpacing: '1px',
                  textTransform: 'uppercase', color: '#333', display: 'block', marginBottom: '8px'
                }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder}
                  value={formCupon[field.key]}
                  onChange={e => setFormCupon({ ...formCupon, [field.key]: e.target.value.toUpperCase() })}
                  style={{
                    width: '100%', padding: '12px 16px', border: '1.5px solid #e0e0e0',
                    borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = '#000'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            ))}

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                fontSize: '12px', fontWeight: '600', letterSpacing: '1px',
                textTransform: 'uppercase', color: '#333', display: 'block', marginBottom: '8px'
              }}>Tipo</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { val: 'porcentaje', label: '% Porcentaje' },
                  { val: 'monto', label: '$ Monto fijo' }
                ].map(t => (
                  <button key={t.val} onClick={() => setFormCupon({ ...formCupon, tipo: t.val })} style={{
                    flex: 1, padding: '10px',
                    background: formCupon.tipo === t.val ? '#0a0a0a' : '#f5f5f5',
                    color: formCupon.tipo === t.val ? '#fff' : '#333',
                    borderRadius: '8px', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s'
                  }}>{t.label}</button>
                ))}
              </div>
            </div>

            <button onClick={guardarCupon} style={{
              width: '100%', padding: '16px', background: '#0a0a0a', color: '#fff',
              fontSize: '14px', fontWeight: '700', letterSpacing: '2px',
              textTransform: 'uppercase', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
              <FiCheck size={18} /> Crear cupón
            </button>
          </div>
        </div>
      )}
    </div>
  )
}