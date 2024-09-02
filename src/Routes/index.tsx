import {
  createBrowserRouter,
} from "react-router-dom"
import { DefaultLayout } from '../Layout'
import { ErrorPage } from '../Routes/ErrorPage'
import { Home } from '../Screens/Home'
// import { Proposals } from '../Screens/Proposals'
// import { CreateProposal } from '../Screens/Proposals/create'
// import { ProtectedContent } from "../Components/Auth/index"
// import { UserProfile } from "../Screens/Profile"
import {
  HomeIcon,
  // NewspaperIcon,
  // UserIcon,
  // UserGroupIcon
} from "@heroicons/react/24/outline"
import NewMember from "../Screens/Membership"

interface NavigationItem {
  name: string
  href: string
  icon?: JSX.Element
}

export const navigation: NavigationItem[] = [
  { name: 'Home', href: '/', icon: <HomeIcon className="h-6 w-6 inline" /> },
  // { name: 'Profile', href: '/profile', icon: <UserIcon className="h-6 w-6 inline" /> },
  // { name: 'Proposals', href: '/proposals', icon: <NewspaperIcon className="h-6 w-6 inline" /> },
  // { name: 'Membership', href: '/members/new', icon: <UserGroupIcon className="h-6 w-6 inline" /> },

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
  // TODO: Understand why this isn't automatically protected.
  // {
  //   path: "/proposals",
  //   element: (
  //     <DefaultLayout>
  //       <ProtectedContent>
  //         <Proposals />
  //       </ProtectedContent>
  //     </DefaultLayout>
  //   ),
  //   errorElement: <ErrorPage />
  // },
  // {
  //   path: "/proposals/create",
  //   element: (
  //     <DefaultLayout>
  //       <ProtectedContent>
  //         <CreateProposal />
  //       </ProtectedContent>
  //     </DefaultLayout>
  //   ),
  //   errorElement: <ErrorPage />
  // },
  // {
  //   path: "/profile",
  //   element: (
  //     <DefaultLayout>
  //       <ProtectedContent>
  //         <UserProfile />
  //       </ProtectedContent>
  //     </DefaultLayout>
  //   ),
  //   errorElement: <ErrorPage />
  // },
  // {
  //   path: "/members/new",
  //   element: (
  //     <DefaultLayout>
  //       <ProtectedContent>
  //         <NewMember />
  //       </ProtectedContent>
  //     </DefaultLayout>
  //   ),
  //   errorElement: <ErrorPage />
  // }
])

