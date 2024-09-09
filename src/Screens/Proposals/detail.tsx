import { Proposal, ProposalContent, ProposalStatus } from "../../declarations/backend/backend.did"
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline"
import { useUpdateCall } from "@ic-reactor/react"
import { hasKey } from "../../utils"

export const ProposalDetail: React.FC<Proposal> = (props) => {
  const { id, content, status, creator, voteScore, votes } = props

  const { call: voteProposal, data, loading } = useUpdateCall({
    functionName: 'voteProposal',
    // onSuccess: () => {
    //   window.location.reload()
    // }
  })

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
      <div className="inline-block w-auto mb-4">
        <HandThumbUpIcon className="h-6 w-6 inline-block" onClick={() => {
          voteProposal([id, true])
        }} />
        {" "}
        <HandThumbDownIcon className="h-6 w-6 inline-block" onClick={() => {
          voteProposal([id, false])
        }} />
      </div>
      <div>
        {hasKey(data, "ok") ? String(JSON.stringify(data)) : null}
        {loading ? "Loading..." : null}
        {hasKey(data, "err") ? String(JSON.stringify(data)) : null}
      </div>
    </div>
  )
}