import express, { Express } from "express";
import { prisma } from "../../lib/PrismaClient";

export function productsRoute(app:Express):void{
    const router = express.Router();
    app.use('/api/products', router)

    router.get('/', async (_, res) => {
        try {
            const products = await prisma.product.findMany()
            return res.json(products)
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch products' })
        }
    })

    router.get('/:id', async (req, res) => {
        const { id } = req.params

        try {
            const product = await prisma.product.findUnique({
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

    router.post('/', async (req, res) => {
        const { name, 
                description, 
                image, 
                variants, 
                options, 
                collections
                } = req.body

        try {
            const newProduct = await prisma.product.create({
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

    router.put('/:id', async (req, res) => {
        const { id } = req.params
        const { name, 
                description, 
                image, 
                variants, 
                options, 
                collections
                } = req.body

        try {
            const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                image,
                variants,
                options,
                collections
            },
            })
            return res.json(updatedProduct)
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update product' })
        }
    })

    router.delete('/:id', async (req, res) => {
        const { id } = req.params

        try {
            await prisma.product.delete({
            where: { id: Number(id) },
            })
            return res.status(204).send()
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete product' })
        }
    })
}