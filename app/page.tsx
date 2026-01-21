"use client"

import { PriceHero } from "@/components/PriceHero"

export default function Home() {
  // YouTube video background: https://youtu.be/bNK3iZJtDY8
  const videoId = "bNK3iZJtDY8"
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1`

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* YouTube Video Background */}
      <div className="fixed inset-0 z-0">
        <iframe
          src={embedUrl}
          className="video-background"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          frameBorder="0"
          title="Background video"
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
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
