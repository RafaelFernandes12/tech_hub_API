import { z } from "zod";

export const sellsFilterSchema = z.object({
    startDate: z.string().optional(),
    productName: z.string().optional(),
    totalValue: z.string().optional(),
    price: z.string().optional(),
    qtd: z.string().optional()
});
export const sellsPostSchema = z.object({
    date: z.date().optional(),
    productId: z.number(),
    price: z.number(),
    qtd: z.number(),
})
export const productIdSchema = z.object({
    productId: z.string(),
})
export interface sellsProps {
    date: Date;
    qtd: number;
    price: number
    totalValue: number;
    productId: number;
}