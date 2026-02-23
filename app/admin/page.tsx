"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Eye,
  Download,
  Filter,
  Search,
  Activity,
  Globe,
  Share2,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Heart,
  Key,
  Link as LinkIcon,
  Settings,
  Lock,
} from "lucide-react"
import Link from "next/link"
import MatrixRain from "@/components/MatrixRain"
import MobileMenu from "@/components/MobileMenu"
import BackToTop from "@/components/BackToTop"
import AdminServicesPanel from "@/components/AdminServicesPanel"
import AdminSidebar from "@/components/AdminSidebar"
import AdminImageUpload from "@/components/AdminImageUpload"

interface Order {
  id: number
  items: Array<{
    type: string
    quantity: number
    domain: string
    price: number
  }>
  totalPrice: number
  customerDetails: {
    fullName: string
    phone: string
    message: string
  }
  orderDate: string
  status: string
  orderType?: "website" | "social-media"
}

const getCurrentYear = () => new Date().getFullYear()

export default function AdminDashboard() {
  const [adminPassword, setAdminPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "website" | "social-media" | "services">("all")
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [pwChangeLoading, setPwChangeLoading] = useState(false)
  const [pwChangeMsg, setPwChangeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("allOrders") || "[]")
    const classifiedOrders = storedOrders.map((order: Order) => {
      const isSocialMedia = order.items.some(
        (item) =>
          item.type.toLowerCase().includes("youtube") ||
          item.type.toLowerCase().includes("instagram") ||
          item.type.toLowerCase().includes("tiktok") ||
          item.type.toLowerCase().includes("facebook") ||
          item.type.toLowerCase().includes("twitter"),
      )
      return {
        ...order,
        orderType: isSocialMedia ? "social-media" : "website",
      }
    })
    setOrders(classifiedOrders.reverse())
    setFilteredOrders(classifiedOrders.reverse())
  }, [isAuthenticated])

  useEffect(() => {
    let filtered = orders

    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.orderType === activeTab)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customerDetails.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerDetails.phone.includes(searchTerm) ||
          order.id.toString().includes(searchTerm),
      )
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders, activeTab])

  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginError("")
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      })
      const data = await res.json()
      if (data.valid) {
        setIsAuthenticated(true)
      } else {
        setLoginError("Invalid password")
      }
    } catch {
      setLoginError("Connection error. Please try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setPwChangeMsg(null)
    if (!currentPw || !newPw || !confirmPw) {
      setPwChangeMsg({ type: "error", text: "All fields are required" })
      return
    }
    if (newPw !== confirmPw) {
      setPwChangeMsg({ type: "error", text: "New passwords do not match" })
      return
    }
    if (newPw.length < 6) {
      setPwChangeMsg({ type: "error", text: "New password must be at least 6 characters" })
      return
    }
    setPwChangeLoading(true)
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setPwChangeMsg({ type: "success", text: "Password updated successfully!" })
        setCurrentPw("")
        setNewPw("")
        setConfirmPw("")
      } else {
        setPwChangeMsg({ type: "error", text: data.error || "Failed to update password" })
      }
    } catch {
      setPwChangeMsg({ type: "error", text: "Connection error. Please try again." })
    } finally {
      setPwChangeLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <MatrixRain />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-slate-900/80 border-2 border-emerald-500/40 rounded-2xl p-8 max-w-md w-full backdrop-blur-sm"
          style={{ boxShadow: "0 0 40px rgba(16, 185, 129, 0.1)" }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Admin Access
            </h1>
            <p className="text-slate-400 text-sm">Enter password to access the dashboard</p>
          </div>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => { setAdminPassword(e.target.value); setLoginError("") }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 bg-slate-800/80 border-2 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none mb-2 transition-colors"
          />
          {loginError && (
            <p className="text-red-400 text-sm mb-2 text-center">{loginError}</p>
          )}
          <motion.button
            whileHover={{ scale: loginLoading ? 1 : 1.02, boxShadow: loginLoading ? "none" : "0 0 20px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: loginLoading ? 1 : 0.98 }}
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full px-4 py-3 mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loginLoading ? "Verifying..." : "Access Dashboard"}
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const getStats = () => {
    const tabOrders = activeTab === "all" ? orders : orders.filter((o) => o.orderType === activeTab)
    return {
      totalRevenue: tabOrders.reduce((sum, order) => sum + order.totalPrice, 0),
      totalOrders: tabOrders.length,
      completedOrders: tabOrders.filter((o) => o.status === "completed").length,
      pendingOrders: tabOrders.filter((o) => o.status === "pending").length,
    }
  }

  const stats = getStats()

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("allOrders", JSON.stringify(updatedOrders.reverse()))
  }

  const exportOrders = () => {
    const dataStr = JSON.stringify(filteredOrders, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `orders-${activeTab}-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative flex lg:flex-row flex-col">
      <MobileMenu />
      <BackToTop />
      <MatrixRain />

      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={() => setIsAuthenticated(false)}
      />

      <div className="flex-1 relative z-10 w-full lg:pt-0 pt-16">
        <div className="container mx-auto px-4 py-8 lg:py-16">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-slate-400 flex items-center gap-2 text-sm md:text-base">
                <Activity className="w-4 w-4 md:w-5 md:h-5 text-emerald-400" />
                Real-time Order Management
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full md:w-auto">
              <Link href="/admin/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-bold hover:bg-cyan-500/30 transition-all"
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">Services</span>
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm border font-bold transition-all ${showPasswordChange ? "bg-amber-500/30 border-amber-500/60 text-amber-300" : "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"}`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Password Change Panel */}
          <AnimatePresence>
            {showPasswordChange && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-slate-900/80 border-2 border-amber-500/30 rounded-2xl p-6 backdrop-blur-sm space-y-8">
                  {/* Admin Image Upload Section */}
                  <div className="pb-6 border-b border-slate-700">
                    <AdminImageUpload />
                  </div>

                  {/* Password Change Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Change Admin Password</h3>
                        <p className="text-slate-400 text-sm">This will update the password for all admin pages</p>
                      </div>
                    </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPw}
                        onChange={(e) => { setCurrentPw(e.target.value); setPwChangeMsg(null) }}
                        placeholder="Current password"
                        className="w-full px-4 py-2.5 bg-slate-800/80 border-2 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPw}
                        onChange={(e) => { setNewPw(e.target.value); setPwChangeMsg(null) }}
                        placeholder="New password (min 6 chars)"
                        className="w-full px-4 py-2.5 bg-slate-800/80 border-2 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPw}
                        onChange={(e) => { setConfirmPw(e.target.value); setPwChangeMsg(null) }}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2.5 bg-slate-800/80 border-2 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: pwChangeLoading ? 1 : 1.02 }}
                      whileTap={{ scale: pwChangeLoading ? 1 : 0.98 }}
                      onClick={handlePasswordChange}
                      disabled={pwChangeLoading}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {pwChangeLoading ? "Updating..." : "Update Password"}
                    </motion.button>
                    {pwChangeMsg && (
                      <p className={`text-sm font-medium ${pwChangeMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                        {pwChangeMsg.text}
                      </p>
                    )}
                  </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {[
              { id: "all", label: "All Orders", icon: BarChart3 },
              { id: "website", label: "Website Development", icon: Globe },
              { id: "social-media", label: "Social Media Boosting", icon: Share2 },
              { id: "services", label: "Services Management", icon: Package },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              )
            })}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShoppingCart,
                label: "Total Orders",
                value: stats.totalOrders,
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-500/10",
                borderColor: "border-blue-500/30",
              },
              {
                icon: TrendingUp,
                label: "Total Revenue",
                value: `KSH ${stats.totalRevenue.toLocaleString()}`,
                color: "from-emerald-500 to-green-500",
                bgColor: "bg-emerald-500/10",
                borderColor: "border-emerald-500/30",
              },
              {
                icon: CheckCircle2,
                label: "Completed",
                value: stats.completedOrders,
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-purple-500/10",
                borderColor: "border-purple-500/30",
              },
              {
                icon: Clock,
                label: "Pending",
                value: stats.pendingOrders,
                color: "from-orange-500 to-yellow-500",
                bgColor: "bg-orange-500/10",
                borderColor: "border-orange-500/30",
              },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl p-6 bg-slate-800/50 border ${stat.borderColor} backdrop-blur-sm hover:bg-slate-800/70 transition-all group ${stat.bgColor}`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} p-3.5 mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <p className="text-slate-400 text-sm mb-2 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Orders Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="rounded-2xl p-8 bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  Recent Orders
                </h2>
                <p className="text-slate-400">
                  Showing {filteredOrders.length} {activeTab === "all" ? "" : activeTab.replace("-", " ")} order(s)
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportOrders}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700/50 border border-slate-600 text-white hover:bg-slate-700 transition-all font-bold"
              >
                <Download className="w-4 h-4" />
                Export Data
              </motion.button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3">
                <Filter className="w-5 h-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900">
                    All Status
                  </option>
                  <option value="pending" className="bg-slate-900">
                    Pending
                  </option>
                  <option value="completed" className="bg-slate-900">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              {filteredOrders.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-slate-900/70">
                    <tr className="border-b border-slate-700">
                      <th className="px-6 py-4 text-left text-slate-300 font-bold">Order ID</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-bold">Customer</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-bold">Type</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-bold">Services</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-bold">Amount</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-bold">Date</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-bold">Status</th>
                      <th className="px-6 py-4 text-left text-slate-300 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-900/30">
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-white font-mono font-bold">#{order.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-bold">{order.customerDetails.fullName}</p>
                            <p className="text-slate-400 text-sm">{order.customerDetails.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                              order.orderType === "website"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            }`}
                          >
                            {order.orderType === "website" ? (
                              <Globe className="w-3 h-3" />
                            ) : (
                              <Share2 className="w-3 h-3" />
                            )}
                            {order.orderType === "website" ? "Website" : "Social Media"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{order.items.length} item(s)</td>
                        <td className="px-6 py-4 text-emerald-400 font-bold">
                          KSH {order.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-sm flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                              order.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-all"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 bg-slate-900/30">
                  <Package className="w-20 h-20 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg font-medium">No orders found</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-2xl p-8 bg-slate-900 border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Order #{selectedOrder.id}</h2>
                    <p className="text-slate-400 mt-1">
                      {selectedOrder.orderType === "website" ? "Website Development" : "Social Media Boosting"}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedOrder(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-8 h-8" />
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                      Customer Details
                    </h3>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-2">
                      <p className="text-slate-300">
                        <span className="text-white font-bold">Name:</span> {selectedOrder.customerDetails.fullName}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-white font-bold">Phone:</span> {selectedOrder.customerDetails.phone}
                      </p>
                      <p className="text-slate-300">
                        <span className="text-white font-bold">Date:</span>{" "}
                        {new Date(selectedOrder.orderDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-cyan-400" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                          <p className="text-white font-bold">{item.type}</p>
                          <p className="text-slate-400 text-sm mt-1">
                            Quantity: {item.quantity}x | Domain: {item.domain}
                          </p>
                          <p className="text-emerald-400 font-bold mt-2">KSH {item.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-700 pt-6">
                    <p className="text-slate-400 mb-2">
                      <span className="text-white font-bold">Total Amount:</span>
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      KSH {selectedOrder.totalPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        updateOrderStatus(
                          selectedOrder.id,
                          selectedOrder.status === "pending" ? "completed" : "pending",
                        )
                        setSelectedOrder(null)
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg hover:shadow-emerald-500/50"
                    >
                      Mark as {selectedOrder.status === "pending" ? "Completed" : "Pending"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedOrder(null)}
                      className="flex-1 py-3 rounded-xl border-2 border-slate-600 text-white font-bold hover:bg-slate-800"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Management Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm mt-8"
            >
              <AdminServicesPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer className="py-8 border-t border-slate-800 mt-16">
          <div className="text-center">
            <p className="text-slate-400">© anonymiketech_inc@{getCurrentYear()} - Admin Dashboard v2.0</p>
          </div>
        </motion.footer>
        </div>
      </div>
    </div>
  )
}
