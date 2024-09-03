import { useEffect, FC } from 'react'
import { CreateButton } from '../../Components/Buttons'
import { useNavigate } from 'react-router-dom'
import { useQueryCall, useAuthState } from '@ic-reactor/react'
import { Proposal, ProposalContent, ProposalStatus } from '../../declarations/backend/backend.did'

export const Proposals: FC = () => {
  const { authenticated, identity } = useAuthState()
  const navigate = useNavigate()

  const navigateToCreateProposal = () => {
    navigate('/proposals/create') // Use navigate function
  }

  const {
    call: getProposals,
    data: proposalsData,
    loading: proposalsLoading,
    error: proposalsError
  } = useQueryCall({
    functionName: 'getAllProposals',
  }) as { call: () => void, data: Proposal[], loading: boolean, error: Error }

  useEffect(() => {
    // Guard for unauthenticated users.
    if (!identity || !authenticated) { return }

    const fetchProposals = async () => {
      await getProposals()
    }

    fetchProposals()
  }, [])

  if (!authenticated || !identity) return <div className="text-center">Please sign in to view proposals.</div>

  const renderProposals = () => {
    // Guard for empty proposals.
    if (!proposalsData || proposalsData.length === 0) {
      return <div className="text-center">No proposals found</div>
    }

    return <>
      {proposalsData.map((proposal: Proposal) => (
        <div key={proposal.id.toString()} className="p-6 bg-slate-800 rounded-lg shadow-lg mx-auto w-6/12">
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

  if (proposalsLoading) return <div className="text-center">{renderAddProposalButton()}Loading proposals...</div>
  if (proposalsError) return <div className="text-center text-red-500">{proposalsError.message}</div>

  return (
    <div className="space-y-4">
      {renderAddProposalButton()}
      {renderProposals()}
    </div>
  )
}

export default Proposals