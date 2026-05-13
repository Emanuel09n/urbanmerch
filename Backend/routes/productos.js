const express = require('express')
const router = express.Router()
const db = require('../db')

// Obtener todos los productos con filtros
router.get('/', (req, res) => {
  const { genero, sale } = req.query
  let sql = `SELECT p.*, c.nombre as categoria 
             FROM productos p 
             LEFT JOIN categorias c ON p.categoria_id = c.id
             WHERE 1=1`
  const params = []

  if (genero) {
    sql += ` AND (p.genero = ? OR p.genero = 'unisex')`
    params.push(genero)
  }
  if (sale === 'true') {
    sql += ` AND p.en_sale = TRUE`
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results)
  })
})

// Detalle producto con tallas y fotos
router.get('/:id/detalle', (req, res) => {
  const id = req.params.id
  const sqlProducto = `
    SELECT p.*, c.nombre as categoria 
    FROM productos p 
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?`
  const sqlTallas = `
    SELECT * FROM producto_tallas 
    WHERE producto_id = ? AND stock > 0
    ORDER BY FIELD(talla, 'XS','S','M','L','XL','XXL')`
  const sqlFotos = `
    SELECT * FROM producto_fotos 
    WHERE producto_id = ? 
    ORDER BY orden`

  db.query(sqlProducto, [id], (err, producto) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!producto[0]) return res.status(404).json({ error: 'Producto no encontrado' })
    db.query(sqlTallas, [id], (err2, tallas) => {
      if (err2) return res.status(500).json({ error: err2.message })
      db.query(sqlFotos, [id], (err3, fotos) => {
        if (err3) return res.status(500).json({ error: err3.message })
        res.json({ ...producto[0], tallas, fotos })
      })
    })
  })
})

// Obtener producto por id
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM productos WHERE id = ?'
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(results[0])
  })
})

// Agregar producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen, categoria_id, genero } = req.body
  const sql = 'INSERT INTO productos (nombre, descripcion, precio, stock, imagen, categoria_id, genero) VALUES (?, ?, ?, ?, ?, ?, ?)'
  db.query(sql, [nombre, descripcion, precio, stock, imagen, categoria_id, genero || 'unisex'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ mensaje: 'Producto agregado ✅', id: result.insertId })
  })
})
// Editar producto
router.put('/:id', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen, categoria_id, genero } = req.body
  const sql = `UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, 
               imagen=?, categoria_id=?, genero=? WHERE id=?`
  db.query(sql, [nombre, descripcion, precio, stock, imagen, categoria_id, genero, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ mensaje: 'Producto actualizado ✅' })
  })
})

// Eliminar producto
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM productos WHERE id = ?'
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ mensaje: 'Producto eliminado ✅' })
  })
})

module.exports = router