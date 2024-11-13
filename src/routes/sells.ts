import { faker } from '@faker-js/faker'
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { pageParamSchema } from '../schemas/productSchemas'
import { sellsFilterSchema, sellsPostSchema, sellsProps } from '../schemas/sellsSchemas'

export async function sells(app: FastifyInstance) {

  app.get('/sells/page/:n', async (req) => {

    const { startDate, productName, totalValue } = sellsFilterSchema.parse(req.query);
    const { n } = pageParamSchema.parse(req.params);

    let productId;
    if (productName) {
      const product = await prisma.product.findUnique({
        where: { name: decodeURIComponent(productName) },
        select: { id: true }
      });

      if (product) {
        productId = product.id;
      } else {
        return [];
      }
    }

    return await prisma.sells.findMany({
      where: {
        AND: [
          startDate ? {
            date: {
              gte: new Date(startDate),
              lte: new Date(),
            },
          } : {},
          productId ? { productId } : {},
          totalValue ? { totalValue: { gte: parseInt(totalValue) } } : {},
        ],
      },
      skip: (parseInt(n) - 1) * 20,
      take: 20,
    });
});


    app.get('/findAllSells', async (req) => {

      
      const { startDate, productId, totalValue } = sellsFilterSchema.parse(req.query)



      return await prisma.sells.findMany({
        where: {
          AND: [
            startDate ? {
              date: {
                gte: new Date(startDate),
                lte: new Date(),
              },
            } : {},
            productId ? {productId: parseInt(productId)} : {},
            totalValue ? { totalValue: { gte: totalValue } } : {},
          ],
        }
      })
    })


    app.post('/sells', async (req, res) => {
      const { date = new Date(), productId, profit, qtd } = sellsPostSchema.parse(req.body);
    
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
    
      if (!product) return res.status(404).send({ message: "Product not found" });
    
      if (product.qtd < qtd) return res.status(400).send({ message: "Insufficient product quantity" });
    
      const parsedProfit = profit / 100;
      const totalValue = qtd * parsedProfit * product.price;
    
      const sell = await prisma.sells.create({
        data: {
          date,
          profit: parsedProfit,
          qtd,
          totalValue,
          productId,
        },
      });
    
      await prisma.product.update({
        where: { id: productId },
        data: { qtd: product.qtd - qtd },
      });
    
      return res.status(201).send(sell);
    });

    app.post('/sell10Products', async () => {
        const products = await prisma.product.findMany()
        const sells: sellsProps[] = []

        for (let i = 0; i < 10; i++) {
          const randomProduct = products[Math.floor(Math.random() * products.length)]
          
          const sellQtd = faker.number.int({ min: 1, max: 10 })
          
          if (randomProduct.qtd >= sellQtd) {
            const profit = faker.number.int({ min: 100, max: 1000 }) / 100
            const totalValue = randomProduct.price * sellQtd * profit
            
            sells.push({
              date: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2024-11-10T00:00:00.000Z' }),
              qtd: sellQtd,
              profit,
              totalValue,
              productId: randomProduct.id,
            })
      
            await prisma.product.update({
              where: { id: randomProduct.id },
              data: { qtd: randomProduct.qtd - sellQtd },
            })
          }
        }
        await prisma.sells.createMany({
          data: sells
        })
      })

}