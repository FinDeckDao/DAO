import {
  useState
} from "react"
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom"
import iclogo from '../../assets/internet-computer-icp-logo.svg'
import { navigation } from "../../Routes"
import { useAuth, useAgent } from "@ic-reactor/react"

export const NavBar = () => {
  const { login, logout, authenticated, identity, loginError } = useAuth({
    onLoginSuccess: (principal) => console.log(`Logged in as ${principal}`),
    onLoginError: (error) => console.error(`Login failed: ${error}`),
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const agent = useAgent()

  const getLoginButton = () => {
    // Guard for unauthenticated user or login error
    if (!authenticated || !identity || loginError) {
      return <div
        onClick={(e) => {
          e.preventDefault()
          // Login with II on the IC default
          // or with the local environment
          login({
            identityProvider: agent?.isLocal()
              ? 'http://be2us-64aaa-aaaaa-qaabq-cai.localhost:8000/#authorize'
              : 'https://identity.ic0.app/#authorize'
          })
        }}
        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7
                   text-sky-100 hover:bg-slate-700"
      >
        <img src={iclogo} className="h-8 w-8 inline p-0 mb-1 mr-2 align-middle" />
        Login
      </div>
    }

    return <a
      href="/"
      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7
                 text-sky-100 hover:bg-slate-700"
      onClick={() => { logout() }}
    >
      <img src={iclogo} className="h-8 w-8 inline p-0 mb-1 mr-2 align-middle" />
      Logout ({identity?.toString().slice(0, 6)}...{identity?.toString().slice(-4)})
    </a>
  }

  return <header className="col-span-12 bg-slate-800 text-sky-100">
    {/* Default Menu */}
    <nav className="mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        <Link to="/" className="text-sky-100 font-bold hover:bg-slate-700 block rounded-lg px-3 py-2.5">
          dao.FinDeck.io
        </Link>
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="text-sm font-semibold leading-6 text-sky-100 hover:bg-slate-700 rounded-lg p-3"
          >
            {item?.icon} {item.name}
          </Link>
        ))}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">

        {getLoginButton()}
      </div>
    </nav>
    {/* Mobile Menu */}
    <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
      <div className="fixed inset-0 z-10" />
      <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Link to="#" className="text-sky-100 font-bold">FinDeck.io</Link>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-sky-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {navigation.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base leading-7 text-sky-100 hover:bg-slate-700 uppercase"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-6">
              {/* {getLoginButton()} */}
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header >
}

export default NavBar