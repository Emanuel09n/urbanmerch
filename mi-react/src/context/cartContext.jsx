import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  const agregar = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) {
        return prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const eliminar = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }

  const vaciar = () => setCarrito([])

  const total = carrito.reduce(
    (sum, p) => sum + p.precio * p.cantidad, 0
  )

  const cantidad = carrito.reduce(
    (sum, p) => sum + p.cantidad, 0
  )

  return (
    <CartContext.Provider value={{ carrito, agregar, eliminar, vaciar, total, cantidad }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)