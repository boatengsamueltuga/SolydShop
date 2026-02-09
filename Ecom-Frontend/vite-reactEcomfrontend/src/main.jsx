/**
 * @file Application bootstrap — mounts the React tree into the DOM.
 *
 * @description
 * - Uses React 19's `createRoot` API to render into the `#root` element defined in index.html.
 * - Wraps `<App />` in the Redux `<Provider>` so every descendant can access the store.
 * - Imports `index.css` (global styles + Tailwind v4 entry point).
 * - `BrowserRouter` lives in App.jsx, keeping this file focused on top-level providers only.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
//import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
  
    <App />
  
  </Provider>,
)
