import React, { useEffect, useState } from 'react'
import { Member } from '../../declarations/backend/backend.did'
import { useQueryCall } from '@ic-reactor/react'
import { hasKey } from '../../utils'
import { CtaButton } from '../../Components/Buttons'
import { useNavigate } from 'react-router-dom'
import { useAuthState, useUserPrincipal } from '@ic-reactor/react'

// TODO: This component has too many responsibilities.
//       It will work for now but it's doing too much.

export const UserProfile: React.FC = () => {
  const { authenticated, identity } = useAuthState()
  const principal = useUserPrincipal()
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const navigateToMembership = () => {
    navigate('/members/new') // Use navigate function
  }

  useEffect(() => {
    // Guard for unauthenticated users.
    if (!identity || !authenticated) { return }

    // Set the loading state to true.
    setIsLoading(true)

    const fetchMemberData = async () => {
      // Guard for missing principal.
      if (!principal) { return }

      // Call the getMember function with the principal.
      await getMember([principal])

      // Change the loading state to false.
      setIsLoading(false)
    }

    const fetchTokens = async () => {
      // Guard for missing principal.
      if (!principal) { return }

      // Call the getMemberTokens function with the principal.
      await getTokenBalanceFor([principal])
    }

    // Call the fetchMemberData function.
    fetchMemberData()

    // Call the fetchTokens function.
    fetchTokens()
  }, [])

  // There are 2 reasons the profile won't show up.
  // 1. The user is not authenticated.
  // 2. The user is authenticated but not a member.

  // Guard for missing authentication
  if (!identity || !authenticated) {
    return (
      <div className="text-center py-4">
        Please login and register as a member to view your profile.
      </div>
    )
  }

  // Use the useUpdateCall hook to call the registerMember function.
  // Note: useUpdateCall also outputs the loading state.
  const { call: getMember } = useQueryCall({
    functionName: 'getMember',
    onSuccess: (result) => {
      // If the key 'ok' exists in the result, set the member state.
      if (hasKey(result, 'ok')) {
        const memberData: Member = JSON.parse(JSON.stringify(result.ok))
        setMember(memberData)
        setError(null)
        return
      }

      if (hasKey(result, 'err')) {
        setError(result.err as string)
        return
      }
    },
    onError: (error) => {
      if (hasKey(error, 'err')) {
        setError(error.err as string)
      }
    }
  })

  const { call: getTokenBalanceFor, data: tokenData, loading: getTokensLoading } = useQueryCall({
    functionName: 'getTokenBalanceFor',
    onError: (error) => {
      if (hasKey(error, 'err')) {
        setError(error.err as string)
      }
    }
  }) as { call: Function, data: number, loading: boolean }

  if (isLoading || getTokensLoading) {
    return <div className="text-center py-4">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center py-4">
      <h1>It looks like you're not a member of the Dao.</h1>
      <p>
        To get started please register as a member.
      </p>
      <p>{error}</p>
      <CtaButton cta="Get Started" onClick={navigateToMembership} classOverrides='mx-auto' />
    </div>
  }

  if (!member) {
    return <div className="text-center py-4">No member data found.</div>
  }

  // TODO: This is jus a quick and dirty way to calculate voting rights.
  //       This should be done "correctly" in the backend and delivered as part of the member data.
  const calculateVotingRights = (holdings: number) => {
    // Students have No Voting Rights
    if ('Student' in member.role) {
      return 0
    }

    // Graduates have voting rights equal to their holdings
    if ('Graduate' in member.role) {
      return 1 * holdings
    }

    // Mentors have 5 times their holdings in Voting Rights
    if ('Mentor' in member.role) {
      return 5 * holdings
    }
  }

  return (
    <div className="shadow-md rounded-lg p-6 mx-auto max-w-2xl bg-slate-800">
      <h2 className="text-2xl font-bold mb-8">User Profile</h2>
      <div className="space-y-6">
        <p>
          <span className="font-semibold">Name:</span> {member.name}
        </p>
        <p className="text-gray-600">
          {/* <span className="font-semibold">Role:</span> {member ? Object.keys(member.role)[0] : null} */}
        </p>
        <p>
          <span className="font-semibold">Identity:</span>{" "}
          <span className="break-all">
            {principal ? `${principal.toString()}` : null}
          </span>
        </p>
        <p>
          <span className="font-semibold">Current Role:</span>{" "}
          <span className="break-all">
            {member.role ? Object.keys(member.role)[0] : "No Role Found"}
          </span>
        </p>
        <p>
          <span className="font-semibold">Tokens Held:</span>{" "}
          <span className="break-all">
            {
              tokenData
                ? Number(String(tokenData))
                : "No Data"
            } {" "}$FDK
          </span>
        </p>
        <p>
          <span className="font-semibold">Voting Rights:</span>{" "}
          <span className="break-all">
            {
              member.role && tokenData
                ? `${calculateVotingRights(Number(String(tokenData)))}`
                : "No Voting Rights"
            }
          </span>
        </p>
      </div>
    </div>
  )
}

export default UserProfile