export interface Package {
  id: string
  name: string
  price: number
  features: string[]
  description?: string
}

export interface SubService {
  id: string
  name: string
  icon?: string
  packages: Package[]
  description?: string
}

export interface Service {
  id: string
  name: string
  icon: string
  category: string
  subServices: SubService[]
  description?: string
}

export interface ServicesData {
  services: Service[]
  lastUpdated?: string
}

export type ServiceFormData = Omit<Service, 'id' | 'subServices'> & {
  subServices?: SubService[]
}

export type SubServiceFormData = Omit<SubService, 'id' | 'packages'> & {
  packages?: Package[]
}

export type PackageFormData = Omit<Package, 'id'>
