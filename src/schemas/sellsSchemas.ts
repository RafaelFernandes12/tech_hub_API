import { z } from "zod";

export const sellsFilterSchema = z.object({
    startDate: z.string().optional(),
    productId: z.string().optional(),
    totalValue: z.number().optional(),
});
export const sellsPostSchema = z.object({
    date: z.date().optional(),
    productId: z.number(),
    profit: z.number(),
    qtd: z.number(),
})
export interface sellsProps {
    date: Date;
    qtd: number;
    profit: number
    totalValue: number;
    productId: number;
}