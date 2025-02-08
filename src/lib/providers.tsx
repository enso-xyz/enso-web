"use client"

import { Provider } from "react-redux"
import { store } from "./redux/store"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.8)",
            color: "rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
          },
        }}
      />
    </Provider>
  )
} 