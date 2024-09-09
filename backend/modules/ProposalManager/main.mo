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

  public func voteProposal(
    proposals : [(Types.ProposalId, Types.Proposal)],
    proposalId : Types.ProposalId,
    yesOrNo : Bool,
    caller : Principal,
    votingPower : Nat,
  ) : ([(Types.ProposalId, Types.Proposal)], Result.Result<(), Text>) {
    // Find the proposal with the matching ID
    let foundProposal = Array.find<(Types.ProposalId, Types.Proposal)>(proposals, func((id, _)) { id == proposalId });

    switch (foundProposal) {
      case null { (proposals, #err("Proposal does not exist")) };
      case (?(_, proposal)) {
        // Check if the proposal is open for voting
        if (proposal.status != #Open) {
          return (proposals, #err("Proposal is not open for voting"));
        };

        // Check if the caller has already voted
        let existingVote = Array.find<Types.Vote>(proposal.votes, func(vote) { vote.member == caller });

        switch (existingVote) {
          case null {
            // Caller hasn't voted, add new vote
            let newVote : Types.Vote = {
              member = caller;
              votingPower = votingPower;
              yesOrNo = yesOrNo;
            };

            let updatedVotes = Array.append<Types.Vote>(proposal.votes, [newVote]);
            let updatedVoteScore = if (yesOrNo) {
              proposal.voteScore + votingPower;
            } else {
              proposal.voteScore - votingPower;
            };

            var updatedProposal : Types.Proposal = {
              proposal with
              votes = updatedVotes;
              voteScore = updatedVoteScore;
            };

            // Check if the proposal should be automatically executed
            if (updatedVoteScore >= 100) {
              updatedProposal := {
                updatedProposal with
                status = #Accepted;
              };
            } else if (updatedVoteScore <= -100) {
              updatedProposal := {
                updatedProposal with
                status = #Rejected;
              };
            };

            // Update the proposals array
            let updatedProposals = Array.map<(Types.ProposalId, Types.Proposal), (Types.ProposalId, Types.Proposal)>(
              proposals,
              func((id, prop)) {
                if (id == proposalId) { (id, updatedProposal) } else {
                  (id, prop);
                };
              },
            );

            return (updatedProposals, #ok());
          };
          case (?vote) {
            // Caller has already voted
            if (vote.yesOrNo == yesOrNo) {
              // Remove the vote
              let updatedVotes = Array.filter<Types.Vote>(proposal.votes, func(v) { v.member != caller });

              // Update the vote score
              let updatedVoteScore = if (yesOrNo) {
                proposal.voteScore - votingPower;
              } else {
                proposal.voteScore + votingPower;
              };

              var updatedProposal : Types.Proposal = {
                proposal with
                votes = updatedVotes;
                voteScore = updatedVoteScore;
              };

              // Update the proposals array
              let updatedProposals = Array.map<(Types.ProposalId, Types.Proposal), (Types.ProposalId, Types.Proposal)>(
                proposals,
                func((id, prop)) {
                  if (id == proposalId) { (id, updatedProposal) } else {
                    (id, prop);
                  };
                },
              );

              return (updatedProposals, #ok());
            } else {
              // Change vote
              let updatedVotes = Array.map<Types.Vote, Types.Vote>(
                proposal.votes,
                func(v) {
                  if (v.member == caller) {
                    {
                      member = caller;
                      votingPower = votingPower;
                      yesOrNo = yesOrNo;
                    };
                  } else {
                    v;
                  };
                },
              );

              let updatedVoteScore = if (yesOrNo) {
                proposal.voteScore + votingPower;
              } else {
                proposal.voteScore - votingPower;
              };

              var updatedProposal : Types.Proposal = {
                proposal with
                votes = updatedVotes;
                voteScore = updatedVoteScore;
              };

              // Check if the proposal should be automatically executed
              if (updatedVoteScore >= 100) {
                updatedProposal := {
                  updatedProposal with
                  status = #Accepted;
                };
              } else if (updatedVoteScore <= -100) {
                updatedProposal := {
                  updatedProposal with
                  status = #Rejected;
                };
              };

              // Update the proposals array
              let updatedProposals = Array.map<(Types.ProposalId, Types.Proposal), (Types.ProposalId, Types.Proposal)>(
                proposals,
                func((id, prop)) {
                  if (id == proposalId) { (id, updatedProposal) } else {
                    (id, prop);
                  };
                },
              );

              return (updatedProposals, #ok());
            };
          };
        };
      };
    };
  };
};
