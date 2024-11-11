import { faker } from '@faker-js/faker';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function products(app: FastifyInstance) {
    app.get('/products/:id', async (request) => {

        const productParams = z.object({
            id: z.string(),
        })

        const { id } = productParams.parse(request.params)

        return await prisma.product.findUnique({
            where: {
                id: parseInt(id),
            }
        })

    })
    app.get('/products', async (req) => {
        const productFilterSchema = z.object({
            name: z.string().optional(),
            category: z.string().optional(),
            manufacturer: z.string().optional(),
          });
          const { name, category, manufacturer } = productFilterSchema.parse(req.query);
      
        return await prisma.product.findMany({
          where: {
            AND: [
              name ? { name: { contains: name } } : {},
              category ? { category: { contains: category } } : {},
              manufacturer ? { manufacturer: { contains: manufacturer } } : {},
            ],
          },
        });
      });

     app.post('/products', async () => {
        const products = [];
        for (let i = 0; i < 10; i++) {
            products.push({
              qtd: faker.number.int({ min: 1, max: 10 }),
              category: faker.commerce.department(),
              manufacturer: faker.company.name(),
              name: faker.commerce.productName(),
            });
        }

        await prisma.product.createMany({
            data: products,
        });
    })
}