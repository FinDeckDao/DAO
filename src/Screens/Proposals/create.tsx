import React, { useState, useEffect } from 'react'
import { useQueryCall, useUpdateCall, useUserPrincipal } from '@ic-reactor/react'
import { ProposalContent } from '../../declarations/backend/backend.did'
import { useAuthState } from '@ic-reactor/react'

export const CreateProposal: React.FC = () => {
  const userPrincipal = useUserPrincipal()
  const { authenticated, identity } = useAuthState()
  const [proposalType, setProposalType] = useState<keyof ProposalContent>()
  const [content, setContent] = useState<string>('')
  // const [mentor, setMentor] = useState<string>('') // This string will be from the list of graduates.

  if (!authenticated || !identity || !userPrincipal) {
    return (
      <div className="text-center py-4">
        Please sign in to create or review proposals.
      </div>
    )
  }

  const { } = useUpdateCall({
    functionName: 'createProposal'
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
          break
        case 'AddMentor':
          const mentorPrincipal = userPrincipal
          proposalContent = { AddMentor: mentorPrincipal }
          break
        case 'ChangeManifesto':
          proposalContent = { ChangeManifesto: content }
          break
        default:
          throw new Error('Invalid proposal type')
      }
    }

    const { call: createProposal, data, loading } = useUpdateCall({
      functionName: 'createProposal',
    })

    // try {
    //   const result = await actor.createProposal(proposalContent)
    //   if ('ok' in result) {
    //     setStatus(`Proposal created successfully with ID: ${result.ok.toString()}`)
    //     setContent('')
    //   } else {
    //     setStatus(`Error creating proposal: ${result.err}`)
    //   }
    // } catch (error: unknown) {
    //   if (error instanceof Error) {
    //     setStatus(`Error: ${error.message}`)
    //   } else {
    //     setStatus('An unknown error occurred')
    //   }
    // }
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
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Proposal
        </button>
      </form>
      {status && (
        <div className="mt-4 p-2 rounded">
          <p>{status}</p>
        </div>
      )}
    </div>
  )
}

export default CreateProposal