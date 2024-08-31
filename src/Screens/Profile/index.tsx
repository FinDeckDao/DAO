import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Contexts/Auth'
import { Member } from '../../declarations/backend/backend.did'
import { useQueryCall } from '@ic-reactor/react'
import { Principal } from '@dfinity/principal'
import { hasKey } from '../../utils'

export const UserProfile: React.FC = () => {
  const auth = useContext(AuthContext)
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Guard for unauthenticated users.
  if (!auth.isAuthenticated) {
    return <div className="text-center py-4">Please log in to view your profile.</div>
  }
  // Use the useUpdateCall hook to call the registerMember function.
  // Note: useUpdateCall also outputs the loading state.
  const { call: getMember } = useQueryCall({
    functionName: 'getMember',
    onSuccess: (result) => {
      console.log('getMember result:', result)
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

  useEffect(() => {
    setIsLoading(true)
    const fetchMemberData = async () => {
      const principal = Principal.fromText(auth.identity?.toString() || '')
      await getMember([principal])
      // Change the loading state to false.
      setIsLoading(false)
    }

    fetchMemberData()
  }, [auth.isAuthenticated, auth.identity])

  if (isLoading) {
    return <div className="text-center py-4">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>
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
          <span className="font-semibold">Principal ID:</span>{" "}
          <span className="break-all">
            {auth.identity ? `${auth.identity}` : null}
          </span>
        </p>
      </div>
    </div>
  )
}

export default UserProfile