import { Proposal, ProposalContent, ProposalStatus } from "../../declarations/backend/backend.did"

export const ProposalDetail: React.FC<Proposal> = (props) => {
  const { id, content, status, creator, voteScore, votes } = props

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

  return (
    <div key={id.toString()} className="p-6 bg-slate-800 rounded-lg shadow-lg mx-auto w-6/12">
      <h2 className="text-xl font-bold mb-2">Proposal {id.toString()}</h2>
      <p className="mb-2">{renderProposalContent(content)}</p>
      <p className="mb-2">Status: {renderProposalStatus(status)}</p>
      <p className="mb-2">Creator: {creator.toText()}</p>
      <p className="mb-2">Vote Score: {voteScore.toString()}</p>
      <p>Votes: {votes.length}</p>
    </div>
  )
}