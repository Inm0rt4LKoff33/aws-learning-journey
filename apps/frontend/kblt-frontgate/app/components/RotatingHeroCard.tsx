"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { featuredCards } from "@/app/data/featuredCards"

export default function RotatingHeroCard() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % featuredCards.length)
        setVisible(true)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow halo */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-25 animate-pulse"
        style={{ background: "var(--crimson)" }}
      />
      <div
        className="absolute w-48 h-48 rounded-full blur-2xl opacity-20 animate-pulse"
        style={{ background: "var(--gold)", animationDelay: "1s" }}
      />

      {/* Card */}
      <div
        className="relative w-[240px] md:w-[320px] aspect-[610/835] animate-float rounded-2xl overflow-hidden"
        style={{
          background: "var(--parchment-dim)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 40px var(--crimson-glow)",
        }}
      >
        <Image
          key={index}
          src={featuredCards[index].imageUrl}
          alt="Featured Card"
          fill
          priority
          className={`object-contain p-3 transition-all duration-500 ease-in-out drop-shadow-xl ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        />
      </div>

      {/* Dots indicator */}
      <div className="absolute -bottom-8 flex gap-2">
        {featuredCards.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === index ? "var(--crimson-light)" : "var(--bg-border)",
              transform: i === index ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  )
}