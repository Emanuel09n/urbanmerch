const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Resend } = require('resend')
const db = require('../db')

const resend = new Resend(process.env.RESEND_API_KEY)

router.post('/registro', (req, res) => {
  const { nombre, email, password } = req.body
  const hash = bcrypt.hashSync(password, 10)
  const sql = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)'
  db.query(sql, [nombre, email, hash], (err, result) => {
    if (err) return res.status(400).json({ error: 'Email ya registrado' })

    // Email de bienvenida
    resend.emails.send({
      from: 'URBANMERCH <onboarding@resend.dev>',
      to: email,
      subject: '¡Bienvenido a URBANMERCH! 🎉',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff">
          <div style="background:#0a0a0a;padding:40px;text-align:center">
            <h1 style="color:#fff;font-size:32px;letter-spacing:4px;margin:0">URBANMERCH</h1>
            <p style="color:#666;font-size:12px;letter-spacing:2px;margin-top:8px">STREETWEAR • ESSENTIAL • AUTHENTIC</p>
          </div>
          <div style="padding:48px 40px">
            <h2 style="font-size:28px;font-weight:900;margin-bottom:16px">¡Hola ${nombre}! 👋</h2>
            <p style="color:#666;line-height:1.8;margin-bottom:24px">
              Bienvenido a la familia URBANMERCH. Ya eres parte de nuestra comunidad de streetwear.
            </p>
            <div style="background:#f8f8f8;border-radius:16px;padding:24px;margin-bottom:32px;text-align:center">
              <p style="font-size:14px;color:#666;margin-bottom:8px">Tu código de bienvenida</p>
              <p style="font-size:32px;font-weight:900;letter-spacing:4px;color:#0a0a0a">URBAN15</p>
              <p style="font-size:12px;color:#999;margin-top:8px">15% OFF en tu primera compra</p>
            </div>
            <a href="http://localhost:5173/catalogo" style="display:block;background:#0a0a0a;color:#fff;padding:16px;text-align:center;text-decoration:none;font-weight:700;letter-spacing:2px;font-size:13px;border-radius:12px">
              VER CATÁLOGO →
            </a>
          </div>
          <div style="background:#f8f8f8;padding:24px;text-align:center">
            <p style="color:#999;font-size:12px">© 2025 URBANMERCH. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    }).catch(console.error)

    res.json({ mensaje: 'Usuario registrado ✅' })
  })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const sql = 'SELECT * FROM usuarios WHERE email = ?'
  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ error: 'Usuario no encontrado' })
    const usuario = results[0]
    const valido = bcrypt.compareSync(password, usuario.password)
    if (!valido) return res.status(400).json({ error: 'Contraseña incorrecta' })
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '7d' }
    )
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    })
  })
})

module.exports = router