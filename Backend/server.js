const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/productos', require('./routes/productos'))
app.use('/api/pedidos', require('./routes/pedidos'))
app.use('/api/pagos', require('./routes/pagos'))
app.use('/api/categorias', require('./routes/categorias'))
app.use('/api/emails', require('./routes/emails'))
app.use('/api/cupones', require('./routes/cupones'))
app.use('/api/analytics', require('./routes/analytics'))

app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor tienda de ropa ✅' })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
})