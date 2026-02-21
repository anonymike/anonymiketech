'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Loader,
} from 'lucide-react'
import Link from 'next/link'
import type { Service, SubService, Package } from '@/lib/types/services'

interface ServiceFormState {
  isOpen: boolean
  editingId: string | null
  formData: {
    name: string
    icon: string
    category: string
    description: string
  }
}

interface SubServiceFormState {
  isOpen: boolean
  serviceId: string | null
  editingId: string | null
  formData: {
    name: string
  }
}

interface PackageFormState {
  isOpen: boolean
  serviceId: string | null
  subServiceId: string | null
  editingId: string | null
  formData: {
    name: string
    price: number
    features: string
  }
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())
  const [expandedSubServices, setExpandedSubServices] = useState<Set<string>>(new Set())

  const [serviceForm, setServiceForm] = useState<ServiceFormState>({
    isOpen: false,
    editingId: null,
    formData: { name: '', icon: '', category: '', description: '' },
  })

  const [subServiceForm, setSubServiceForm] = useState<SubServiceFormState>({
    isOpen: false,
    serviceId: null,
    editingId: null,
    formData: { name: '' },
  })

  const [packageForm, setPackageForm] = useState<PackageFormState>({
    isOpen: false,
    serviceId: null,
    subServiceId: null,
    editingId: null,
    formData: { name: '', price: 0, features: '' },
  })

  const [saving, setSaving] = useState(false)

  // Fetch services
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      setServices(data.services || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching services:', err)
      setError('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  // Service CRUD operations
  const handleAddService = async () => {
    if (!serviceForm.formData.name || !serviceForm.formData.icon || !serviceForm.formData.category) {
      setError('Please fill all required fields')
      return
    }

    setSaving(true)
    try {
      const endpoint = serviceForm.editingId ? '/api/admin/services' : '/api/admin/services'
      const method = serviceForm.editingId ? 'PUT' : 'POST'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: serviceForm.editingId,
          name: serviceForm.formData.name,
          icon: serviceForm.formData.icon,
          category: serviceForm.formData.category,
          description: serviceForm.formData.description,
          subServices: serviceForm.editingId
            ? services.find(s => s.id === serviceForm.editingId)?.subServices || []
            : [],
        }),
      })

      if (res.ok) {
        await fetchServices()
        setServiceForm({ isOpen: false, editingId: null, formData: { name: '', icon: '', category: '', description: '' } })
        setError(null)
      } else {
        setError('Failed to save service')
      }
    } catch (err) {
      console.error('Error saving service:', err)
      setError('Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchServices()
        setError(null)
      } else {
        setError('Failed to delete service')
      }
    } catch (err) {
      console.error('Error deleting service:', err)
      setError('Failed to delete service')
    } finally {
      setSaving(false)
    }
  }

  const handleEditService = (service: Service) => {
    setServiceForm({
      isOpen: true,
      editingId: service.id,
      formData: {
        name: service.name,
        icon: service.icon,
        category: service.category,
        description: service.description || '',
      },
    })
  }

  // Sub-service CRUD
  const handleAddSubService = async () => {
    if (!subServiceForm.formData.name || !subServiceForm.serviceId) {
      setError('Please enter a sub-service name')
      return
    }

    setSaving(true)
    try {
      const service = services.find(s => s.id === subServiceForm.serviceId)
      if (!service) return

      const newSubService: SubService = {
        id: subServiceForm.editingId || `sub-${Date.now()}`,
        name: subServiceForm.formData.name,
        packages: subServiceForm.editingId
          ? service.subServices.find(ss => ss.id === subServiceForm.editingId)?.packages || []
          : [],
      }

      const updatedSubServices = subServiceForm.editingId
        ? service.subServices.map(ss => (ss.id === subServiceForm.editingId ? newSubService : ss))
        : [...service.subServices, newSubService]

      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name: service.name,
          icon: service.icon,
          category: service.category,
          description: service.description,
          subServices: updatedSubServices,
        }),
      })

      if (res.ok) {
        await fetchServices()
        setSubServiceForm({ isOpen: false, serviceId: null, editingId: null, formData: { name: '' } })
        setError(null)
      } else {
        setError('Failed to save sub-service')
      }
    } catch (err) {
      console.error('Error saving sub-service:', err)
      setError('Failed to save sub-service')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSubService = async (serviceId: string, subServiceId: string) => {
    if (!confirm('Are you sure you want to delete this sub-service?')) return

    setSaving(true)
    try {
      const service = services.find(s => s.id === serviceId)
      if (!service) return

      const updatedSubServices = service.subServices.filter(ss => ss.id !== subServiceId)

      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name: service.name,
          icon: service.icon,
          category: service.category,
          description: service.description,
          subServices: updatedSubServices,
        }),
      })

      if (res.ok) {
        await fetchServices()
        setError(null)
      } else {
        setError('Failed to delete sub-service')
      }
    } catch (err) {
      console.error('Error deleting sub-service:', err)
      setError('Failed to delete sub-service')
    } finally {
      setSaving(false)
    }
  }

  // Package CRUD
  const handleAddPackage = async () => {
    if (!packageForm.formData.name || packageForm.formData.price <= 0 || !packageForm.serviceId || !packageForm.subServiceId) {
      setError('Please fill all package fields')
      return
    }

    setSaving(true)
    try {
      const service = services.find(s => s.id === packageForm.serviceId)
      if (!service) return

      const subService = service.subServices.find(ss => ss.id === packageForm.subServiceId)
      if (!subService) return

      const newPackage: Package = {
        id: packageForm.editingId || `pkg-${Date.now()}`,
        name: packageForm.formData.name,
        price: packageForm.formData.price,
        features: packageForm.formData.features.split('\n').filter(f => f.trim()),
      }

      const updatedPackages = packageForm.editingId
        ? subService.packages.map(p => (p.id === packageForm.editingId ? newPackage : p))
        : [...subService.packages, newPackage]

      const updatedSubServices = service.subServices.map(ss =>
        ss.id === packageForm.subServiceId ? { ...ss, packages: updatedPackages } : ss
      )

      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name: service.name,
          icon: service.icon,
          category: service.category,
          description: service.description,
          subServices: updatedSubServices,
        }),
      })

      if (res.ok) {
        await fetchServices()
        setPackageForm({ isOpen: false, serviceId: null, subServiceId: null, editingId: null, formData: { name: '', price: 0, features: '' } })
        setError(null)
      } else {
        setError('Failed to save package')
      }
    } catch (err) {
      console.error('Error saving package:', err)
      setError('Failed to save package')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePackage = async (serviceId: string, subServiceId: string, packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return

    setSaving(true)
    try {
      const service = services.find(s => s.id === serviceId)
      if (!service) return

      const subService = service.subServices.find(ss => ss.id === subServiceId)
      if (!subService) return

      const updatedPackages = subService.packages.filter(p => p.id !== packageId)
      const updatedSubServices = service.subServices.map(ss =>
        ss.id === subServiceId ? { ...ss, packages: updatedPackages } : ss
      )

      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name: service.name,
          icon: service.icon,
          category: service.category,
          description: service.description,
          subServices: updatedSubServices,
        }),
      })

      if (res.ok) {
        await fetchServices()
        setError(null)
      } else {
        setError('Failed to delete package')
      }
    } catch (err) {
      console.error('Error deleting package:', err)
      setError('Failed to delete package')
    } finally {
      setSaving(false)
    }
  }

  const toggleServiceExpanded = (id: string) => {
    const newSet = new Set(expandedServices)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedServices(newSet)
  }

  const toggleSubServiceExpanded = (id: string) => {
    const newSet = new Set(expandedSubServices)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedSubServices(newSet)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-900/20 to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Services</h1>
            <p className="text-cyan-400">Create, edit, and manage your service offerings</p>
          </div>
          <Link href="/admin" className="text-cyan-400 hover:text-cyan-300 underline">
            Back to Admin
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6"
          >
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Add Service Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            setServiceForm({ isOpen: true, editingId: null, formData: { name: '', icon: '', category: '', description: '' } })
          }
          className="mb-8 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <Plus size={20} />
          Add New Service
        </motion.button>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="animate-spin mx-auto text-cyan-400" size={32} />
          </div>
        ) : (
          <>
            {/* Services List */}
            <div className="space-y-4">
              {services.map(service => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 border border-cyan-500/20 rounded-lg overflow-hidden backdrop-blur-sm hover:border-cyan-500/40 transition-colors"
                >
                  {/* Service Header */}
                  <div
                    onClick={() => toggleServiceExpanded(service.id)}
                    className="p-4 cursor-pointer flex items-center justify-between hover:bg-cyan-500/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        <p className="text-sm text-cyan-400">{service.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleEditService(service)
                        }}
                        className="p-1 hover:bg-cyan-500/20 rounded transition-colors"
                      >
                        <Edit size={18} className="text-cyan-400" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteService(service.id)
                        }}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                      {expandedServices.has(service.id) ? (
                        <ChevronUp size={20} className="text-cyan-400" />
                      ) : (
                        <ChevronDown size={20} className="text-cyan-400" />
                      )}
                    </div>
                  </div>

                  {/* Service Details */}
                  {expandedServices.has(service.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-900/50 border-t border-cyan-500/20 p-4 space-y-4"
                    >
                      {/* Sub-services */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">Sub-Services</h4>
                          <button
                            onClick={() => setSubServiceForm({ isOpen: true, serviceId: service.id, editingId: null, formData: { name: '' } })}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm"
                          >
                            <Plus size={16} />
                            Add
                          </button>
                        </div>

                        <div className="space-y-2">
                          {service.subServices.map(subService => (
                            <motion.div
                              key={subService.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-slate-700/50 border border-emerald-500/20 rounded p-3"
                            >
                              <div
                                onClick={() => toggleSubServiceExpanded(subService.id)}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <span className="text-emerald-200 font-semibold">{subService.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">{subService.packages.length} packages</span>
                                  <button
                                    onClick={e => {
                                      e.stopPropagation()
                                      handleDeleteSubService(service.id, subService.id)
                                    }}
                                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                  >
                                    <Trash2 size={16} className="text-red-400" />
                                  </button>
                                  {expandedSubServices.has(subService.id) ? (
                                    <ChevronUp size={16} className="text-emerald-400" />
                                  ) : (
                                    <ChevronDown size={16} className="text-emerald-400" />
                                  )}
                                </div>
                              </div>

                              {/* Packages */}
                              {expandedSubServices.has(subService.id) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3 pl-3 border-l border-emerald-500/30 space-y-2"
                                >
                                  {subService.packages.map(pkg => (
                                    <motion.div
                                      key={pkg.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="bg-slate-600/50 rounded p-2 flex items-center justify-between"
                                    >
                                      <div className="text-sm">
                                        <p className="text-white font-semibold">{pkg.name}</p>
                                        <p className="text-cyan-300">KES {pkg.price.toLocaleString()}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            setPackageForm({
                                              isOpen: true,
                                              serviceId: service.id,
                                              subServiceId: subService.id,
                                              editingId: pkg.id,
                                              formData: {
                                                name: pkg.name,
                                                price: pkg.price,
                                                features: pkg.features.join('\n'),
                                              },
                                            })
                                          }
                                          className="p-1 hover:bg-cyan-500/20 rounded transition-colors"
                                        >
                                          <Edit size={16} className="text-cyan-400" />
                                        </button>
                                        <button
                                          onClick={() => handleDeletePackage(service.id, subService.id, pkg.id)}
                                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                        >
                                          <Trash2 size={16} className="text-red-400" />
                                        </button>
                                      </div>
                                    </motion.div>
                                  ))}
                                  <button
                                    onClick={() =>
                                      setPackageForm({
                                        isOpen: true,
                                        serviceId: service.id,
                                        subServiceId: subService.id,
                                        editingId: null,
                                        formData: { name: '', price: 0, features: '' },
                                      })
                                    }
                                    className="w-full text-cyan-400 hover:text-cyan-300 py-2 text-sm border border-dashed border-cyan-500/40 rounded transition-colors"
                                  >
                                    + Add Package
                                  </button>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Service Form Modal */}
      <AnimatePresence>
        {serviceForm.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setServiceForm({ isOpen: false, editingId: null, formData: { name: '', icon: '', category: '', description: '' } })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-800 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{serviceForm.editingId ? 'Edit Service' : 'Add New Service'}</h3>
                <button
                  onClick={() => setServiceForm({ isOpen: false, editingId: null, formData: { name: '', icon: '', category: '', description: '' } })}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={serviceForm.formData.name}
                  onChange={e => setServiceForm({ ...serviceForm, formData: { ...serviceForm.formData, name: e.target.value } })}
                  className="w-full bg-slate-700 border border-cyan-500/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Icon (emoji)"
                  value={serviceForm.formData.icon}
                  onChange={e => setServiceForm({ ...serviceForm, formData: { ...serviceForm.formData, icon: e.target.value } })}
                  className="w-full bg-slate-700 border border-cyan-500/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  maxLength={2}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={serviceForm.formData.category}
                  onChange={e => setServiceForm({ ...serviceForm, formData: { ...serviceForm.formData, category: e.target.value } })}
                  className="w-full bg-slate-700 border border-cyan-500/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={serviceForm.formData.description}
                  onChange={e => setServiceForm({ ...serviceForm, formData: { ...serviceForm.formData, description: e.target.value } })}
                  className="w-full bg-slate-700 border border-cyan-500/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 h-24 resize-none"
                />
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setServiceForm({ isOpen: false, editingId: null, formData: { name: '', icon: '', category: '', description: '' } })}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddService}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-4 py-2 rounded transition-all disabled:opacity-50"
                >
                  {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Save'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-Service Form Modal */}
      <AnimatePresence>
        {subServiceForm.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSubServiceForm({ isOpen: false, serviceId: null, editingId: null, formData: { name: '' } })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-800 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Add Sub-Service</h3>
                <button onClick={() => setSubServiceForm({ isOpen: false, serviceId: null, editingId: null, formData: { name: '' } })} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Sub-Service Name"
                value={subServiceForm.formData.name}
                onChange={e => setSubServiceForm({ ...subServiceForm, formData: { name: e.target.value } })}
                className="w-full bg-slate-700 border border-cyan-500/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 mb-4"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setSubServiceForm({ isOpen: false, serviceId: null, editingId: null, formData: { name: '' } })}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddSubService}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-4 py-2 rounded transition-all disabled:opacity-50"
                >
                  {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Package Form Modal */}
      <AnimatePresence>
        {packageForm.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setPackageForm({ isOpen: false, serviceId: null, subServiceId: null, editingId: null, formData: { name: '', price: 0, features: '' } })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-slate-800 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Add Package</h3>
                <button onClick={() => setPackageForm({ isOpen: false, serviceId: null, subServiceId: null, editingId: null, formData: { name: '', price: 0, features: '' } })} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Package Name"
                  value={packageForm.formData.name}
                  onChange={e => setPackageForm({ ...packageForm, formData: { ...packageForm.formData, name: e.target.value } })}
                  className="w-full bg-slate-700 border border-cyan-500/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="number"
                  placeholder="Price (KES)"
                  value={packageForm.formData.price}
                  onChange={e => setPackageForm({ ...packageForm, formData: { ...packageForm.formData, price: parseFloat(e.target.value) || 0 } })}
                  className="w-full bg-slate-700 border border-cyan-500/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
                <textarea
                  placeholder="Features (one per line)"
                  value={packageForm.formData.features}
                  onChange={e => setPackageForm({ ...packageForm, formData: { ...packageForm.formData, features: e.target.value } })}
                  className="w-full bg-slate-700 border border-cyan-500/20 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 h-24 resize-none"
                />
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setPackageForm({ isOpen: false, serviceId: null, subServiceId: null, editingId: null, formData: { name: '', price: 0, features: '' } })}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddPackage}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-4 py-2 rounded transition-all disabled:opacity-50"
                >
                  {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
