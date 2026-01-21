"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PriceData {
  price: number | null
  loading: boolean
  error: boolean
}

export function PriceHero() {
  const [priceData, setPriceData] = useState<PriceData>({
    price: null,
    loading: true,
    error: false,
  })

  const fetchPrice = async () => {
    try {
      setPriceData((prev) => ({ ...prev, loading: true, error: false }))
      
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      )
      
      if (!response.ok) {
        throw new Error("Failed to fetch price")
      }
      
      const data = await response.json()
      const price = Math.round(data.bitcoin.usd)
      
      setPriceData({
        price,
        loading: false,
        error: false,
      })
    } catch (error) {
      setPriceData({
        price: null,
        loading: false,
        error: true,
      })
    }
  }

  useEffect(() => {
    fetchPrice()
    const interval = setInterval(fetchPrice, 15000) // Refresh every 15 seconds
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number | null) => {
    if (price === null) return "—"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center space-y-6">
          <div>
            <label className="text-xs font-medium text-amber-600/80 uppercase tracking-[0.15em] mb-4 block">
              Bitcoin Price
            </label>
            
            {priceData.error ? (
              <div className="space-y-2">
                <p className="text-sm text-amber-600/70">
                  Failed to load price
                </p>
                <button
                  onClick={fetchPrice}
                  disabled={priceData.loading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs text-amber-600/80 hover:text-amber-500 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={cn(
                      "w-3 h-3",
                      priceData.loading && "animate-spin"
                    )}
                  />
                  Retry
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <p className="text-4xl sm:text-5xl font-bold text-white tabular-nums tracking-tight drop-shadow-lg">
                  {priceData.loading ? "—" : formatPrice(priceData.price)}
                </p>
                {priceData.loading && (
                  <RefreshCw className="w-5 h-5 text-amber-600/60 animate-spin" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

