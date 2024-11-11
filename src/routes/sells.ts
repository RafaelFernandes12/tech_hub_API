import { faker } from '@faker-js/faker';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function sells(app: FastifyInstance) {

    app.get('/sells', async (req) => {
        
        const sellsFilterSchema = z.object({
            startDate: z.string().optional(),
            productId: z.string().optional(),
            totalPrice: z.number().optional(),
        });
    
        const { startDate, productId, totalPrice } = sellsFilterSchema.parse(req.query);
    
        const whereClause = {
            AND: [
                startDate ? {
                    date: {
                        gte: new Date(startDate),
                        lte: new Date(),
                    },
                } : {},
                productId ? {productId: parseInt(productId)} : {},
                totalPrice ? { totalPrice: { gte: totalPrice } } : {},
            ],
        };

        return await prisma.sells.findMany({
            where: whereClause,
        });
    
    });

    app.post('/sells', async () => {
        const products = await prisma.product.findMany();
    
        const sells: {
            date: Date;
            qtd: number;
            totalValue: number;
            productId: number;
          }[] = [];
        for (let i = 0; i < 10; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            sells.push({
                date: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2024-11-10T00:00:00.000Z' }),
                qtd: faker.number.int({ min: 1, max: 10 }),
                totalValue: parseFloat(faker.commerce.price()),
                productId: randomProduct.id,
            });
        }
    
        await prisma.sells.createMany({
            data: sells
        })
    
    });

}