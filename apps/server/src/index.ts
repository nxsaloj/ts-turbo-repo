import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '../../../packages/database/prisma/prisma-client'

const app = express()
const client = new PrismaClient();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (_, res) => {
  return res.json({ ok: true })
})

app.get('/product/:id', async (req, res) => {
  const { id } = req.params

  try {
    const product = await client.product.findUnique({
      where: { id: Number(id) },
    })
    if (product) {
      return res.json(product)
    } else {
      return res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch product' })
  }
})

app.get('/products', async (_, res) => {
  try {
    const products = await client.product.findMany()
    return res.json(products)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch products' })
  }
})

app.post('/product', async (req, res) => {
  const { name, 
          description, 
          image, 
          variants, 
          options, 
          collections
        } = req.body

  try {
    const newProduct = await client.product.create({
      data: {
        name,
        description,
        image,
        variants,
        options,
        collections
      },
    })
    return res.status(201).json(newProduct)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create product '+error })
  }
})

const port = process.env.PORT || 5001

app.listen(port, () => {
  console.log(`Server API running on http://localhost:${port}`)
})
