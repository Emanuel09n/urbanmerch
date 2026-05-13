const express = require('express')
const router = express.Router()
const db = require('../db')

// Validar cupón
router.post('/validar', (req, res) => {
  const { codigo, total } = req.body
  const sql = `SELECT * FROM cupones 
               WHERE codigo = ? AND activo = TRUE 
               AND (expira IS NULL OR expira >= CURDATE())
               AND usos_actuales < usos_max`
  db.query(sql, [codigo.toUpperCase()], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    if (results.length === 0) return res.status(400).json({ error: 'Cupón inválido o expirado' })
    
    const cupon = results[0]
    if (total < cupon.minimo) {
      return res.status(400).json({ 
        error: `El monto mínimo para este cupón es $${Number(cupon.minimo).toLocaleString('es-CO')}` 
      })
    }

    let descuento = 0
    if (cupon.tipo === 'porcentaje') {
      descuento = (total * cupon.valor) / 100
    } else {
      descuento = cupon.valor
    }

    res.json({
      valido: true,
      cupon: {
        codigo: cupon.codigo,
        tipo: cupon.tipo,
        valor: cupon.valor,
        descuento: Math.round(descuento),
        total_final: Math.round(total - descuento)
      }
    })
  })
})

// Usar cupón (al pagar)
router.post('/usar', (req, res) => {
  const { codigo } = req.body
  const sql = 'UPDATE cupones SET usos_actuales = usos_actuales + 1 WHERE codigo = ?'
  db.query(sql, [codigo.toUpperCase()], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ mensaje: 'Cupón aplicado ✅' })
  })
})

// Obtener todos los cupones (admin)
router.get('/', (req, res) => {
  db.query('SELECT * FROM cupones ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Crear cupón (admin)
router.post('/', (req, res) => {
  const { codigo, tipo, valor, minimo, usos_max, expira } = req.body
  const sql = 'INSERT INTO cupones (codigo, tipo, valor, minimo, usos_max, expira) VALUES (?, ?, ?, ?, ?, ?)'
  db.query(sql, [codigo.toUpperCase(), tipo, valor, minimo || 0, usos_max || 100, expira || null], (err, result) => {
    if (err) return res.status(500).json({ error: 'Código ya existe' })
    res.json({ mensaje: 'Cupón creado ✅', id: result.insertId })
  })
})

// Eliminar cupón (admin)
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM cupones WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ mensaje: 'Cupón eliminado ✅' })
  })
})

module.exports = router