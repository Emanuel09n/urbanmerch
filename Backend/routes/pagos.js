const express = require('express')
const router = express.Router()
const { MercadoPagoConfig, Preference } = require('mercadopago')

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
})

router.post('/crear-preferencia', async (req, res) => {
  const { productos, usuario } = req.body

  try {
    const preference = new Preference(client)

    const items = productos.map(p => ({
      id: String(p.id),
      title: p.nombre,
      quantity: p.cantidad,
      unit_price: Number(p.precio),
      currency_id: 'COP'
    }))

    const response = await preference.create({
      body: {
        items,
        payer: {
          email: usuario?.email || 'test@test.com'
        },
        back_urls: {
          success: 'http://localhost:5173/pago-exitoso',
          failure: 'http://localhost:5173/pago-fallido',
          pending: 'http://localhost:5173/pago-pendiente'
        },
        
        statement_descriptor: 'URBANMERCH'
      }
    })

    res.json({ init_point: response.init_point, id: response.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error creando preferencia' })
  }
})

module.exports = router