import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './Styles/index.css'
import {
  ActorProvider,
  AgentProvider
} from '@ic-reactor/react'
import { idlFactory as backendIdlFactory, canisterId as backendCanisterId } from './declarations/backend'
// import { idlFactory as tokenIdlFactory, canisterId as tokenCanisterId } from './declarations/token'
import { ErrorPage } from './Components/Error'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider withLocalEnv port={8000}>
      {/* <AgentProvider> */}
      <ActorProvider idlFactory={backendIdlFactory}
        canisterId={backendCanisterId}
        errorComponent={() => (
          <ErrorPage
            errorMessage=""
          />
        )}>
        <App />
      </ActorProvider>
    </AgentProvider>
  </React.StrictMode>,
)
