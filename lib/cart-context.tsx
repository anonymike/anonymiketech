"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

interface CartItem {
  id: string
  type: string
  price: number
  quantity: number
  email: string
  domain: string
  timestamp: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("webdev-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to load cart:", e)
      }
    }
    setIsMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("webdev-cart", JSON.stringify(items))
    }
  }, [items, isMounted])

  const addToCart = (item: CartItem) => {
    const existingItem = items.find((i) => i.type === item.type && i.domain === item.domain)
    if (existingItem) {
      setItems(items.map((i) => (i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i)))
    } else {
      setItems([...items, item])
    }
  }

  const removeFromCart = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, getTotalPrice, getTotalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
