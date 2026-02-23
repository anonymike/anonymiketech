import { z } from 'zod'

export const PackageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Package name is required'),
  price: z.number().positive('Price must be positive'),
  features: z.array(z.string()),
  description: z.string().optional(),
})

export const SubServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Sub-service name is required'),
  packages: z.array(PackageSchema).min(1, 'At least one package is required'),
})

export const ServiceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Service name is required'),
  icon: z.string().min(1, 'Icon is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  subServices: z.array(SubServiceSchema).min(1, 'At least one sub-service is required'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const ServicesDataSchema = z.object({
  services: z.array(ServiceSchema),
  lastUpdated: z.string(),
})

export type PackageFormType = z.infer<typeof PackageSchema>
export type SubServiceFormType = z.infer<typeof SubServiceSchema>
export type ServiceFormType = z.infer<typeof ServiceSchema>
export type ServicesDataType = z.infer<typeof ServicesDataSchema>
