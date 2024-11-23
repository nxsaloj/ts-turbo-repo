import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { productsRoute } from './routes/products'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
productsRoute(app)

app.get('/', (_, res) => {
  return res.json({ ok: true })
})

const port = process.env.PORT || 5001

app.listen(port, () => {
  console.log(`Server API running on http://localhost:${port}`)
})
