"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SubService {
  id: string
  name: string
  price: number
  quantity?: number
}

interface Service {
  id: string
  name: string
  icon: string
  category: string
  subServices: SubService[]
  createdAt: string
  updatedAt: string
}

export default function AdminServicesPanel() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showNewServiceForm, setShowNewServiceForm] = useState(false)
  const [showNewSubServiceForm, setShowNewSubServiceForm] = useState<string | null>(null)

  // Form states
  const [newServiceForm, setNewServiceForm] = useState({ name: "", icon: "", category: "Popular" })
  const [editServiceForm, setEditServiceForm] = useState({ name: "", icon: "", category: "" })
  const [newSubServiceForm, setNewSubServiceForm] = useState({ name: "", price: 0 })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/services")
      const data = await res.json()
      setServices(data.services || [])
    } catch (error) {
      console.error("Failed to fetch services:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = async () => {
    if (!newServiceForm.name || !newServiceForm.icon || !newServiceForm.category) {
      alert("All fields are required")
      return
    }

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newServiceForm),
      })
      const data = await res.json()

      if (data.success) {
        setServices([...services, data.service])
        setNewServiceForm({ name: "", icon: "", category: "Popular" })
        setShowNewServiceForm(false)
      }
    } catch (error) {
      console.error("Failed to create service:", error)
      alert("Failed to create service")
    }
  }

  const handleUpdateService = async () => {
    if (!editingService) return

    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingService.id,
          ...editServiceForm,
        }),
      })
      const data = await res.json()

      if (data.success) {
        setServices(services.map((s) => (s.id === editingService.id ? data.service : s)))
        setEditingService(null)
        setEditServiceForm({ name: "", icon: "", category: "" })
      }
    } catch (error) {
      console.error("Failed to update service:", error)
      alert("Failed to update service")
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      const res = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: serviceId }),
      })
      const data = await res.json()

      if (data.success) {
        setServices(services.filter((s) => s.id !== serviceId))
      }
    } catch (error) {
      console.error("Failed to delete service:", error)
      alert("Failed to delete service")
    }
  }

  const handleAddSubService = async (serviceId: string) => {
    if (!newSubServiceForm.name || newSubServiceForm.price <= 0) {
      alert("Please fill in all fields with valid values")
      return
    }

    try {
      const res = await fetch(`/api/admin/services/${serviceId}/subservices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubServiceForm),
      })
      const data = await res.json()

      if (data.success) {
        fetchServices()
        setNewSubServiceForm({ name: "", price: 0 })
        setShowNewSubServiceForm(null)
      }
    } catch (error) {
      console.error("Failed to add sub-service:", error)
      alert("Failed to add sub-service")
    }
  }

  const handleDeleteSubService = async (serviceId: string, subServiceId: string) => {
    if (!confirm("Are you sure you want to delete this sub-service?")) return

    try {
      const res = await fetch(`/api/admin/services/${serviceId}/subservices`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subServiceId }),
      })
      const data = await res.json()

      if (data.success) {
        fetchServices()
      }
    } catch (error) {
      console.error("Failed to delete sub-service:", error)
      alert("Failed to delete sub-service")
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setEditServiceForm({ name: service.name, icon: service.icon, category: service.category })
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-hacker-green-bright">Services Management</h2>
        <Button
          onClick={() => setShowNewServiceForm(true)}
          className="bg-hacker-green/20 border border-hacker-green text-hacker-green-bright hover:bg-hacker-green/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* New Service Form */}
      <AnimatePresence>
        {showNewServiceForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-4 bg-hacker-terminal/50 border border-hacker-green/30 rounded-lg space-y-4">
            <h3 className="text-hacker-green-bright font-semibold">Add New Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Service Name (e.g., Telegram)"
                value={newServiceForm.name}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                className="bg-hacker-terminal border-hacker-green/30 text-hacker-green"
              />
              <Input
                placeholder="Icon/Emoji (e.g., 📱)"
                value={newServiceForm.icon}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, icon: e.target.value })}
                className="bg-hacker-terminal border-hacker-green/30 text-hacker-green"
                maxLength={3}
              />
              <select
                value={newServiceForm.category}
                onChange={(e) => setNewServiceForm({ ...newServiceForm, category: e.target.value })}
                className="bg-hacker-terminal border border-hacker-green/30 text-hacker-green px-3 py-2 rounded"
              >
                <option value="Popular">Popular</option>
                <option value="All Platforms">All Platforms</option>
                <option value="Free Services">Free Services</option>
                <option value="African Services">African Services</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateService}
                className="bg-hacker-green/20 border border-hacker-green text-hacker-green-bright hover:bg-hacker-green/30"
              >
                <Check className="w-4 h-4 mr-2" />
                Create
              </Button>
              <Button
                onClick={() => setShowNewServiceForm(false)}
                variant="outline"
                className="border-hacker-green/30 text-hacker-green-dim hover:text-hacker-green"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-hacker-green-dim text-center py-8">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-hacker-green-dim text-center py-8">No services created yet. Add one to get started!</div>
        ) : (
          services.map((service) => (
            <motion.div key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-hacker-green/30 rounded-lg overflow-hidden">
              {/* Service Header */}
              <div
                onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                className="p-4 bg-hacker-terminal/30 hover:bg-hacker-terminal/50 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <p className="text-hacker-green-bright font-semibold">{service.name}</p>
                    <p className="text-hacker-green-dim text-sm">{service.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-hacker-green-dim text-sm">{service.subServices.length} sub-services</span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditService(service)
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-hacker-green-dim hover:text-hacker-green-bright"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteService(service.id)
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {expandedService === service.id ? (
                    <ChevronUp className="w-5 h-5 text-hacker-green" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-hacker-green-dim" />
                  )}
                </div>
              </div>

              {/* Edit Service Form */}
              <AnimatePresence>
                {editingService?.id === service.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-hacker-terminal/20 border-t border-hacker-green/30 space-y-3">
                    <h4 className="text-hacker-green-bright font-semibold">Edit Service</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Service Name"
                        value={editServiceForm.name}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, name: e.target.value })}
                        className="bg-hacker-terminal border-hacker-green/30 text-hacker-green"
                      />
                      <Input
                        placeholder="Icon/Emoji"
                        value={editServiceForm.icon}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, icon: e.target.value })}
                        className="bg-hacker-terminal border-hacker-green/30 text-hacker-green"
                        maxLength={3}
                      />
                      <select
                        value={editServiceForm.category}
                        onChange={(e) => setEditServiceForm({ ...editServiceForm, category: e.target.value })}
                        className="bg-hacker-terminal border border-hacker-green/30 text-hacker-green px-3 py-2 rounded"
                      >
                        <option value="Popular">Popular</option>
                        <option value="All Platforms">All Platforms</option>
                        <option value="Free Services">Free Services</option>
                        <option value="African Services">African Services</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdateService}
                        className="bg-hacker-green/20 border border-hacker-green text-hacker-green-bright hover:bg-hacker-green/30"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingService(null)
                          setEditServiceForm({ name: "", icon: "", category: "" })
                        }}
                        variant="outline"
                        className="border-hacker-green/30 text-hacker-green-dim hover:text-hacker-green"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expanded Content - Sub Services */}
              <AnimatePresence>
                {expandedService === service.id && editingService?.id !== service.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-hacker-terminal/20 border-t border-hacker-green/30 space-y-4">
                    {/* Sub Services List */}
                    <div className="space-y-2">
                      <h4 className="text-hacker-green-bright font-semibold">Sub-Services</h4>
                      {service.subServices.length === 0 ? (
                        <p className="text-hacker-green-dim text-sm">No sub-services yet</p>
                      ) : (
                        <div className="space-y-2">
                          {service.subServices.map((subService) => (
                            <div key={subService.id} className="flex items-center justify-between p-2 bg-hacker-terminal/50 rounded border border-hacker-green/20">
                              <div className="flex-1">
                                <p className="text-hacker-green-bright text-sm font-medium">{subService.name}</p>
                                <p className="text-hacker-green-dim text-xs">Price: ${subService.price.toFixed(2)}</p>
                              </div>
                              <Button
                                onClick={() => handleDeleteSubService(service.id, subService.id)}
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add Sub Service Form */}
                    {showNewSubServiceForm === service.id ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 bg-hacker-terminal/50 border border-hacker-green/30 rounded space-y-3">
                        <h4 className="text-hacker-green-bright font-semibold text-sm">Add Sub-Service</h4>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Sub-service name"
                            value={newSubServiceForm.name}
                            onChange={(e) => setNewSubServiceForm({ ...newSubServiceForm, name: e.target.value })}
                            className="bg-hacker-terminal border-hacker-green/30 text-hacker-green flex-1"
                          />
                          <Input
                            placeholder="Price"
                            type="number"
                            step="0.01"
                            value={newSubServiceForm.price}
                            onChange={(e) => setNewSubServiceForm({ ...newSubServiceForm, price: parseFloat(e.target.value) })}
                            className="bg-hacker-terminal border-hacker-green/30 text-hacker-green w-20"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddSubService(service.id)}
                            size="sm"
                            className="bg-hacker-green/20 border border-hacker-green text-hacker-green-bright hover:bg-hacker-green/30"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                          <Button
                            onClick={() => {
                              setShowNewSubServiceForm(null)
                              setNewSubServiceForm({ name: "", price: 0 })
                            }}
                            size="sm"
                            variant="outline"
                            className="border-hacker-green/30 text-hacker-green-dim"
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <Button
                        onClick={() => setShowNewSubServiceForm(service.id)}
                        size="sm"
                        className="bg-hacker-green/20 border border-hacker-green text-hacker-green-bright hover:bg-hacker-green/30 w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Sub-Service
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
