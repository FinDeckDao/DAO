import { FC } from 'react'
import motokoLogo from '../../assets/motoko_moving.png'
import motokoShadowLogo from '../../assets/motoko_shadow.png'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import tailwindLogo from '../../assets/tailwind-css-logo.png'

import { useQueryCall, useUpdateCall } from '@ic-reactor/react'

export const Home: FC = () => {
  const { data: count, call: refetchCount } = useQueryCall({
    functionName: 'get',
  })

  const { call: increment, loading } = useUpdateCall({
    functionName: 'inc',
    onSuccess: () => {
      refetchCount()
    },
  })

  return (
    <div className="App">
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-orange-500 p-4 w-32">
            <a
              href="https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/motoko/"
              target="_blank"
            >
              <span className="logo-stack">
                <img src={motokoLogo} className="w-24 h-24" alt="Motoko logo" />
                <img
                  src={motokoShadowLogo}
                  className="logo motoko-shadow"
                  alt="Motoko logo"
                />
              </span>
            </a>
          </div>
          <div className="bg-blue-500 p-4 w-32">
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="w-24 h-24" alt="Vite logo" />
            </a>
          </div>
          <div className="bg-red-500 p-4 w-32">
            <a href="https://reactjs.org" target="_blank">
              <img src={reactLogo} className="w-24 h-24" alt="React logo" />
            </a>
          </div>
          <div className="bg-purple-800 p-4 w-32">
            <a href="https://reactjs.org" target="_blank">
              <img src={tailwindLogo} className="w-24 h-24" alt="Tailwind logo" />
            </a>
          </div>
        </div>
      </div>

      <h1 className='text-red-700 text-4xl'>Motoko + Vite + React + Tailwind</h1>
      <div className="card">
        <button onClick={increment} disabled={loading} className='
         bg-blue-500 text-white font-bold py-2 px-4 rounded 
         hover:bg-blue-700 border-2 border-blue-500 mb-8
         disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50'
        >
          count is {count?.toString() ?? 'loading...'}
        </button>
        <p>
          Edit <code>backend/Backend.mo</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React, and Motoko logos to learn more
      </p>
    </div >
  )
}