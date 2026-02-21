'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Eye, EyeOff, Copy, Check, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Token {
  token: string
  characters: number
  active: boolean
  createdAt: string
}

export default function ValentineTokensAdmin() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tokens, setTokens] = useState<Token[]>([])
  const [newToken, setNewToken] = useState('')
  const [newCharacters, setNewCharacters] = useState(700)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const [loginLoading, setLoginLoading] = useState(false)

  const handleLogin = async () => {
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (data.valid) {
        setIsAuthenticated(true)
        toast({
          title: 'Authenticated',
          description: 'You are logged in to the admin dashboard',
        })
      } else {
        toast({
          title: 'Invalid Password',
          description: 'Please enter the correct admin password',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Connection Error',
        description: 'Could not verify password. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoginLoading(false)
    }
  }

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/valentine/validate-token', {
        headers: {
          authorization: 'Bearer admin-secret-key',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTokens(data.tokens)
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
    }
  }

  const addToken = async () => {
    if (!newToken.trim() || !newCharacters) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter token and character count',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/valentine/validate-token', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer admin-secret-key',
        },
        body: JSON.stringify({
          token: newToken,
          characters: newCharacters,
          action: 'add',
        }),
      })

      if (response.ok) {
        toast({
          title: 'Token Added',
          description: `Token ${newToken} added successfully`,
        })
        setNewToken('')
        setNewCharacters(700)
        fetchTokens()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add token',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteToken = async (token: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/valentine/validate-token', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer admin-secret-key',
        },
        body: JSON.stringify({
          token,
          action: 'delete',
        }),
      })

      if (response.ok) {
        toast({
          title: 'Token Deleted',
          description: `Token ${token} deleted successfully`,
        })
        fetchTokens()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete token',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleToken = async (token: string) => {
    try {
      const response = await fetch('/api/valentine/validate-token', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer admin-secret-key',
        },
        body: JSON.stringify({
          token,
          action: 'toggle',
        }),
      })

      if (response.ok) {
        fetchTokens()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to toggle token',
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTokens()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hacker-terminal via-hacker-terminal to-rose-900/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-hacker-terminal/80 border-2 border-hacker-green/50 rounded-lg p-8 backdrop-blur">
            <h1 className="text-3xl font-tech font-bold text-hacker-green mb-2">Admin Access</h1>
            <p className="text-hacker-green-dim mb-6">Valentine Tokens Management</p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-hacker-terminal border-2 border-hacker-green/30 rounded-lg text-hacker-green placeholder-hacker-green/50 focus:border-hacker-green focus:outline-none mb-4 font-tech"
            />

            <motion.button
              whileHover={{ scale: loginLoading ? 1 : 1.02 }}
              whileTap={{ scale: loginLoading ? 1 : 0.98 }}
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full px-4 py-3 bg-hacker-green text-hacker-terminal font-tech font-bold rounded-lg hover:bg-hacker-green-bright transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginLoading ? 'Verifying...' : 'Login'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hacker-terminal via-hacker-terminal to-rose-900/20 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-tech font-bold text-hacker-green mb-8">Valentine Tokens Manager</h1>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/admin/valentine-validation"
            className="flex items-center gap-2 px-4 py-2 bg-hacker-green/20 border border-hacker-green rounded-lg text-hacker-green hover:bg-hacker-green/30 transition-all font-tech text-sm"
          >
            <LinkIcon className="w-4 h-4" />
            Transaction Validation
          </Link>
          <a
            href="/valentine"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-500 rounded-lg text-rose-400 hover:bg-rose-500/30 transition-all font-tech text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Valentine Page
          </a>
          <a
            href="/valentine/view"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500 rounded-lg text-pink-400 hover:bg-pink-500/30 transition-all font-tech text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Preview Page
          </a>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-hacker-terminal/80 border-2 border-hacker-green/30 rounded-lg p-6 mb-8 backdrop-blur"
        >
          <h2 className="text-xl font-tech font-bold text-hacker-green mb-4">Create New Token</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value.toUpperCase())}
              placeholder="Token name (e.g., VAL001)"
              className="px-4 py-2 bg-hacker-terminal border-2 border-hacker-green/30 rounded-lg text-hacker-green placeholder-hacker-green/50 focus:border-hacker-green focus:outline-none font-tech"
            />
            <input
              type="number"
              value={newCharacters}
              onChange={(e) => setNewCharacters(parseInt(e.target.value))}
              placeholder="Characters allowed"
              className="px-4 py-2 bg-hacker-terminal border-2 border-hacker-green/30 rounded-lg text-hacker-green placeholder-hacker-green/50 focus:border-hacker-green focus:outline-none font-tech"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addToken}
              disabled={loading}
              className="px-4 py-2 bg-hacker-green text-hacker-terminal font-tech font-bold rounded-lg hover:bg-hacker-green-bright transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Add Token
            </motion.button>
          </div>
        </motion.div>

        {/* Tokens List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-tech font-bold text-hacker-green mb-4">Active Tokens</h2>
          {tokens.length === 0 ? (
            <div className="bg-hacker-terminal/80 border-2 border-hacker-green/30 rounded-lg p-6 text-center">
              <p className="text-hacker-green-dim font-tech">No tokens created yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tokens.map((token, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-hacker-terminal/80 border-2 rounded-lg p-4 backdrop-blur transition-all ${
                    token.active ? 'border-hacker-green/50' : 'border-red-500/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="font-tech font-bold text-hacker-green text-lg">{token.token}</code>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => copyToClipboard(token.token)}
                          className="p-1 hover:bg-hacker-green/20 rounded transition-all"
                        >
                          {copied === token.token ? (
                            <Check className="w-4 h-4 text-hacker-green" />
                          ) : (
                            <Copy className="w-4 h-4 text-hacker-green-dim" />
                          )}
                        </motion.button>
                      </div>
                      <p className="text-sm text-hacker-green-dim font-tech">
                        {token.characters} characters | Created: {new Date(token.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleToken(token.token)}
                        className={`p-2 rounded transition-all ${
                          token.active
                            ? 'bg-hacker-green/20 text-hacker-green'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {token.active ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteToken(token.token)}
                        disabled={loading}
                        className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-hacker-green/10 border-2 border-hacker-green/30 rounded-lg p-4"
        >
          <p className="text-hacker-green-dim font-tech text-sm">
            Tokens created here will be available for users to enter on the Valentine page. Each token allows a specific number of characters beyond the 600-character limit.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
