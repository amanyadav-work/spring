import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { Toaster } from "@/components/ui/sonner"
import { store } from "./redux/store.js"
import { Provider } from 'react-redux'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{ baseTheme: dark }} afterSignOutUrl="/">
        <App />
        <Toaster />
      </ClerkProvider>
    </Provider>
  </React.StrictMode>,
)