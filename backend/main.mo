import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Types "types";
import DAOManager "modules/DaoManager/main";
import MemberManager "modules/MemberManager/main";
import ProposalManager "modules/ProposalManager/main";
import WebpageManager "modules/WebpageManager/main";
import TokenCanister "canister:token"

actor {
  stable var manifesto : Text = "Help new traders to become profitable and understand key concepts that increase the probability of trading and investing profitably.";
  stable var goals : [Text] = ["Learn Motoko", "Build a project", "Graduate!"];
  stable var memberEntries : [(Principal, Types.Member)] = []; // Text is the Principal.toText() of the Principal
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
  public func addGoal(goal : Text) : async Result.Result<(), Text> {
    let (newGoals, result) = DAOManager.addGoal(goals, goal);
    goals := newGoals;
    result;
  };

  ////////////////////////////////////////////////////////////////////////
  // Section Members /////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  // ✅ public shared ({ caller }) func registerMember(member : Member) : async Result<(), Text>
  public shared ({ caller }) func registerMember(member : Types.Member) : async Result.Result<(), Text> {
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
      };
      case (#err(error)) {
        // Registration failed, return the error
        #err(error)
      };
    };
  };

  func payMember(caller: Principal, amount: Nat) : async Result.Result<(), Text> {
    try {
      let result = await TokenCanister.mint(caller, amount);
      switch (result) {
        case (#ok) { #ok(()) };
        case (#err(errorMsg)) { #err(errorMsg) };
      }
    } catch (error) {
      #err("Failed to mint tokens: " # Error.message(error))
    }
  };

  // ✅ public query func getMember(p : Principal) : async Result<Member, Text>
  public query func getMember(p : Principal) : async Result.Result<Types.Member, Text> {
    MemberManager.getMember(memberEntries, p);
  };

  public query func getAllMembers() : async [Types.Member] {
    MemberManager.getAllMembers(memberEntries);
  };

  public query func numberOfMembers() : async Nat {
    MemberManager.numberOfMembers(memberEntries);
  };

  // ✅ public shared ({ caller }) func graduate(student : Principal) : async Result<(), Text>  
  public shared ({ caller }) func graduate(student : Principal) : async Result.Result<(), Text> {
    let (newEntries, result) = await MemberManager.graduate(memberEntries, student, caller);
    memberEntries := newEntries;
    result;
  };

  ////////////////////////////////////////////////////////////////////////
  // Section Proposals ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  // ✅ public shared ({ caller }) func createProposal(content : ProposalContent) : async Result<ProposalId, Text>
  public shared ({ caller }) func createProposal(content : Types.ProposalContent) : async Result.Result<Types.ProposalId, Text> {
    let (newEntries, result) = ProposalManager.createProposal(proposalEntries, content, caller);
    proposalEntries := newEntries;
    result;
  };

  // ✅ public query func getProposal(id : ProposalId) : async Result<Proposal, Text>
  public query func getProposal(id : Types.ProposalId) : async Result.Result<Types.Proposal, Text> {
    ProposalManager.getProposal(proposalEntries, id);
  };

  // ✅ public query func getAllProposal() : async [Proposal]
  public query func getAllProposals() : async [Types.Proposal] {
    ProposalManager.getAllProposals(proposalEntries);
  };

  // ✅ public shared ({ caller }) func voteProposal(proposalId : ProposalId, yesOrNo : Bool) : async Result<(), Text>
  public shared ({ caller }) func voteProposal(proposalId : Types.ProposalId, yesOrNo : Bool) : async Result.Result<(), Text> {
    let (newEntries, result) = ProposalManager.voteProposal(proposalEntries, proposalId, yesOrNo, caller);
    proposalEntries := newEntries;
    result;
  };
};
