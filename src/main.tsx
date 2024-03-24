import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import App from "./App"
import { ThemeProvider } from "@/components/theme-provider"
import "./index.css"

const root = document.getElementById("root")!

root.className = "root"

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
