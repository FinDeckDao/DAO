import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Error "mo:base/Error";
// import Debug "mo:base/Debug";
import Types "types";
import DAOManager "modules/DaoManager/main";
import MemberManager "modules/MemberManager/main";
import ProposalManager "modules/ProposalManager/main";
import WebpageManager "modules/WebpageManager/main";

import MBToken "canister:token"; // Local
// import MBToken "ic:jaamb-mqaaa-aaaaj-qa3ka-cai"; // Mainnet

// Import he token actor correctly.

actor {
  type Result<A, B> = Result.Result<A, B>;
  stable var manifesto : Text = "Help new traders to become profitable and understand key concepts that increase the probability of trading and investing profitably.";
  stable var goals : [Text] = ["Learn Motoko", "Build a project", "Graduate!"];

  // Create some inital members for the Bootcamp.
  let bootCampPrincipal = Principal.fromText("nkqop-siaaa-aaaaj-qa3qq-cai");
  let bootCampMember: Types.Member = { name = "motoko_bootcamp"; role = #Mentor; };
  stable var memberEntries : [(Principal, Types.Member)] = [(bootCampPrincipal, bootCampMember)];
  stable var proposalEntries : [(Types.ProposalId, Types.Proposal)] = [];



  ////////////////////////////////////////////////////////////////////////
  // Section Webpage /////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  let webpageManager = WebpageManager.createDefault();

  // ✅ public query func getIdWebpage() : async Principal
  public query func getIdWebpage() : async Principal {
    webpageManager.getIdWebpage();
  };

  ////////////////////////////////////////////////////////////////////////
  // Section DAO /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  // Returns the name of the DAO
  // ✅ public query func getName() : async Text
  public query func getName() : async Text {
    DAOManager.getName();
  };

  // Returns the manifesto of the DAO
  // ✅ public query func getManifesto() : async Text
  public query func getManifesto() : async Text {
    manifesto;
  };

  // Returns the goals of the DAO
  // ✅ public query func getGoals() : async [Text]
  public query func getGoals() : async [Text] {
    goals;
  };

  // ✅ Might not be needed for graduation project
  public func addGoal(goal : Text) : async Result<(), Text> {
    let (newGoals, result) = DAOManager.addGoal(goals, goal);
    goals := newGoals;
    result;
  };

  ////////////////////////////////////////////////////////////////////////
  // Section Members /////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  // ✅ public shared ({ caller }) func registerMember(member : Member) : async Result<(), Text>
  public shared ({ caller }) func registerMember(member : Types.Member) : async Result<(), Text> {
    let (newEntries, result) = MemberManager.registerMember(memberEntries, member, caller);

    switch (result) {
      // New member was added successfully
      case (#ok(_)) {
        // Call the token actor to mint tokens for the new member.
        let paymentResult = await payMember(caller, 10);
        // Evaluate the payment result.
        switch (paymentResult) {
          case (#ok) {
            // Payment successful, update memberEntries
            memberEntries := newEntries;
            #ok(())
          };
          case (#err(paymentError)) {
            // Payment failed, return an error
            #err("Member registered but payment failed: " # paymentError)
          };
        };
        // memberEntries := newEntries;
        // #ok(());
      };
      case (#err(error)) {
        // Registration failed, return the error
        #err("Registration failed:" # error)
      };
    };
  };

  func payMember(caller: Principal, amount: Nat) : async Result<(), Text> {
    try {
      let result = await MBToken.mint(caller, amount);
      switch (result) {
        case (#ok) { #ok(()) };
        case (#err(errorMsg)) { #err(errorMsg) };
      }
    } catch (error) {
      #err("Failed to mint tokens: " # Error.message(error))
    }
  };

  public shared ({caller = _}) func getTokenBalanceFor(p : Principal) : async Nat {
    try {
      await MBToken.balanceOf(p);
    } catch (_error) {
      0
    }
  };

  // ✅ public query func getMember(p : Principal) : async Result<Member, Text>
  public query func getMember(p : Principal) : async Result<Types.Member, Text> {
    MemberManager.getMember(memberEntries, p);
  };

  public query func getAllMembers() : async [Types.Member] {
    MemberManager.getAllMembers(memberEntries);
  };

  public query func numberOfMembers() : async Nat {
    MemberManager.numberOfMembers(memberEntries);
  };

  // ✅ public shared ({ caller }) func graduate(student : Principal) : async Result<(), Text>  
  public shared ({ caller }) func graduate(student : Principal) : async Result<(), Text> {
    let (newEntries, result) = await MemberManager.graduate(memberEntries, student, caller);
    memberEntries := newEntries;
    result;
  };

  ////////////////////////////////////////////////////////////////////////
  // Section Proposals ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  // TODO: This entire function is pretty ugly. We should refactor this to be more functional.
  //       For now this is fine but we should come back to this and clean it up.
  // ✅ public shared ({ caller }) func createProposal(content : ProposalContent) : async Result<ProposalId, Text>
  public shared ({ caller }) func createProposal(content : Types.ProposalContent) : async Result<Types.ProposalId, Text> {
    // Check to see if the caller is a mentor.
    // TODO: This would be much sexier if we chained these calls with a monadic bind instead of nesting these.
    let member = await getMember(caller);
    switch (member) {
      case (#ok(member)) {
        switch (member.role) {
          case (#Mentor) {
            // Caller is a mentor, continue
            // This should burn a token from the caller
            // The transaction that needs to occur where both the burning of the token and the creation of the proposal need to be atomic.
            // This is a bit of a hacky way to do this but it should work for now.
            let burnResult = await burnToken(caller, 1);
            switch (burnResult) {
              case (#ok) {
                let (newEntries, result) = ProposalManager.createProposal(proposalEntries, content, caller);
                switch (result) {
                  case (#ok(proposalId)) {
                    proposalEntries := newEntries;
                    #ok(proposalId)
                  };
                  case (#err(errorMsg)) {
                    #err("Failed to create proposal: " # errorMsg)
                  };
                };
              };
              case (#err(burnError)) {
                // Burn failed, return an error
                #err("Failed to create proposal: " # burnError)
              };
            };
          };
          case (_) {
            // Caller is not a mentor, return an error
            #err("Only Mentors can create proposals.")
          };
        };
      };
      case (#err(errorMsg)) {
        // Failed to get member, return an error
        #err("Failed to create proposal: " # errorMsg)
      };
    };
  };

  func burnToken(caller: Principal, amount: Nat) : async Result<(), Text> {
    try {
      let result = await MBToken.burn(caller, amount);
      switch (result) {
        case (#ok) { #ok(()) };
        case (#err(errorMsg)) { 
          #err(errorMsg);
        };
      }
    } catch (error) {
      #err(Error.message(error))
    }
  };

  // ✅ public query func getProposal(id : ProposalId) : async Result<Proposal, Text>
  public query func getProposal(id : Types.ProposalId) : async Result<Types.Proposal, Text> {
    ProposalManager.getProposal(proposalEntries, id);
  };

  // ✅ public query func getAllProposal() : async [Proposal]
  public query func getAllProposals() : async [Types.Proposal] {
    ProposalManager.getAllProposals(proposalEntries);
  };

  // ✅ public shared ({ caller }) func voteProposal(proposalId : ProposalId, yesOrNo : Bool) : async Result<(), Text>
  public shared ({ caller }) func voteProposal(proposalId : Types.ProposalId, yesOrNo : Bool) : async Result<(), Text> {
    // Check the voter's role.
    let voter = await getMember(caller);

    switch (voter) {
      case (#ok(member)) {
        switch (member.role) {
          // Graduates and Mentors can Vote.
          case (#Graduate or #Mentor) {
            // Voter is allowed to vote

            // Calculate the vote score by taking the members role and figuring out the multiplier.
            let voteMultiplyer = switch(member.role) {
              case (#Graduate) { 1 };
              case (#Mentor) { 5 };
              case (_) { 0 };
            }; 

            // Get the token balance of the voter
            let holdings = await getTokenBalanceFor(caller);

            // Calculate the voting power
            let votingPower = voteMultiplyer * holdings;
            
            // Submit the vote
            let (newEntries, result) = ProposalManager.voteProposal(proposalEntries, proposalId, yesOrNo, caller, votingPower);
            proposalEntries := newEntries;
            result
          };
          case (_) {
            // Voter is not allowed to vote
            #err("Only Graduates and Mentors can vote.")
          };
        }
      };
      case (#err(errorMsg)) {
        #err("Failed to vote: " # errorMsg)
      };
    };
  };
};
