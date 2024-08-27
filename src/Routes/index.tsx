import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout'
import { ErrorPage } from '../Routes/ErrorPage'
import { Home } from '../Screens/Home'
import { Proposals } from '../Screens/Proposals'

import { ProtectedContent } from "../Components/Auth/index"
import {
  HomeIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline"

interface NavigationItem {
  name: string
  href: string
  icon?: JSX.Element
}

export const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', icon: <HomeIcon className="h-6 w-6 inline" /> },
  { name: 'Proposals', href: '/proposals', icon: <NewspaperIcon className="h-6 w-6 inline" /> },
]

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DefaultLayout>
        <Home />
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />
  },
  // Proposals screen is protected by the AuthContext.
  {
    path: "/proposals",
    element: (
      <DefaultLayout>
        <ProtectedContent>
          <Proposals />
        </ProtectedContent>
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />
  }
])