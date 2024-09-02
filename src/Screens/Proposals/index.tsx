import { FC } from 'react'

export const Proposals: FC = () => {
  // TODO: This data will be replaced with a call to the backend canister.
  const data = [
    { id: 1, title: 'Proposal 1', description: 'This is a proposal' },
    { id: 2, title: 'Proposal 2', description: 'This is a proposal' },
    { id: 3, title: 'Proposal 2', description: 'This is a proposal' },
  ]

  const renderProposals = () => {
    return data.map((proposal, index) => {
      return <div key={index} className="p-6 bg-[#0d0d0d] rounded-lg shadow-lg mb-4">
        <h2 className="">{proposal.title}</h2>
        <p className="">{proposal.description}</p>
      </div>
    })
  }

  return <>{renderProposals()}</>
}