import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Types "../../types";

module {
  // Creates a new proposal and adds it to the list of proposals
  public func createProposal(proposals : [(Types.ProposalId, Types.Proposal)], content : Types.ProposalContent, caller : Principal) : ([(Types.ProposalId, Types.Proposal)], Result.Result<Types.ProposalId, Text>) {
    // Generate the next proposal ID
    let nextId = proposals.size() + 1;

    // Create a new proposal with the given content and metadata
    let newProposal : Types.Proposal = {
      id = nextId;
      content = content;
      creator = caller;
      created = Time.now();
      executed = null;
      votes = [];
      voteScore = 0;
      status = #Open;
    };

    // Create a buffer from the existing proposals and add the new one
    let proposalsBuffer = Buffer.fromArray<(Types.ProposalId, Types.Proposal)>(proposals);
    proposalsBuffer.add((nextId, newProposal));

    // Return the updated proposals array and the new proposal ID
    (Buffer.toArray(proposalsBuffer), #ok(nextId));
  };

  // Retrieves a specific proposal by its ID
  public func getProposal(proposals : [(Types.ProposalId, Types.Proposal)], id : Types.ProposalId) : Result.Result<Types.Proposal, Text> {
    // Find the proposal with the matching ID
    switch (Array.find<(Types.ProposalId, Types.Proposal)>(proposals, func(entry) = entry.0 == id)) {
      case (null) #err("Proposal does not exist");
      case (?(_, proposal)) #ok(proposal);
    };
  };

  // Retrieves all proposals
  public func getAllProposals(proposals : [(Types.ProposalId, Types.Proposal)]) : [Types.Proposal] {
    // Map the proposals array to return only the proposal objects
    Array.map<(Types.ProposalId, Types.Proposal), Types.Proposal>(proposals, func(_, proposal) = proposal);
  };

  // Allows a user to vote on a proposal
  public func voteProposal(proposals : [(Types.ProposalId, Types.Proposal)], proposalId : Types.ProposalId, yesOrNo : Bool, caller : Principal) : ([(Types.ProposalId, Types.Proposal)], Result.Result<(), Text>) {
    // Find the proposal with the matching ID
    let foundProposal = Array.find<(Types.ProposalId, Types.Proposal)>(proposals, func((id, _)) = id == proposalId);

    switch (foundProposal) {
      case null { (proposals, #err("Proposal does not exist")) };
      case (?(_, proposal)) {
        // Check if the proposal is open for voting
        if (proposal.status != #Open) {
          return (proposals, #err("Proposal is not open for voting"));
        };

        // Check if the caller has already voted
        if (Array.find<Types.Vote>(proposal.votes, func(vote) = vote.member == caller) != null) {
          return (proposals, #err("Member has already voted"));
        };

        // Create a new vote
        let newVote : Types.Vote = {
          member = caller;
          votingPower = 1; // Assuming each member has 1 voting power, adjust if necessary
          yesOrNo = yesOrNo;
        };

        // Create a new array of votes including the new vote
        let updatedVotes = Array.tabulate<Types.Vote>(
          proposal.votes.size() + 1,
          func(i) {
            if (i < proposal.votes.size()) { proposal.votes[i] } else {
              newVote;
            };
          },
        );

        // Update the vote score
        let updatedVoteScore = proposal.voteScore + (if (yesOrNo) 1 else -1);

        // Create an updated proposal with the new vote and score
        let updatedProposal = {
          proposal with
          votes = updatedVotes;
          voteScore = updatedVoteScore;
        };

        // Create a new array of proposals with the updated proposal
        let updatedProposals = Array.map<(Types.ProposalId, Types.Proposal), (Types.ProposalId, Types.Proposal)>(
          proposals,
          func((id, prop)) {
            if (id == proposalId) { (id, updatedProposal) } else { (id, prop) };
          },
        );

        // Return the updated proposals and a success result
        (updatedProposals, #ok());
      };
    };
  };
};
