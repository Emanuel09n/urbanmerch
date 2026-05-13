import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import PagoExitoso from './pages/PagoExitoso'
import PagoFallido from './pages/PagoFallido'
import Producto from './pages/Producto'
import Admin from './pages/Admin'
import SplashScreen from './components/SplashScreen'
import PopupDescuento from './components/PopupDescuento'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  const [splash, setSplash] = useState(true)
  const [popup, setPopup] = useState(false)

  const handleSplashFinish = () => {
    setSplash(false)
    setTimeout(() => setPopup(true), 800)
  }

  return (
    <AuthProvider>
      <CartProvider>
        {splash && <SplashScreen onFinish={handleSplashFinish} />}
        {popup && <PopupDescuento />}
        {!window.location.pathname.includes('/admin') && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-fallido" element={<PagoFallido />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App