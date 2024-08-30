import React, { useState, useEffect } from 'react'
import { Actor, HttpAgent } from "@dfinity/agent"
import { _SERVICE, ProposalContent } from '../../declarations/backend/backend.did'
import { idlFactory } from '../../declarations/backend'
import { Principal } from '@dfinity/principal'

export const CreateProposal: React.FC = () => {
  const [actor, setActor] = useState<_SERVICE | null>(null)
  const [proposalType, setProposalType] = useState<keyof ProposalContent>('AddGoal' as keyof ProposalContent)
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    console.log(process.env)

    const initActor = async () => {
      try {
        const agent = new HttpAgent()
        // When deploying to the IC, remove the following line:
        await agent.fetchRootKey()
        const actor = Actor.createActor<_SERVICE>(idlFactory, {
          agent,
          canisterId: process.env.CANISTER_ID_BACKEND || "",
        })
        setActor(actor)
      } catch (error) {
        console.error("Failed to initialize actor:", error)
        setStatus("Failed to initialize. Please try again later.")
      }
    }

    initActor()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!actor) {
      setStatus('Actor not initialized. Please try again.')
      return
    }

    setStatus('Submitting...')

    let proposalContent: ProposalContent

    try {
      switch (proposalType) {
        case 'AddGoal':
          proposalContent = { AddGoal: content }
          break
        case 'AddMentor':
          const mentorPrincipal = Principal.fromText(content)
          proposalContent = { AddMentor: mentorPrincipal }
          break
        case 'ChangeManifesto':
          proposalContent = { ChangeManifesto: content }
          break
        default:
          throw new Error('Invalid proposal type')
      }

      const result = await actor.createProposal(proposalContent)
      if ('ok' in result) {
        setStatus(`Proposal created successfully with ID: ${result.ok.toString()}`)
        setContent('')
      } else {
        setStatus(`Error creating proposal: ${result.err}`)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`)
      } else {
        setStatus('An unknown error occurred')
      }
    }
  }

  if (!actor) {
    return <div>Initializing...</div>
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