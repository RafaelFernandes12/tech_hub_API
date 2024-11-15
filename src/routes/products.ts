import { faker } from '@faker-js/faker'
import { FastifyInstance } from 'fastify'
import { Category, Manufacturer } from '../../prisma/enum'
import { prisma } from '../lib/prisma'
import { pageParamSchema, productFilterSchema, productParamsSchema } from '../schemas/productSchemas'
import { productIdSchema } from '../schemas/sellsSchemas'

export async function products(app: FastifyInstance) {

    app.get('/products/page/:n', async (req) => {

      const { name, category, manufacturer, price, totalValue, qtd } = productFilterSchema.parse(req.query) 
      const { n } = pageParamSchema.parse(req.params)
    
      return await prisma.product.findMany({
        where: {
          AND: [
            name ? { name: { contains: name } } : {},
            category ? { category: { equals: category } } : {},
            manufacturer ? { manufacturer: { equals: manufacturer } } : {},
            totalValue ? { totalValue: { gte: parseInt(totalValue) } } : {},
            price ? { price: { gte: parseInt(price) } } : {},
            qtd ? { qtd: { gte: parseInt(qtd) } } : {},
          ],
          
        },
        skip: (parseInt(n) - 1) * 20,  
        take: 20,                     
      }) 
    })

    app.get('/products', async (req) => {
      const { name, category, manufacturer, price, qtd, totalValue } = productFilterSchema.parse(req.query) 
    
      return await prisma.product.findMany({
        where: {
          AND: [
            name ? { name: { contains: name } } : {},
            category ? { category: { equals: category } } : {},
            manufacturer ? { manufacturer: { equals: manufacturer } } : {},
            totalValue ? { totalValue: { gte: parseInt(totalValue) } } : {},
            price ? { price: { gte: parseInt(price) } } : {},
            qtd ? { qtd: { gte: parseInt(qtd) } } : {},
          ],
        }
      }) 
    })

    app.get('/products/manufacturers', (_, res) => {
      res.send(Object.values(Manufacturer)) 
    }) 
    app.get('/products/categories', (_, res) => {
      res.send(Object.values(Category)) 
    }) 
    app.get('/products/:productId', async (req, res) => {
        const {productId} = productIdSchema.parse(req.params)
        return await prisma.product.findUnique({
          where: {
            id: Number(productId), 
          },
        }) 
    }) 
    app.delete('/products/:id', async (req, res) => {
      try{
        const { id } = productParamsSchema.parse(req.params)
        await prisma.product.delete({
          where: {
            id: parseInt(id), 
          },
        }) 
      } catch(e) {
        res.status(409).send({status: 409, message: "Há vendas relacionadas a esse produto, delete as vendas primeiro!"})
      }
    }) 

    app.post('/create10Products', async () => {

      const products = [] 

      const categories = Object.values(Category) 
      const manufacturers = Object.values(Manufacturer) 

      for (let i = 0;  i < 10;  i++) {
        const price = Number(faker.number.float({ min: 1, max: 1000 }).toPrecision(2))
        const qtd = faker.number.int({ min: 1, max: 500 })
        
        const totalValue = Number(price) * qtd

        products.push({
          qtd,
          price,
          totalValue,
          category: categories[Math.floor(Math.random() * categories.length)],
          manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
          name: faker.commerce.productName(),
        }) 
      }

      await prisma.product.createMany({
        data: products,
      }) 
    }) 

}