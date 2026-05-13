const express = require('express')
const router = express.Router()
const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

// Email de bienvenida
router.post('/bienvenida', async (req, res) => {
  const { nombre, email } = req.body
  try {
    await resend.emails.send({
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
    })
    res.json({ mensaje: 'Email enviado ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Email confirmación de pedido
router.post('/pedido', async (req, res) => {
  const { nombre, email, productos, total, pedido_id } = req.body
  try {
    const itemsHtml = productos.map(p => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px">${p.nombre}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:center">${p.cantidad}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:right;font-weight:700">$${Number(p.precio * p.cantidad).toLocaleString('es-CO')}</td>
      </tr>
    `).join('')

    await resend.emails.send({
      from: 'URBANMERCH <onboarding@resend.dev>',
      to: email,
      subject: `¡Pedido confirmado #${pedido_id}! 📦`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff">
          <div style="background:#0a0a0a;padding:40px;text-align:center">
            <h1 style="color:#fff;font-size:32px;letter-spacing:4px;margin:0">URBANMERCH</h1>
          </div>
          <div style="padding:48px 40px">
            <h2 style="font-size:24px;font-weight:900;margin-bottom:8px">¡Pedido confirmado! 🎉</h2>
            <p style="color:#666;margin-bottom:32px">Hola ${nombre}, tu pedido #${pedido_id} está siendo procesado.</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <thead>
                <tr style="border-bottom:2px solid #0a0a0a">
                  <th style="padding:12px 0;text-align:left;font-size:12px;letter-spacing:1px;text-transform:uppercase">Producto</th>
                  <th style="padding:12px 0;text-align:center;font-size:12px;letter-spacing:1px;text-transform:uppercase">Cant.</th>
                  <th style="padding:12px 0;text-align:right;font-size:12px;letter-spacing:1px;text-transform:uppercase">Precio</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div style="text-align:right;padding:16px 0;border-top:2px solid #0a0a0a">
              <span style="font-size:20px;font-weight:900">Total: $${Number(total).toLocaleString('es-CO')}</span>
            </div>
          </div>
          <div style="background:#f8f8f8;padding:24px;text-align:center">
            <p style="color:#999;font-size:12px">© 2025 URBANMERCH. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    })
    res.json({ mensaje: 'Email enviado ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Email carrito abandonado
router.post('/carrito-abandonado', async (req, res) => {
  const { nombre, email, productos } = req.body
  try {
    await resend.emails.send({
      from: 'URBANMERCH <onboarding@resend.dev>',
      to: email,
      subject: '¿Olvidaste algo? 🛒',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff">
          <div style="background:#0a0a0a;padding:40px;text-align:center">
            <h1 style="color:#fff;font-size:32px;letter-spacing:4px;margin:0">URBANMERCH</h1>
          </div>
          <div style="padding:48px 40px;text-align:center">
            <div style="font-size:60px;margin-bottom:24px">🛒</div>
            <h2 style="font-size:24px;font-weight:900;margin-bottom:16px">¡${nombre}, olvidaste tu carrito!</h2>
            <p style="color:#666;line-height:1.8;margin-bottom:32px">
              Tienes ${productos.length} producto${productos.length > 1 ? 's' : ''} esperándote. ¡No dejes que se agoten!
            </p>
            <div style="background:#f8f8f8;border-radius:16px;padding:24px;margin-bottom:32px">
              <p style="font-size:14px;color:#666;margin-bottom:8px">Usa este código y llévate un</p>
              <p style="font-size:40px;font-weight:900;letter-spacing:4px;color:#0a0a0a">10% OFF</p>
              <p style="font-size:20px;font-weight:700;letter-spacing:3px;color:#0a0a0a;margin-top:8px">VUELVE10</p>
            </div>
            <a href="http://localhost:5173/carrito" style="display:inline-block;background:#0a0a0a;color:#fff;padding:16px 48px;text-decoration:none;font-weight:700;letter-spacing:2px;font-size:13px;border-radius:100px">
              COMPLETAR COMPRA →
            </a>
          </div>
          <div style="background:#f8f8f8;padding:24px;text-align:center">
            <p style="color:#999;font-size:12px">© 2025 URBANMERCH. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    })
    res.json({ mensaje: 'Email enviado ✅' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router