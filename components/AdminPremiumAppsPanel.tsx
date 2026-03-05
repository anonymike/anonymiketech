'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Badge,
  DollarSign,
  Sparkles,
  Loader,
} from 'lucide-react'
import { PremiumApp } from '@/lib/premium-apps-data'
import {
  getPremiumAppsFromDB,
  createPremiumAppInDB,
  updatePremiumAppInDB,
  deletePremiumAppFromDB,
} from '@/lib/supabase-premium-apps-service'

export default function AdminPremiumAppsPanel() {
  const [apps, setApps] = useState<PremiumApp[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<PremiumApp>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Load apps on mount
  useEffect(() => {
    loadApps()
  }, [])

  const loadApps = async () => {
    setLoading(true)
    try {
      const loadedApps = await getPremiumAppsFromDB()
      setApps(loadedApps)
    } catch (error) {
      console.error('Error loading apps:', error)
      setMessage({ type: 'error', text: 'Failed to load apps' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      longDescription: '',
      category: '',
      icon: '📱',
      price: 100,
      image: '',
      features: [],
      downloads: 0,
      isNew: false,
      isOffer: false,
      offerPrice: undefined,
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleEdit = (app: PremiumApp) => {
    console.log('[v0] Editing app:', app)
    setFormData(app)
    setEditingId(app.id)
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name || !formData.description || !formData.longDescription || !formData.category) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setLoading(true)
    try {
      console.log('[v0] Saving app with data:', formData)
      if (editingId) {
        const result = await updatePremiumAppInDB(editingId, formData)
        console.log('[v0] Update result:', result)
        setMessage({ type: 'success', text: 'App updated successfully!' })
      } else {
        const result = await createPremiumAppInDB(formData as Omit<PremiumApp, 'id'>)
        console.log('[v0] Create result:', result)
        setMessage({ type: 'success', text: 'App created successfully!' })
      }
      // Refresh immediately after save
      const updatedApps = await getPremiumAppsFromDB()
      console.log('[v0] Loaded apps after save:', updatedApps)
      setApps(updatedApps)
      resetForm()
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    } catch (error) {
      console.error('[v0] Error saving app:', error)
      setMessage({ type: 'error', text: 'Error saving app. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this app?')) {
      setLoading(true)
      try {
        console.log('[v0] Deleting app with id:', id)
        const success = await deletePremiumAppFromDB(id)
        console.log('[v0] Delete success:', success)
        if (success) {
          const updatedApps = await getPremiumAppsFromDB()
          console.log('[v0] Loaded apps after delete:', updatedApps)
          setApps(updatedApps)
          setMessage({ type: 'success', text: 'App deleted successfully!' })
          setTimeout(() => setMessage(null), 2000)
        } else {
          setMessage({ type: 'error', text: 'Failed to delete app' })
        }
      } catch (error) {
        console.error('[v0] Error deleting app:', error)
        setMessage({ type: 'error', text: 'Error deleting app. Please try again.' })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 1MB' })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        console.log('[v0] Image uploaded, size:', base64String.length)
        setFormData({ ...formData, image: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFeaturesChange = (value: string) => {
    const features = value.split('\n').filter(f => f.trim())
    setFormData({ ...formData, features })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-hacker-green-bright font-tech">Premium Apps Manager</h2>
          <p className="text-sm text-hacker-green-dim mt-1">Manage all your premium app listings</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsAddingNew(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-bold rounded-lg hover:shadow-lg hover:shadow-hacker-green/50 transition-all"
        >
          <Plus size={20} />
          Add New App
        </button>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded-lg border ${
              message.type === 'success'
                ? 'border-hacker-green/50 bg-hacker-green/10 text-hacker-green'
                : 'border-red-500/50 bg-red-500/10 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Section */}
      <AnimatePresence>
        {(isAddingNew || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-hacker-green/40 rounded-lg bg-hacker-green/5 p-6 space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-hacker-green-bright">
                {editingId ? 'Edit App' : 'Create New App'}
              </h3>
              <button
                onClick={resetForm}
                className="text-hacker-green-dim hover:text-hacker-green transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                  App Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                  placeholder="e.g., Telegram Premium Mod"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                  placeholder="e.g., Messaging"
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green text-2xl text-center"
                  placeholder="📱"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                  Price (KSH) *
                </label>
                <input
                  type="number"
                  value={formData.price || 100}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                />
              </div>

              {/* Is New Badge */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isNew"
                  checked={formData.isNew || false}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isNew" className="text-sm font-bold text-hacker-green-bright flex items-center gap-2">
                  <Sparkles size={16} />
                  Mark as New
                </label>
              </div>

              {/* Is Offer */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOffer"
                  checked={formData.isOffer || false}
                  onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="isOffer" className="text-sm font-bold text-hacker-green-bright flex items-center gap-2">
                  <DollarSign size={16} />
                  Has Offer
                </label>
              </div>

              {/* Offer Price */}
              {formData.isOffer && (
                <div>
                  <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                    Offer Price (KSH)
                  </label>
                  <input
                    type="number"
                    value={formData.offerPrice || ''}
                    onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                    placeholder="80"
                  />
                </div>
              )}

              {/* Downloads */}
              <div>
                <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                  Downloads Count
                </label>
                <input
                  type="number"
                  value={formData.downloads || 0}
                  onChange={(e) => setFormData({ ...formData, downloads: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                Short Description *
              </label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                placeholder="Brief one-line description"
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                Long Description *
              </label>
              <textarea
                value={formData.longDescription || ''}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green"
                placeholder="Detailed description of the app"
                rows={4}
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-bold text-hacker-green-bright mb-2">
                Features (one per line)
              </label>
              <textarea
                value={formData.features?.join('\n') || ''}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright placeholder-hacker-green-dim focus:outline-none focus:border-hacker-green font-mono text-sm"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-hacker-green-bright mb-2 flex items-center gap-2">
                <ImageIcon size={16} />
                App Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 rounded bg-hacker-terminal border border-hacker-green/30 text-hacker-green-bright focus:outline-none focus:border-hacker-green"
              />
              {formData.image && (
                <div className="mt-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-32 w-32 rounded object-cover border border-hacker-green/40"
                  />
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-hacker-green to-emerald-400 text-hacker-terminal font-bold rounded-lg hover:shadow-lg hover:shadow-hacker-green/50 transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Saving...' : editingId ? 'Update App' : 'Create App'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apps List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-hacker-green-bright mb-4">
          All Apps ({apps.length})
        </h3>
        {apps.length === 0 ? (
          <div className="text-center p-8 border border-hacker-green/30 rounded-lg bg-hacker-green/5">
            <p className="text-hacker-green-dim">No premium apps yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-hacker-green/40 rounded-lg bg-hacker-green/5 p-4 hover:bg-hacker-green/10 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{app.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-hacker-green-bright text-sm">{app.name}</h4>
                      <p className="text-xs text-hacker-green-dim">{app.category}</p>
                      <div className="flex gap-2 mt-2">
                        {app.isNew && (
                          <span className="px-2 py-1 text-xs font-bold rounded bg-hacker-green text-hacker-terminal">
                            NEW
                          </span>
                        )}
                        {app.isOffer && (
                          <span className="px-2 py-1 text-xs font-bold rounded bg-red-500 text-white">
                            OFFER
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-hacker-green-dim mb-3">{app.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="border border-hacker-green/30 rounded p-2 bg-hacker-terminal/50">
                    <p className="text-hacker-green-dim">Price</p>
                    <p className="font-bold text-hacker-green-bright">
                      {app.isOffer && app.offerPrice ? (
                        <>
                          <span className="line-through text-hacker-green-dim">KSH {app.price}</span>
                          <br />
                          KSH {app.offerPrice}
                        </>
                      ) : (
                        `KSH ${app.price}`
                      )}
                    </p>
                  </div>
                  <div className="border border-hacker-green/30 rounded p-2 bg-hacker-terminal/50">
                    <p className="text-hacker-green-dim">Downloads</p>
                    <p className="font-bold text-hacker-green-bright">{app.downloads}+</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(app)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold text-hacker-green border border-hacker-green/50 hover:bg-hacker-green/10 transition-all"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold text-red-400 border border-red-500/50 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
