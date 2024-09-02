import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './Styles/index.css'
import {
  ActorProvider,
  AgentProvider
} from '@ic-reactor/react'
import { idlFactory, canisterId } from './declarations/backend'
import { ErrorPage } from './Components/Error'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider withLocalEnv port={8000}>
      <ActorProvider idlFactory={idlFactory} canisterId={canisterId} errorComponent={ErrorPage}>
        <App />
      </ActorProvider>
    </AgentProvider>
  </React.StrictMode>,
)
