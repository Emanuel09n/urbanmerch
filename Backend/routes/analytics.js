const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
  const queries = {
    totalProductos: 'SELECT COUNT(*) as total FROM productos',
    totalUsuarios: 'SELECT COUNT(*) as total FROM usuarios WHERE rol = "cliente"',
    totalPedidos: 'SELECT COUNT(*) as total FROM pedidos',
    totalVentas: 'SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE estado != "cancelado"',
    pedidosPorEstado: 'SELECT estado, COUNT(*) as cantidad FROM pedidos GROUP BY estado',
    productosMasVendidos: `
      SELECT p.nombre, p.imagen, SUM(dp.cantidad) as vendidos
      FROM detalle_pedidos dp
      JOIN productos p ON dp.producto_id = p.id
      GROUP BY p.id ORDER BY vendidos DESC LIMIT 5`,
    ventasPorDia: `
      SELECT DATE(created_at) as fecha, COUNT(*) as pedidos, SUM(total) as ventas
      FROM pedidos
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at) ORDER BY fecha ASC`,
    cuponesMasUsados: `
      SELECT codigo, tipo, valor, usos_actuales, usos_max
      FROM cupones ORDER BY usos_actuales DESC LIMIT 5`,
    clientesRecientes: `
      SELECT nombre, email, created_at
      FROM usuarios WHERE rol = "cliente"
      ORDER BY created_at DESC LIMIT 5`
  }

  const results = {}
  const keys = Object.keys(queries)
  let completed = 0

  keys.forEach(key => {
    db.query(queries[key], (err, data) => {
      if (err) results[key] = []
      else results[key] = data
      completed++
      if (completed === keys.length) res.json(results)
    })
  })
})

module.exports = router