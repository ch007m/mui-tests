import React from 'react'
import ReactDOM from 'react-dom/client'
import QuarkusVersion from './Version.tsx'
// import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QuarkusVersion />
  </React.StrictMode>,
)
