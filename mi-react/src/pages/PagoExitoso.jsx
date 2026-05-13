import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

export default function PagoExitoso() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', background: '#fff',
      paddingTop: '70px'
    }}>
      <FiCheckCircle size={80} color="#00aa00" style={{ marginBottom: '24px' }} />
      <h1 style={{
        fontSize: '40px', fontWeight: '900',
        letterSpacing: '-2px', marginBottom: '12px'
      }}>¡Pago exitoso!</h1>
      <p style={{ color: '#888', fontSize: '16px', marginBottom: '40px' }}>
        Tu pedido fue confirmado. Te enviaremos un correo pronto.
      </p>
      <Link to="/" style={{
        background: '#0a0a0a', color: '#fff',
        padding: '16px 40px', borderRadius: '100px',
        fontSize: '13px', fontWeight: '700',
        letterSpacing: '2px', textTransform: 'uppercase'
      }}>Volver al inicio</Link>
    </div>
  )
}