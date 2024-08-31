import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Contexts/Auth'
import { Member } from '../../declarations/backend/backend.did'
import { useQueryCall } from '@ic-reactor/react'
import { Principal } from '@dfinity/principal'
import { hasKey } from '../../utils'
import { CtaButton } from '../../Components/Buttons'
import { useNavigate } from 'react-router-dom'

export const UserProfile: React.FC = () => {
  const auth = useContext(AuthContext)
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const navigateToMembership = () => {
    navigate('/members/new') // Use navigate function
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
  })

  // There are 2 reasons the profile won't show up.
  // 1. The user is not authenticated.
  // 2. The user is authenticated but not a member.

  useEffect(() => {
    // Set the loading state to true.
    setIsLoading(true)

    const fetchMemberData = async () => {
      // Construct a Principal object from the identity string.
      const principal: Principal = Principal.fromText(auth.identity)

      // Guard for missing principal.
      if (!principal) { return }

      // Call the getMember function with the principal.
      await getMember([principal])

      // Change the loading state to false.
      setIsLoading(false)
    }

    // Call the fetchMemberData function.
    fetchMemberData()
  }, [auth.isAuthenticated, auth.identity])

  // Guard for missing auth.identity.
  if (!auth.identity) {
    return <div className="text-center py-4">
      You need to log into first and register as a member to view your profile.
    </div>
  }

  if (isLoading) {
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

  return (
    <div className="shadow-md rounded-lg p-6 mx-auto max-w-2xl bg-slate-800">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="space-y-3">
        <p>
          <span className="font-semibold">Name:</span> {member.name}
        </p>
        <p className="text-gray-600">
          {/* <span className="font-semibold">Role:</span> {member ? Object.keys(member.role)[0] : null} */}
        </p>
        <p>
          <span className="font-semibold">Identity:</span>{" "}
          <span className="break-all">
            {auth.identity ? `${auth.identity}` : null}
          </span>
        </p>
      </div>
    </div>
  )
}

export default UserProfile