"use client"

import { useEffect } from "react"

export default function ChatbaseEmbed() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Avoid loading the script multiple times
    if (document.getElementById("Zj8ekAdX2P4CQ8gcR4ugn")) return

    // Initialize chatbase
    if (!(window as any).chatbase || (window as any).chatbase("getState") !== "initialized") {
      ;(window as any).chatbase = (...args: any[]) => {
        if (!(window as any).chatbase.q) {
          ;(window as any).chatbase.q = []
        }
        ;(window as any).chatbase.q.push(args)
      }
      ;(window as any).chatbase = new Proxy((window as any).chatbase, {
        get(target: any, prop: string) {
          if (prop === "q") {
            return target.q
          }
          return (...args: any[]) => target(prop, ...args)
        },
      })
    }

    const script = document.createElement("script")
    script.src = "https://www.chatbase.co/embed.min.js"
    script.id = "Zj8ekAdX2P4CQ8gcR4ugn"
    ;(script as any).domain = "www.chatbase.co"
    document.body.appendChild(script)

    return () => {
      const existingScript = document.getElementById("Zj8ekAdX2P4CQ8gcR4ugn")
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null
}
