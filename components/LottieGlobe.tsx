"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function LottieGlobe() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <DotLottieReact
        src="https://lottie.host/c7df6a10-fa19-43b8-b951-82e299b19c26/Rv9uoEXBsS.lottie"
        loop
        autoplay
        style={{
          width: "500%",
          height: "500%",
          maxWidth: "1000px",
          maxHeight: "1000px",
        }}
      />
    </div>
  )
}
