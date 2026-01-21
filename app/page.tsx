"use client"

import { PriceHero } from "@/components/PriceHero"
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  // BACKGROUND IMAGE SETUP:
  // Place your samurai background image at: public/bg-samurai.jpg
  // The image should be a full-bleed background of two samurai fighting
  // (cinematic, Kurosawa-style atmosphere with film grain, mist, dramatic silhouettes)
  // If the image is missing or fails to load, a dark gradient fallback will be used
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image or Fallback Gradient */}
      <div className="fixed inset-0 z-0">
        {!imageError ? (
          <>
            <Image
              src="/bg-samurai.jpg"
              alt="Samurai background"
              fill
              priority
              className="object-cover"
              quality={90}
              onError={() => setImageError(true)}
            />
            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950" />
        )}
        {/* Film grain effect */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjkiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjEiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4xIi8+PC9zdmc+')] pointer-events-none" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        <PriceHero />
      </div>
    </div>
  )
}
