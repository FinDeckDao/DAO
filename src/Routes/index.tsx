import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout'
import { ErrorPage } from '../Routes/ErrorPage'
import { Home } from '../Screens/Home'
import { Proposals } from '../Screens/Proposals'
import { CreateProposal } from '../Screens/Proposals/create'
import { UserProfile } from "../Screens/Profile"
import {
  HomeIcon,
  NewspaperIcon,
  UserIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline"
import NewMember from "../Screens/Membership"
import { Authenticate } from "../Components/Authenticate"

interface NavigationItem {
  name: string
  href: string
  icon?: JSX.Element
}

export const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', icon: <HomeIcon className="h-6 w-6 inline" /> },
  { name: 'Profile', href: '/profile', icon: <UserIcon className="h-6 w-6 inline" /> },
  { name: 'Proposals', href: '/proposals', icon: <NewspaperIcon className="h-6 w-6 inline" /> },
  { name: 'Membership', href: '/members/new', icon: <UserGroupIcon className="h-6 w-6 inline" /> },

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
  {
    path: "/proposals",
    element: (
      <DefaultLayout>
        <Authenticate>
          <Proposals />
        </Authenticate>
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/proposals/create",
    element: (
      <DefaultLayout>
        <Authenticate>
          <CreateProposal />
        </Authenticate>
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/profile",
    element: (
      <DefaultLayout>
        <Authenticate>
          <UserProfile />
        </Authenticate>
      </DefaultLayout >
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/members/new",
    element: (
      <DefaultLayout>
        <Authenticate>
          <NewMember />
        </Authenticate>
      </DefaultLayout>
    ),
    errorElement: <ErrorPage />
  }
])

