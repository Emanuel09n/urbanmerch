const express = require('express')
const router = express.Router()
const db = require('../db')

router.post('/', (req, res) => {
  const { usuario_id, productos, total } = req.body
  const sqlPedido = 'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)'
  db.query(sqlPedido, [usuario_id, total], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    const pedido_id = result.insertId
    const detalles = productos.map(p => [pedido_id, p.id, p.cantidad, p.precio])
    const sqlDetalle = 'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?'
    db.query(sqlDetalle, [detalles], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message })
      res.json({ mensaje: 'Pedido creado ✅', pedido_id })
    })
  })
})

router.get('/:usuario_id', (req, res) => {
  const sql = 'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC'
  db.query(sql, [req.params.usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

module.exports = router