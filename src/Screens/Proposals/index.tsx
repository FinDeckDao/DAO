import { useEffect, useState, FC } from 'react'
import { Actor, HttpAgent } from '@dfinity/agent'
import {
  Proposal,
  ProposalContent,
  ProposalStatus,
} from '../../declarations/backend/backend.did'
import { idlFactory } from '../../declarations/backend/index'
import { Principal } from '@dfinity/principal'
import { CreateButton } from '../../Components/Buttons'
import { useNavigate } from 'react-router-dom'

export const Proposals: FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<String | null>(null)
  const navigate = useNavigate()

  const navigateToCreateProposal = () => {
    navigate('/proposals/create') // Use navigate function
  }

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const agent = new HttpAgent()

        // TODO: This is a temporary solution to fetch the root key.
        //       This will need to be resolved cleanly in the future.
        await agent.fetchRootKey()
        // console.log(`Root key is ${key.toString()}`)

        // TODO: This canister ID need to change based on the environment.
        //       local: bkyz2-fmaaa-aaaaa-qaaaq-cai
        //       production: no defined yet
        const canisterId = Principal.fromText('bkyz2-fmaaa-aaaaa-qaaaq-cai')
        const actor = Actor.createActor(idlFactory, { agent, canisterId })

        const result = await actor.getAllProposals()
        const proposalsResult = result as Proposal[]
        // Guard against empty proposals
        if (!proposalsResult || proposalsResult.length === 0) {
          setProposals([])
          setLoading(false)
          return
        }
        setProposals(proposalsResult)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch proposals:", err)
        setError("Failed to fetch proposals. Please try again later.")
        setLoading(false)
      }
    }

    fetchProposals()
  }, [])

  const renderProposals = () => {
    // Guard for empty proposals.
    if (!loading && !error && proposals.length === 0) {
      return <div className="text-center">No proposals found</div>
    }

    return <>
      {proposals.map((proposal) => (
        <div key={proposal.id.toString()} className="p-6 bg-slate-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Proposal {proposal.id.toString()}</h2>
          <p className="mb-2">{renderProposalContent(proposal.content)}</p>
          <p className="mb-2">Status: {renderProposalStatus(proposal.status)}</p>
          <p className="mb-2">Creator: {proposal.creator.toText()}</p>
          <p className="mb-2">Vote Score: {proposal.voteScore.toString()}</p>
          <p>Votes: {proposal.votes.length}</p>
        </div>
      ))}
    </>
  }

  const renderAddProposalButton = () => {
    return <div className='w-full flex justify-end p-4'>
      <CreateButton onClick={navigateToCreateProposal} classOverrides='bg-slate-800' />
    </div>
  }

  const renderProposalContent = (content: ProposalContent) => {
    if ('AddGoal' in content) return `Add Goal: ${content.AddGoal}`
    if ('AddMentor' in content) return `Add Mentor: ${content.AddMentor.toText()}`
    if ('ChangeManifesto' in content) return `Change Manifesto: ${content.ChangeManifesto}`
    return 'Unknown proposal type'
  }

  const renderProposalStatus = (status: ProposalStatus) => {
    if ('Open' in status) return 'Open'
    if ('Rejected' in status) return 'Rejected'
    if ('Accepted' in status) return 'Accepted'
    return 'Unknown status'
  }

  if (loading) return <div className="text-center">{renderAddProposalButton()}Loading proposals...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>



  return (
    <div className="space-y-4">
      {renderAddProposalButton()}
      {renderProposals()}
    </div>
  )
}

export default Proposals