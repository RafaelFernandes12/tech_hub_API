import { faker } from '@faker-js/faker'
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { pageParamSchema } from '../schemas/productSchemas'
import { sellsFilterSchema, sellsProps } from '../schemas/sellsSchemas'

export async function sells(app: FastifyInstance) {

  app.get('/sells/page/:n', async (req) => {

    const { startDate, productName, totalValue, price, qtd } = sellsFilterSchema.parse(req.query);
    const { n } = pageParamSchema.parse(req.params);

    let productIds: number[] | undefined;

  if (productName) {
    const products = await prisma.product.findMany({
      where: { name: { contains: decodeURIComponent(productName) } },
      select: { id: true, name: true }
    });

    if (products.length > 0) {
      productIds = products.map(product => product.id);
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
          productIds ? { productId: { in: productIds } } : {},
          totalValue ? { totalValue: { gte: parseInt(totalValue) } } : {},
          price ? { price: { gte: parseInt(price) } } : {},
          qtd ? { qtd: { gte: parseInt(qtd) } } : {},
        ],
      },
      skip: (parseInt(n) - 1) * 20,
      take: 20,
    });
});


app.get('/findAllSells', async (req) => {
  const { startDate, productName, totalValue, price, qtd } = sellsFilterSchema.parse(req.query);

  let productIds: number[] | undefined;

  if (productName) {
    const products = await prisma.product.findMany({
      where: { name: { contains: decodeURIComponent(productName) } },
      select: { id: true, name: true }
    });

    if (products.length > 0) {
      productIds = products.map(product => product.id);
    } else {
      return [];
    }
  }

  return await prisma.sells.findMany({
    where: {
      AND: [
        startDate
          ? {
              date: {
                gte: new Date(startDate),
                lte: new Date(),
              },
            }
          : {},
        productIds ? { productId: { in: productIds } } : {},
        totalValue ? { totalValue: { gte: parseInt(totalValue) } } : {},
        price ? { price: { gte: parseInt(price) } } : {},
        qtd ? { qtd: { gte: parseInt(qtd) } } : {},
      ],
    },
  });
});

    app.post('/sell10Products', async () => {
        const products = await prisma.product.findMany()
        const sells: sellsProps[] = []

        for (let i = 0; i < 10; i++) {
          const randomProduct = products[Math.floor(Math.random() * products.length)]
          const price = faker.number.float({ min: 1, max: 1000 }).toPrecision(2)
          const sellQtd = faker.number.int({ min: 1, max: 100 })
          
          if (randomProduct.qtd >= sellQtd) {
            const totalValue = Number(price) * sellQtd
            
            sells.push({
              date: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2024-11-10T00:00:00.000Z' }),
              qtd: sellQtd,
              price: Number(price),
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