import React, { useState, useEffect } from 'react'
import { useQueryCall, useUpdateCall, useUserPrincipal } from '@ic-reactor/react'
import { ProposalContent } from '../../declarations/backend/backend.did'
import { useAuthState } from '@ic-reactor/react'
import { ErrorPage } from '../../Components/Error'
import { hasKey } from '../../utils'

export const CreateProposal: React.FC = () => {
  const userPrincipal = useUserPrincipal()
  const { authenticated, identity } = useAuthState()
  const [proposalType, setProposalType] = useState<keyof ProposalContent>()
  const [content, setContent] = useState<string>('')

  if (!userPrincipal) {
    return <ErrorPage errorMessage="Your user principal couldn't be retrieved. This our fault not yours." />
  }

  const { call: createProposal, data, loading } = useUpdateCall({
    functionName: 'createProposal',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create a new proposal.
    let proposalContent: ProposalContent

    // Determine the proposal type that was selected.

    if (proposalType) {
      switch (proposalType) {
        case 'AddGoal':
          proposalContent = { AddGoal: content }
          createProposal([proposalContent])
          return
        case 'AddMentor':
          const mentorPrincipal = userPrincipal
          proposalContent = { AddMentor: mentorPrincipal }
          createProposal([proposalContent])
          return
        case 'ChangeManifesto':
          proposalContent = { ChangeManifesto: content }
          createProposal([proposalContent])
          return
        default:
          throw new Error('Invalid proposal type')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Create New Proposal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="proposalType" className="block">
            Proposal Type
          </label>
          <select
            id="proposalType"
            value={proposalType}
            onChange={(e) => setProposalType(e.target.value as keyof ProposalContent)}
            className="w-full rounded-md p-2 mb-4"
          >
            <option value="AddGoal">Add Goal</option>
            <option value="AddMentor">Add Mentor</option>
            <option value="ChangeManifesto">Change Manifesto</option>
          </select>
        </div>
        <div>
          <label htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4 w-full rounded-md p-2"
            rows={4}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md 
                    shadow-sm text-sm font-medium text-white bg-indigo-600
                  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                  focus:ring-indigo-500"
        >
          {loading ? "Submitting Proposal..." : "Create Proposal"}
        </button>
        <p>{hasKey(data, "ok") ? `${data.ok}` : null}</p>
      </form>
    </div>
  )
}

export default CreateProposal