import { faker } from '@faker-js/faker'
import { FastifyInstance } from 'fastify'
import { Category, Manufacturer } from '../../prisma/enum'
import { prisma } from '../lib/prisma'
import { pageParamSchema, productFilterSchema, productParamsSchema, productSchema } from '../schemas/productSchemas'

export async function products(app: FastifyInstance) {

    app.get('/products/:id', async (request) => {
        const { id } = productParamsSchema.parse(request.params)

        return await prisma.product.findUnique({
            where: {
                id: parseInt(id),
            }
        })
    })
    app.get('/products/page/:n', async (req) => {

      const { name, category, manufacturer } = productFilterSchema.parse(req.query) 
      const { n } = pageParamSchema.parse(req.params)
    
      return await prisma.product.findMany({
        where: {
          AND: [
            name ? { name: { contains: name } } : {},
            category ? { category: { equals: category } } : {},
            manufacturer ? { manufacturer: { equals: manufacturer } } : {},
          ],
        },
        skip: (parseInt(n) - 1) * 20,  
        take: 20,                     
      }) 
    })

    app.get('/products', async (req) => {
      const { name, category, manufacturer } = productFilterSchema.parse(req.query) 
    
      return await prisma.product.findMany({
        where: {
          AND: [
            name ? { name: { contains: name } } : {},
            category ? { category: { equals: category } } : {},
            manufacturer ? { manufacturer: { equals: manufacturer } } : {},
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
    
    app.delete('/products', async (_, res) => {
      try{
        const last10Products = await prisma.product.findMany({
          orderBy: {
            id: 'desc', 
          },
          take: 10, 
        }) 
      
        const productIdsToDelete = last10Products.map(product => product.id) 
      
        await prisma.product.deleteMany({
          where: {
            id: { in: productIdsToDelete }, 
          },
        }) 
      } catch(e) {
        res.status(409).send({status: 409, message: "Há vendas relacionadas a esse produto, delete as vendas primeiro!"})
      }
    }) 

    app.post('/products', async (req, res) => {

      const {category, manufacturer, name, qtd, price} = productSchema.parse(req.body)

      if(!category || !manufacturer || !name || !qtd) 
        res.status(409).send({status: 409, message: "Todos os campos devem ser preenchidos"})

      await prisma.product.create({
        data: {
          category, manufacturer, name, qtd, price
        },
      }) 

    }) 
    app.post('/create10Products', async () => {

      const products = [] 

      const categories = Object.values(Category) 
      const manufacturers = Object.values(Manufacturer) 

      for (let i = 0;  i < 10;  i++) {
        products.push({
          qtd: faker.number.int({ min: 1, max: 100 }),
          category: categories[Math.floor(Math.random() * categories.length)],
          manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
          name: faker.commerce.productName(),
          price: faker.number.float({min: 1, max: 500})
        }) 
      }

      await prisma.product.createMany({
        data: products,
      }) 
    }) 

}