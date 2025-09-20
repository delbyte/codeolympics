"use client"

import type React from "react"

import { useState } from "react"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { db, DEV_BYPASS } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EmailFormProps {
  onEmailSubmitted: (email: string, discordUsername: string) => void
}

export function EmailForm({ onEmailSubmitted }: EmailFormProps) {
  const [email, setEmail] = useState("")
  const [discordUsername, setDiscordUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (DEV_BYPASS) {
        // DEV_BYPASS: Skip Firebase validation and proceed directly
        console.log("[DEV_BYPASS] Skipping Firebase check for email:", email)
        onEmailSubmitted(email, discordUsername)
        setIsLoading(false)
        return
      }

      if (!db) {
        setError("Firebase is not configured. Please check your environment variables.")
        setIsLoading(false)
        return
      }

      // FIREBASE_COMM: Check if email already exists in Firestore
      const q = query(collection(db, "participants"), where("email", "==", email))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setError("This email has already been used. Each email can only play once!")
        setIsLoading(false)
        return
      }

      // FIREBASE_COMM: Add new email to Firestore
      await addDoc(collection(db, "participants"), {
        email,
        discordUsername,
        timestamp: new Date(),
        playCount: 0,
        acceptedCombo: null,
        hasPlayed: false,
      })

      onEmailSubmitted(email, discordUsername)
    } catch (err) {
      console.error("Error saving email:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-gray-200 bg-white shadow-2xl rounded-xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold text-black font-nohemi mb-2">Join the Challenge</CardTitle>
        <CardDescription className="text-gray-600 font-nohemi text-base leading-relaxed">
          Enter your email and Discord username to get your unique coding challenge
          {DEV_BYPASS && <span className="block text-orange-600 font-bold mt-2 text-sm">[DEV_BYPASS MODE]</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-2 border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-red-400 focus:bg-gray-50 font-nohemi py-3 px-4 rounded-lg transition-all duration-200"
          />
          <Input
            type="text"
            placeholder="Discord Username"
            value={discordUsername}
            onChange={(e) => setDiscordUsername(e.target.value)}
            required
            className="w-full border-2 border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-red-400 focus:bg-gray-50 font-nohemi py-3 px-4 rounded-lg transition-all duration-200"
          />
          {error && <p className="text-red-400 text-sm font-nohemi bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 text-lg font-nohemi shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg border border-red-400/30"
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Get My Challenge"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
