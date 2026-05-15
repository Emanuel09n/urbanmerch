const express = require('express')
const router = express.Router()
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago')
const { Resend } = require('resend')
const db = require('../db')

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})

const resend = new Resend(process.env.RESEND_API_KEY)

router.post('/crear-preferencia', async (req, res) => {
  const { productos, usuario, descuento } = req.body

  try {
    const preference = new Preference(client)

    const items = productos.map(p => ({
      id: String(p.id),
      title: p.nombre,
      quantity: p.cantidad,
      unit_price: Number(p.precio),
      currency_id: 'COP'
    }))

    if (descuento && descuento > 0) {
      items.push({
        id: 'descuento',
        title: 'Descuento cupón',
        quantity: 1,
        unit_price: -Number(descuento),
        currency_id: 'COP'
      })
    }

    const total = productos.reduce(
      (acc, p) => acc + (p.precio * p.cantidad),
      0
    ) - (descuento || 0)

    const response = await preference.create({
      body: {
        items,

        payer: {
          email: usuario?.email || 'test@test.com'
        },

        back_urls: {
          success: 'https://urbanmerch.netlify.app/pago-exitoso',
          failure: 'https://urbanmerch.netlify.app/pago-fallido',
          pending: 'https://urbanmerch.netlify.app/pago-pendiente'
        },

        auto_return: 'approved',

        // WEBHOOK
        notification_url:
          'https://urbanmerch-production.up.railway.app/api/pagos/webhook',

        statement_descriptor: 'URBANMERCH',

        metadata: {
          email: usuario?.email,
          nombre: usuario?.nombre,
          productos: JSON.stringify(productos),
          total: total
        }
      }
    })

    res.json({
      init_point: process.env.MP_ACCESS_TOKEN.startsWith('TEST-')
        ? response.sandbox_init_point
        : response.init_point,
      id: response.id
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error creando preferencia' })
  }
})

// WEBHOOK
router.post('/webhook', async (req, res) => {
  const { type, data } = req.body

  if (type === 'payment') {
    try {
      const payment = new Payment(client)
      const pago = await payment.get({ id: data.id })

      if (pago.status === 'approved') {
        const metadata = pago.metadata || {}
        const email = metadata.email
        const nombre = metadata.nombre || 'Cliente'
        const total = metadata.total || 0
        const productos = JSON.parse(metadata.productos || '[]')

        if (email && productos.length > 0) {
          db.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email],
            (err, users) => {
              if (!err && users.length > 0) {
                const usuario_id = users[0].id

                db.query(
                  'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)',
                  [usuario_id, total, 'pagado'],
                  (err2, result) => {
                    if (!err2) {
                      const pedido_id = result.insertId

                      const detalles = productos.map(p => [
                        pedido_id,
                        p.id,
                        p.cantidad,
                        p.precio
                      ])

                      // GUARDAR DETALLE DEL PEDIDO
                      db.query(
                        'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?',
                        [detalles],
                        () => {}
                      )

                      // REDUCIR INVENTARIO
                      productos.forEach(p => {
                        db.query(
                          'UPDATE productos SET stock = GREATEST(stock - ?, 0) WHERE id = ?',
                          [p.cantidad, p.id],
                          errStock => {
                            if (errStock) {
                              console.error(
                                'Error reduciendo stock:',
                                errStock
                              )
                            } else {
                              console.log(
                                `Stock reducido: producto ${p.id} - ${p.cantidad} unidades`
                              )
                            }
                          }
                        )
                      })

                      // EMAIL DE CONFIRMACIÓN
                      const itemsHtml = productos
                        .map(
                          p => `
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333">${p.nombre}</td>
                        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:center;color:#333">${p.cantidad}</td>
                        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;text-align:right;font-weight:700;color:#333">
                          $${Number(
                            p.precio * p.cantidad
                          ).toLocaleString('es-CO')}
                        </td>
                      </tr>
                    `
                        )
                        .join('')

                      resend.emails
                        .send({
                          from: 'URBANMERCH <onboarding@resend.dev>',
                          to: email,
                          subject: `¡Pedido confirmado #${pedido_id}! 📦`,
                          html: `
                        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff">
                          <div style="background:#0a0a0a;padding:40px;text-align:center">
                            <h1 style="color:#fff;font-size:28px;letter-spacing:4px;margin:0">URBANMERCH</h1>
                            <p style="color:#666;font-size:11px;letter-spacing:2px;margin-top:8px">
                              STREETWEAR • ESSENTIAL • AUTHENTIC
                            </p>
                          </div>

                          <div style="padding:48px 40px">
                            <div style="text-align:center;margin-bottom:32px">
                              <div style="font-size:48px;margin-bottom:16px">📦</div>

                              <h2 style="font-size:24px;font-weight:900;margin-bottom:8px;color:#0a0a0a">
                                ¡Pedido confirmado!
                              </h2>

                              <p style="color:#888;font-size:14px">
                                Hola <strong>${nombre}</strong>, tu pedido está siendo procesado.
                              </p>
                            </div>

                            <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin-bottom:32px">
                              <p style="font-size:12px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">
                                Número de pedido
                              </p>

                              <p style="font-size:28px;font-weight:900;color:#0a0a0a;letter-spacing:-1px">
                                #${pedido_id}
                              </p>
                            </div>

                            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
                              <thead>
                                <tr style="border-bottom:2px solid #0a0a0a">
                                  <th style="padding:12px 0;text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888">
                                    Producto
                                  </th>

                                  <th style="padding:12px 0;text-align:center;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888">
                                    Cant.
                                  </th>

                                  <th style="padding:12px 0;text-align:right;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#888">
                                    Precio
                                  </th>
                                </tr>
                              </thead>

                              <tbody>${itemsHtml}</tbody>
                            </table>

                            <div style="text-align:right;padding:16px 0;border-top:2px solid #0a0a0a;margin-bottom:32px">
                              <span style="font-size:22px;font-weight:900;color:#0a0a0a">
                                Total: $${Number(total).toLocaleString('es-CO')}
                              </span>
                            </div>

                            <div style="background:#0a0a0a;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px">
                              <p style="color:#666;font-size:12px;margin-bottom:8px">
                                ¿Tienes preguntas sobre tu pedido?
                              </p>

                              <p style="color:#fff;font-size:14px;font-weight:700">
                                WhatsApp: +57 320 866 5793
                              </p>
                            </div>

                            <a
                              href="https://urbanmerch.netlify.app/catalogo"
                              style="display:block;background:#0a0a0a;color:#fff;padding:16px;text-align:center;text-decoration:none;font-weight:700;letter-spacing:2px;font-size:13px;border-radius:12px"
                            >
                              SEGUIR COMPRANDO →
                            </a>
                          </div>

                          <div style="background:#f8f8f8;padding:24px;text-align:center">
                            <p style="color:#999;font-size:12px;margin:0">
                              © 2025 URBANMERCH. Todos los derechos reservados.
                            </p>
                          </div>
                        </div>
                      `
                        })
                        .catch(console.error)
                    }
                  }
                )
              }
            }
          )
        }
      }
    } catch (err) {
      console.error('Webhook error:', err)
    }
  }

  res.sendStatus(200)
})

module.exports = router