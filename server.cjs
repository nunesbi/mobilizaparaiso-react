const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

let lat = -20.718
let lng = -46.609

app.get('/location', (req, res) => {
  lat += (Math.random() - 0.5) * 0.001
  lng += (Math.random() - 0.5) * 0.001

  const time = new Date().toLocaleTimeString()

  res.json({ lat, lng, time })
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})