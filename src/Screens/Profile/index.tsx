import React, { useContext, useEffect, useState } from 'react'
import { Actor, HttpAgent } from "@dfinity/agent"
import { AuthContext } from '../../Contexts/Auth'
import { Member, Role, _SERVICE } from '../../declarations/backend/backend.did'
import { idlFactory } from '../../declarations/backend'
import { Principal } from '@dfinity/principal'

const roleToString = (role: Role): string => {
  if ('Graduate' in role) return 'Graduate'
  if ('Mentor' in role) return 'Mentor'
  if ('Student' in role) return 'Student'
  return 'Unknown'
}

export const UserProfile: React.FC = () => {
  const auth = useContext(AuthContext)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemberData = async () => {
      if (auth.isAuthenticated && auth.identity) {
        try {
          setLoading(true)
          const agent = new HttpAgent()
          const principal = Principal.fromText(auth.identity)
          const actor = Actor.createActor<_SERVICE>(idlFactory, {
            agent,
            canisterId: process.env.CANISTER_ID_BACKEND || "",
          })
          const result = await actor.getMember(principal)

          if ('ok' in result) {
            setMember(result.ok)
          } else {
            setError(result.err)
          }
        } catch (err) {
          setError('Failed to fetch member data')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchMemberData()
  }, [auth.isAuthenticated, auth.identity])

  if (!auth.isAuthenticated) {
    return <div className="text-center py-4">Please log in to view your profile.</div>
  }

  if (loading) {
    return <div className="text-center py-4">Loading profile...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>
  }

  if (!member) {
    return <div className="text-center py-4">No member data found.</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Profile</h2>
      <div className="space-y-3">
        <p className="text-gray-600">
          <span className="font-semibold">Name:</span> {member.name}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Role:</span> {roleToString(member.role)}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Principal ID:</span>
          <span className="break-all">
            {auth.identity ? `${auth.identity.toString().slice(0, 6)}...${auth.identity.toString().slice(-4)}` : 'N/A'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default UserProfile