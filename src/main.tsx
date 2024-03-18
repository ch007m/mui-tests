import React from 'react'
import ReactDOM from 'react-dom/client'
import QuarkusPlatform from './Platform.tsx'
import QuarkusVersion from './Version.tsx'
// import MyComponent from './MyComponent.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
{/*        <h3>Call to /api/platform</h3>
        <QuarkusPlatform/>
        <br/>*/}
        <h3>Call to /api/streams</h3>
        <QuarkusVersion/>
    </React.StrictMode>,
)
