import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Types "types";
import DAOManager "modules/DaoManager/main";
import MemberManager "modules/MemberManager/main";
import ProposalManager "modules/ProposalManager/main";
import WebpageManager "modules/WebpageManager/main";

actor {
  stable var manifesto : Text = "Help new traders to become profitable and understand key concepts that increase the probability of trading and investing profitably.";
  stable var goals : [Text] = ["Learn Motoko", "Build a project", "Graduate!"];
  stable var memberEntries : [(Principal, Types.Member)] = [];
  stable var proposalEntries : [(Types.ProposalId, Types.Proposal)] = [];

  ////////////////////////////////////////////////////////////////////////
  // Section Webpage /////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  let webpageManager = WebpageManager.createDefault();

  public query func getIdWebpage() : async Principal {
    webpageManager.getIdWebpage();
  };

  ////////////////////////////////////////////////////////////////////////
  // Section DAO /////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  public query func getName() : async Text {
    DAOManager.getName();
  };

  public query func getManifesto() : async Text {
    manifesto;
  };

  public query func getGoals() : async [Text] {
    goals;
  };

  public func addGoal(goal : Text) : async Result.Result<(), Text> {
    let (newGoals, result) = DAOManager.addGoal(goals, goal);
    goals := newGoals;
    result;
  };

  ////////////////////////////////////////////////////////////////////////
  // Section Members /////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func registerMember(member : Types.Member) : async Result.Result<(), Text> {
    let (newEntries, result) = MemberManager.registerMember(memberEntries, member, caller);
    memberEntries := newEntries;
    result;
  };

  public query func getMember(p : Principal) : async Result.Result<Types.Member, Text> {
    MemberManager.getMember(memberEntries, p);
  };

  public query func getAllMembers() : async [Types.Member] {
    MemberManager.getAllMembers(memberEntries);
  };

  public query func numberOfMembers() : async Nat {
    MemberManager.numberOfMembers(memberEntries);
  };

  public shared ({ caller }) func graduate(student : Principal) : async Result.Result<(), Text> {
    let (newEntries, result) = await MemberManager.graduate(memberEntries, student, caller);
    memberEntries := newEntries;
    result;
  };

  ////////////////////////////////////////////////////////////////////////
  // Section Proposals ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createProposal(content : Types.ProposalContent) : async Result.Result<Types.ProposalId, Text> {
    let (newEntries, result) = ProposalManager.createProposal(proposalEntries, content, caller);
    proposalEntries := newEntries;
    result;
  };

  public query func getProposal(id : Types.ProposalId) : async Result.Result<Types.Proposal, Text> {
    ProposalManager.getProposal(proposalEntries, id);
  };

  public query func getAllProposals() : async [Types.Proposal] {
    ProposalManager.getAllProposals(proposalEntries);
  };

  public shared ({ caller }) func voteProposal(proposalId : Types.ProposalId, yesOrNo : Bool) : async Result.Result<(), Text> {
    let (newEntries, result) = ProposalManager.voteProposal(proposalEntries, proposalId, yesOrNo, caller);
    proposalEntries := newEntries;
    result;
  };
};
