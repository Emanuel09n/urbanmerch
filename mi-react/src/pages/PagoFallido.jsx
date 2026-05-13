import { Link } from 'react-router-dom'
import { FiXCircle } from 'react-icons/fi'

export default function PagoFallido() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', background: '#fff',
      paddingTop: '70px'
    }}>
      <FiXCircle size={80} color="#cc0000" style={{ marginBottom: '24px' }} />
      <h1 style={{
        fontSize: '40px', fontWeight: '900',
        letterSpacing: '-2px', marginBottom: '12px'
      }}>Pago fallido</h1>
      <p style={{ color: '#888', fontSize: '16px', marginBottom: '40px' }}>
        Hubo un problema con tu pago. Intenta de nuevo.
      </p>
      <Link to="/carrito" style={{
        background: '#0a0a0a', color: '#fff',
        padding: '16px 40px', borderRadius: '100px',
        fontSize: '13px', fontWeight: '700',
        letterSpacing: '2px', textTransform: 'uppercase'
      }}>Volver al carrito</Link>
    </div>
  )
}