import React, { useEffect, useState } from 'react'
import { useQueryCall } from '@ic-reactor/react'
import { useUserPrincipal } from '@ic-reactor/react'
import { MembersOnlyChildComponentProps } from '../../Components/MembersOnly'

// TODO: This component has too many responsibilities.
//       It will work for now but it's doing too much.

export const UserProfile: React.FC<MembersOnlyChildComponentProps> = (props) => {
  const { memberData: member } = props
  const principal = useUserPrincipal()

  if (!member) {
    return <div>Loading...</div>
  }

  const { data, loading } = useQueryCall({
    functionName: 'getTokenBalanceFor',
    args: [principal],
  }) as { call: Function, data: number, loading: boolean }

  // Guard for data loading.
  if (loading) {
    return <div className="text-center py-4">Loading your Findeck DAO profile...</div>
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
              data
                ? Number(String(data))
                : "Fetching your token balance..."
            } {" "}$FDK
          </span>
        </p>
        <p>
          <span className="font-semibold">Voting Rights:</span>{" "}
          <span className="break-all">
            {
              member.role && data
                ? `${calculateVotingRights(Number(String(data)))}`
                : "Checking on your voting rights..."
            }
          </span>
        </p>
      </div>
    </div>
  )
}

export default UserProfile