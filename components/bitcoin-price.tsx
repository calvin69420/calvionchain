"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BitcoinPrice {
  price: number
  change24h: number
  changePercent24h: number
  high24h: number
  low24h: number
  volume24h: number
  marketCap: number
  lastUpdate: Date
}

export function BitcoinPrice() {
  const [data, setData] = useState<BitcoinPrice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrice = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Using CoinGecko API (free, no API key required)
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true"
      )
      
      if (!response.ok) throw new Error("Failed to fetch price")
      
      const result = await response.json()
      const btc = result.bitcoin
      
      // Fetch additional data for high/low
      const detailResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false"
      )
      const detailResult = await detailResponse.json()
      const marketData = detailResult.market_data
      
      setData({
        price: btc.usd,
        change24h: btc.usd_24h_change || 0,
        changePercent24h: btc.usd_24h_change || 0,
        high24h: marketData.high_24h?.usd || 0,
        low24h: marketData.low_24h?.usd || 0,
        volume24h: marketData.total_volume?.usd || 0,
        marketCap: marketData.market_cap?.usd || 0,
        lastUpdate: new Date(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return formatCurrency(value)
  }

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-cyan-500/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-3">
                <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse" />
                <div className="h-12 w-64 bg-slate-700/50 rounded animate-pulse" />
              </div>
              <div className="h-10 w-24 bg-slate-700/50 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-cyan-500/20 bg-slate-900/30">
              <CardContent className="p-4">
                <div className="h-3 w-20 bg-slate-700/50 rounded animate-pulse mb-2" />
                <div className="h-6 w-32 bg-slate-700/50 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="text-center text-red-400">
        <p>Error loading price data</p>
        <button
          onClick={fetchPrice}
          className="mt-4 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  const isPositive = data.changePercent24h >= 0

  return (
    <div className="space-y-6">
      {/* Main Price Display */}
      <Card className="border-cyan-500/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-sm shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                Bitcoin Price
              </h2>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tabular-nums">
                  {formatCurrency(data.price)}
                </span>
                <button
                  onClick={fetchPrice}
                  disabled={loading}
                  className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-200 disabled:opacity-50 hover:scale-105 active:scale-95"
                  aria-label="Refresh price"
                >
                  <RefreshCw
                    className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5 text-cyan-400",
                      loading && "animate-spin"
                    )}
                  />
                </button>
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg shrink-0",
                isPositive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span className="text-base sm:text-lg font-semibold tabular-nums">
                {isPositive ? "+" : ""}
                {data.changePercent24h.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Last updated: {data.lastUpdate.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="24h High"
          value={formatCurrency(data.high24h)}
          className="border-cyan-500/20"
        />
        <StatCard
          label="24h Low"
          value={formatCurrency(data.low24h)}
          className="border-cyan-500/20"
        />
        <StatCard
          label="24h Volume"
          value={formatLargeNumber(data.volume24h)}
          className="border-cyan-500/20"
        />
        <StatCard
          label="Market Cap"
          value={formatLargeNumber(data.marketCap)}
          className="border-cyan-500/20"
        />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <Card
      className={cn(
        "border bg-slate-900/30 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 hover:border-cyan-500/30",
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          {label}
        </div>
        <div className="text-lg sm:text-xl font-bold text-white tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}

