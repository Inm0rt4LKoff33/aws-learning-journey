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
    <div className="relative w-[260px] md:w-[340px] aspect-[610/835] animate-float">

      <Image
        key={index}
        src={featuredCards[index].imageUrl}
        alt="Featured Card"
        fill
        priority
        className={`object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]
        transition-all duration-500 ease-in-out
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      />

    </div>
  )
}