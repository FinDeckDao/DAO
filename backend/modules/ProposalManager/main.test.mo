import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import ProposalManager "./main";
import Types "../../types";

actor {
  // Type-specific assertion functions
  func assertEqualNat(actual : Nat, expected : Nat, message : Text) {
    if (actual != expected) {
      Debug.print("Assertion failed: " # message);
      Debug.print("Expected: " # debug_show (expected) # ", Actual: " # debug_show (actual));
      assert false;
    };
  };

  func assertEqualInt(actual : Int, expected : Int, message : Text) {
    if (actual != expected) {
      Debug.print("Assertion failed: " # message);
      Debug.print("Expected: " # debug_show (expected) # ", Actual: " # debug_show (actual));
      assert false;
    };
  };

  func assertEqualBool(actual : Bool, expected : Bool, message : Text) {
    if (actual != expected) {
      Debug.print("Assertion failed: " # message);
      Debug.print("Expected: " # debug_show (expected) # ", Actual: " # debug_show (actual));
      assert false;
    };
  };

  func assertEqualText(actual : Text, expected : Text, message : Text) {
    if (actual != expected) {
      Debug.print("Assertion failed: " # message);
      Debug.print("Expected: " # debug_show (expected) # ", Actual: " # debug_show (actual));
      assert false;
    };
  };

  // Test createProposal function
  public func testCreateProposal() : async () {
    Debug.print("Testing createProposal function...");

    let initialProposals : [(Types.ProposalId, Types.Proposal)] = [];
    let content : Types.ProposalContent = #AddGoal("New test goal");
    let caller = Principal.fromText("aaaaa-aa");

    let (updatedProposals, result) = ProposalManager.createProposal(initialProposals, content, caller);

    assertEqualNat(updatedProposals.size(), 1, "Should have one proposal after creation");
    switch (result) {
      case (#ok(id)) assertEqualNat(id, 1, "First proposal should have ID 1");
      case (#err(e)) assert false;
    };

    Debug.print("createProposal test passed!");
  };

  // Test getProposal function
  public func testGetProposal() : async () {
    Debug.print("Testing getProposal function...");

    let proposal : Types.Proposal = {
      id = 1;
      content = #AddGoal("Test goal");
      creator = Principal.fromText("aaaaa-aa");
      created = Time.now();
      executed = null;
      votes = [];
      voteScore = 0;
      status = #Open;
    };
    let proposals : [(Types.ProposalId, Types.Proposal)] = [(1, proposal)];

    let result = ProposalManager.getProposal(proposals, 1);
    switch (result) {
      case (#ok(p)) {
        switch (p.content) {
          case (#AddGoal(goal)) assertEqualText(goal, "Test goal", "Should retrieve the correct proposal content");
          case (_) assert false;
        };
      };
      case (#err(e)) assert false;
    };

    let nonExistentResult = ProposalManager.getProposal(proposals, 2);
    assertEqualBool(Result.isErr(nonExistentResult), true, "Should return error for non-existent proposal");

    Debug.print("getProposal test passed!");
  };

  // Test getAllProposals function
  public func testGetAllProposals() : async () {
    Debug.print("Testing getAllProposals function...");

    let proposals : [(Types.ProposalId, Types.Proposal)] = [
      (
        1,
        {
          id = 1;
          content = #AddGoal("Goal 1");
          creator = Principal.fromText("aaaaa-aa");
          created = Time.now();
          executed = null;
          votes = [];
          voteScore = 0;
          status = #Open;
        },
      ),
      (
        2,
        {
          id = 2;
          content = #ChangeManifesto("New manifesto");
          creator = Principal.fromText("bbbbb-bb");
          created = Time.now();
          executed = null;
          votes = [];
          voteScore = 0;
          status = #Open;
        },
      ),
    ];

    let allProposals = ProposalManager.getAllProposals(proposals);
    assertEqualNat(allProposals.size(), 2, "Should return all proposals");
    switch (allProposals[0].content) {
      case (#AddGoal(goal)) assertEqualText(goal, "Goal 1", "First proposal should be correct");
      case (_) assert false;
    };
    switch (allProposals[1].content) {
      case (#ChangeManifesto(manifesto)) assertEqualText(manifesto, "New manifesto", "Second proposal should be correct");
      case (_) assert false;
    };

    Debug.print("getAllProposals test passed!");
  };

  // Test voteProposal function
  public func testVoteProposal() : async () {
    Debug.print("Testing voteProposal function...");

    let proposal : Types.Proposal = {
      id = 1;
      content = #AddGoal("Test goal");
      creator = Principal.fromText("aaaaa-aa");
      created = Time.now();
      executed = null;
      votes = [];
      voteScore = 0;
      status = #Open;
    };
    var proposals : [(Types.ProposalId, Types.Proposal)] = [(1, proposal)];
    let voter = Principal.fromText("bbbbb-bb");

    let (updatedProposals, result) = ProposalManager.voteProposal(proposals, 1, true, voter);
    switch (result) {
      case (#ok(_)) {
        assertEqualNat(updatedProposals[0].1.votes.size(), 1, "Should have one vote");
        assertEqualInt(updatedProposals[0].1.voteScore, 1, "Vote score should be 1");
      };
      case (#err(e)) assert false;
    };

    // Test voting again with the same voter
    proposals := updatedProposals;
    let (_, duplicateVoteResult) = ProposalManager.voteProposal(proposals, 1, true, voter);
    assertEqualBool(Result.isErr(duplicateVoteResult), true, "Should not allow duplicate voting");

    Debug.print("voteProposal test passed!");
  };

  // Run all tests
  public func runTests() : async () {
    await testCreateProposal();
    await testGetProposal();
    await testGetAllProposals();
    await testVoteProposal();
    Debug.print("All tests completed successfully!");
  };
};
