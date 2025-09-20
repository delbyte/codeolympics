"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface MobileLockoutProps {
  // No props needed - component handles visibility internally
}

export function MobileLockout({}: MobileLockoutProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-red-200 bg-white shadow-2xl rounded-xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 opacity-20">
          <Image
            src="/images/codeolymics_circles.svg"
            alt="Decorative circles"
            width={120}
            height={120}
          />
        </div>
        <div className="absolute -bottom-8 -left-8 opacity-15">
          <Image
            src="/images/codeolymics_circles.svg"
            alt="Decorative circles"
            width={80}
            height={80}
          />
        </div>

        <CardHeader className="text-center pb-6 relative z-10">
          <div className="mb-4">
            <div className="text-6xl mb-4">💻</div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 font-nohemi mb-2">
            Desktop Required
          </CardTitle>
          <CardDescription className="text-gray-600 font-nohemi text-base leading-relaxed">
            Code Olympics is designed for the full coding experience
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8 relative z-10">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-700 font-nohemi text-sm leading-relaxed">
                To participate in the Code Olympics challenge, please access this website from a laptop or desktop computer.
              </p>
              <p className="text-gray-600 font-nohemi text-xs">
                The coding challenges and interface are optimized for larger screens to ensure the best experience.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 font-nohemi text-sm mb-2">What you'll need:</h3>
              <ul className="text-xs text-gray-600 font-nohemi space-y-1">
                <li>• A laptop or desktop computer</li>
                <li>• Modern web browser (Chrome, Firefox, Safari)</li>
                <li>• Stable internet connection</li>
              </ul>
            </div>

            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 text-sm font-nohemi shadow-lg transition-all duration-200 rounded-lg"
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}