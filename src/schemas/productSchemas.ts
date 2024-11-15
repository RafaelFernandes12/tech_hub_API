import { z } from "zod";
import { Category, Manufacturer } from "../../prisma/enum";

export const productFilterSchema = z.object({
    name: z.string().optional(),
    category: z.enum(Object.values(Category) as [Category]).optional(),
    manufacturer: z.enum(Object.values(Manufacturer) as [Manufacturer]).optional(),
}) 
export const pageParamSchema = z.object({
    n: z.string().regex(/^\d+$/)
  });
export const productParamsSchema = z.object({
    id: z.string(),
})
export const productSchema = z.object({
    name: z.string(),
    qtd: z.number(),
    category: z.enum(Object.values(Category) as [Category]),
    manufacturer: z.enum(Object.values(Manufacturer) as [Manufacturer]),
  }) 
