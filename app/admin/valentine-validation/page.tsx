"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X, Search, Download, Filter, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

interface ValentineTransaction {
  id: string
  token: string
  firstName: string
  recipientName: string
  mpesaCode: string
  amount: number
  status: "pending" | "verified" | "rejected"
  createdAt: string
  notes: string
}

export default function ValentineValidationDashboard() {
  const [transactions, setTransactions] = useState<ValentineTransaction[]>([
    // Sample data - in production this would come from your backend
    {
      id: "1",
      token: "VAL20260214001",
      firstName: "John",
      recipientName: "Sarah",
      mpesaCode: "LIJ7G8R2S8",
      amount: 99,
      status: "pending",
      createdAt: new Date().toISOString(),
      notes: "",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all")
  const [selectedTransaction, setSelectedTransaction] = useState<ValentineTransaction | null>(null)
  const [adminPassword, setAdminPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const handleAuthentication = async () => {
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

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.mpesaCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || tx.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const updateTransactionStatus = (id: string, status: "verified" | "rejected", notes = "") => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id
          ? { ...tx, status, notes }
          : tx
      )
    )
    setSelectedTransaction(null)
  }

  const exportData = () => {
    const csv = [
      ["Token", "First Name", "Recipient Name", "M-Pesa Code", "Amount", "Status", "Date", "Notes"],
      ...transactions.map((tx) => [
        tx.token,
        tx.firstName,
        tx.recipientName,
        tx.mpesaCode,
        tx.amount,
        tx.status,
        tx.createdAt,
        tx.notes,
      ]),
    ]
    const csvContent = csv.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "valentine-transactions.csv"
    a.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-hacker-terminal flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-hacker-terminal border-2 border-hacker-green/50 rounded-2xl p-8 max-w-md w-full"
        >
          <h1 className="text-3xl font-tech font-bold text-hacker-green mb-6 text-center">
            Admin Access
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-tech text-hacker-green-bright mb-2">
                Enter Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setLoginError("") }}
                onKeyPress={(e) => e.key === "Enter" && handleAuthentication()}
                className="w-full px-4 py-2 bg-hacker-terminal border-2 border-hacker-green/30 rounded-lg text-hacker-green-bright focus:border-hacker-green focus:outline-none font-tech"
                placeholder="Enter password"
              />
              {loginError && <p className="text-red-400 text-sm font-tech mt-1">{loginError}</p>}
            </div>
            <button
              onClick={handleAuthentication}
              disabled={loginLoading}
              className="w-full px-4 py-2 bg-hacker-green text-hacker-terminal font-tech font-bold rounded-lg hover:bg-hacker-green-bright transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Verifying..." : "Access Dashboard"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const stats = {
    total: transactions.length,
    pending: transactions.filter((tx) => tx.status === "pending").length,
    verified: transactions.filter((tx) => tx.status === "verified").length,
    rejected: transactions.filter((tx) => tx.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-hacker-terminal p-4 md:p-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-tech font-bold text-hacker-green mb-2">
              Valentine Transaction Validation
            </h1>
            <p className="text-hacker-green-dim font-tech">Verify M-Pesa payments and manage tokens</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/admin/valentine-tokens"
              className="flex items-center gap-2 px-4 py-2 bg-hacker-green/20 border border-hacker-green rounded-lg text-hacker-green hover:bg-hacker-green/30 transition-all font-tech"
            >
              <LinkIcon className="w-4 h-4" />
              Manage Tokens
            </Link>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-hacker-green/20 border border-hacker-green rounded-lg text-hacker-green hover:bg-hacker-green/30 transition-all font-tech"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "hacker-green" },
            { label: "Pending", value: stats.pending, color: "yellow-500" },
            { label: "Verified", value: stats.verified, color: "green-500" },
            { label: "Rejected", value: stats.rejected, color: "red-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`bg-hacker-terminal border-2 border-${stat.color}/30 rounded-lg p-4`}
            >
              <p className={`text-sm font-tech text-${stat.color}/60 mb-1`}>{stat.label}</p>
              <p className={`text-2xl font-tech font-bold text-${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-hacker-green-dim" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, M-Pesa code, or token..."
              className="w-full pl-10 pr-4 py-2 bg-hacker-terminal border-2 border-hacker-green/30 rounded-lg text-hacker-green-bright focus:border-hacker-green focus:outline-none font-tech"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-hacker-green" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 bg-hacker-terminal border-2 border-hacker-green/30 rounded-lg text-hacker-green-bright focus:border-hacker-green focus:outline-none font-tech"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-hacker-terminal/50 border-2 border-hacker-green/30 rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-tech">
              <thead>
                <tr className="border-b border-hacker-green/20 bg-hacker-green/5">
                  <th className="px-4 py-3 text-left text-hacker-green">Token</th>
                  <th className="px-4 py-3 text-left text-hacker-green">First Name</th>
                  <th className="px-4 py-3 text-left text-hacker-green">Recipient</th>
                  <th className="px-4 py-3 text-left text-hacker-green">M-Pesa Code</th>
                  <th className="px-4 py-3 text-left text-hacker-green">Amount</th>
                  <th className="px-4 py-3 text-left text-hacker-green">Status</th>
                  <th className="px-4 py-3 text-left text-hacker-green">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      whileHover={{ backgroundColor: "rgba(0, 255, 0, 0.05)" }}
                      className="border-b border-hacker-green/10 hover:bg-hacker-green/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-hacker-green-bright">{tx.token}</td>
                      <td className="px-4 py-3 text-hacker-green-bright">{tx.firstName}</td>
                      <td className="px-4 py-3 text-hacker-green-dim">{tx.recipientName}</td>
                      <td className="px-4 py-3 text-hacker-green-bright font-bold">{tx.mpesaCode}</td>
                      <td className="px-4 py-3 text-hacker-green-bright">KES {tx.amount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            tx.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : tx.status === "verified"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTransaction(tx)}
                          className="px-3 py-1 bg-hacker-green/20 border border-hacker-green rounded text-hacker-green hover:bg-hacker-green/30 transition-all"
                        >
                          Review
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-hacker-green-dim">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Review Modal */}
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-hacker-terminal border-2 border-hacker-green/50 rounded-lg p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-tech font-bold text-hacker-green mb-4">
                Review Transaction
              </h2>

              <div className="space-y-3 mb-6 text-sm font-tech">
                <div>
                  <p className="text-hacker-green-dim text-xs">Token</p>
                  <p className="text-hacker-green-bright font-bold">{selectedTransaction.token}</p>
                </div>
                <div>
                  <p className="text-hacker-green-dim text-xs">First Name</p>
                  <p className="text-hacker-green-bright font-bold">{selectedTransaction.firstName}</p>
                </div>
                <div>
                  <p className="text-hacker-green-dim text-xs">M-Pesa Code</p>
                  <p className="text-hacker-green-bright font-bold">{selectedTransaction.mpesaCode}</p>
                </div>
                <div>
                  <p className="text-hacker-green-dim text-xs">Amount</p>
                  <p className="text-hacker-green-bright font-bold">KES {selectedTransaction.amount}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-tech text-hacker-green-bright mb-2">
                  Add Notes
                </label>
                <textarea
                  defaultValue={selectedTransaction.notes}
                  onChange={(e) => {
                    selectedTransaction.notes = e.target.value
                  }}
                  className="w-full px-3 py-2 bg-hacker-terminal border-2 border-hacker-green/30 rounded text-hacker-green-bright focus:border-hacker-green focus:outline-none font-tech text-sm"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    updateTransactionStatus(selectedTransaction.id, "verified", selectedTransaction.notes)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded text-green-400 hover:bg-green-500/30 transition-all font-tech font-bold"
                >
                  <Check className="w-4 h-4" />
                  Verify
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    updateTransactionStatus(selectedTransaction.id, "rejected", selectedTransaction.notes)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500 rounded text-red-400 hover:bg-red-500/30 transition-all font-tech font-bold"
                >
                  <X className="w-4 h-4" />
                  Reject
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
