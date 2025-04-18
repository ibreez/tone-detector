"use client"

import type { ToneResult } from "@/app/types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Emotion to emoji mapping
const emotionEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
  fearful: "😨",
  disgusted: "🤢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  confused: "😕",
  amused: "😄",
  loving: "❤️",
  proud: "🥲",
  grateful: "🙏",
  hopeful: "🤞",
  insult: "🤬",
  joking: "😜",
  // Default emoji for any other emotions
  default: "🤔",
}

// Emotion to color mapping
const emotionColors: Record<string, string> = {
  happy: "bg-green-500",
  sad: "bg-blue-500",
  angry: "bg-red-500",
  surprised: "bg-purple-500",
  fearful: "bg-yellow-500",
  disgusted: "bg-emerald-500",
  neutral: "bg-gray-500",
  excited: "bg-pink-500",
  anxious: "bg-amber-500",
  confused: "bg-indigo-500",
  amused: "bg-cyan-500",
  loving: "bg-rose-500",
  proud: "bg-teal-500",
  grateful: "bg-lime-500",
  hopeful: "bg-sky-500",
  insult: "bg-orange-500",
  joking: "bg-violet-500",
  // Default color for any other emotions
  default: "bg-slate-500",
}

interface ToneDisplayProps {
  result: ToneResult
}

export default function ToneDisplay({ result }: ToneDisplayProps) {
  const [progressValue, setProgressValue] = useState(0)

  // Animate the progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(result.confidence * 100)
    }, 100)

    return () => clearTimeout(timer)
  }, [result.confidence])

  const emoji = emotionEmojis[result.emotion.toLowerCase()] || emotionEmojis.default
  const colorClass = emotionColors[result.emotion.toLowerCase()] || emotionColors.default

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Detected Tone:</h3>
        <Badge className={`text-white ${colorClass}`}>
          {result.emotion} {emoji}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Confidence</span>
          <span>{Math.round(result.confidence * 100)}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-medium mb-1">Explanation:</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{result.explanation}</p>
      </div>
    </motion.div>
  )
}
