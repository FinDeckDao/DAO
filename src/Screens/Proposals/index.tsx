import { useEffect, FC } from 'react'
import { CreateButton } from '../../Components/Buttons'
import { useNavigate } from 'react-router-dom'
import { useQueryCall, useAuthState } from '@ic-reactor/react'
import { Proposal, ProposalContent, ProposalStatus } from '../../declarations/backend/backend.did'
import { ProposalDetail } from './detail'

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

  const renderProposals = () => {
    // Guard for empty proposals.
    if (!proposalsData || proposalsData.length === 0) {
      return (
        <div className="text-center">
          <p>No proposals were found.</p>
          <p>To avoid spam, members can create one for portion of a $FDK token (about 1 $USD).</p>
        </div>
      )
    }

    return <>
      {proposalsData.sort((a, b) => Number(b.id) - Number(a.id)).map((proposal: Proposal) => (
        <ProposalDetail key={proposal.id.toString()} {...proposal} />
      ))}
    </>
  }

  const renderAddProposalButton = () => {
    return <div className='w-full flex justify-end p-4'>
      <CreateButton onClick={navigateToCreateProposal} classOverrides='bg-slate-800' />
    </div>
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