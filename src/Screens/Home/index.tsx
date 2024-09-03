import { FC, useEffect } from 'react'
import motokoLogo from '../../assets/motoko_moving.png'
import motokoShadowLogo from '../../assets/motoko_shadow.png'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import tailwindLogo from '../../assets/tailwind-css-logo.png'
import { CtaButton } from '../../Components/Buttons'
import { useNavigate } from 'react-router-dom'
import { useQueryCall } from '@ic-reactor/react'

export const Home: FC = () => {
  const navigate = useNavigate()
  const navigateToMembership = () => {
    navigate('/members/new') // Use navigate function
  }

  const { data: manifesto, loading } = useQueryCall({
    functionName: 'getManifesto',
  }) as { data: string, loading: boolean }

  const getManifesto = async () => {
    if (!manifesto || loading) { return <span>Fetching Manifesto</span> }
    return <span>{manifesto}</span>
  }

  useEffect(() => {
    getManifesto()
  }, [])

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

      <div className="container mx-auto w-6/12">
        <h1 className='text-red-700 text-4xl'>FinDeckDAO</h1>
        <h2>{manifesto}</h2>
        <p>
          The FindeckDAO is "Decentralized Autaunomous Organization" builds Decision Support Systems on the Internet Computer.
          We create "Decision Support Systems" to help people handle problems in an increasingly complex world.
        </p>
        <p>
          Our first project is FinDeck.io which is a decision support system for people who trade assets like Digital Assets
          (like Tokenized Assets or NFTs), Crypto Currencies, Stocks, Bonds, Precious Metals.
        </p>

        <CtaButton cta="Get Started" onClick={navigateToMembership} classOverrides='mx-auto' />
      </div>


    </div >
  )
}