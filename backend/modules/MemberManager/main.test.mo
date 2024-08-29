import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import MemberManager "./main";
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

  func assertEqualBool(actual : Bool, expected : Bool, message : Text) {
    if (actual != expected) {
      Debug.print("Assertion failed: " # message);
      Debug.print("Expected: " # debug_show (expected) # ", Actual: " # debug_show (actual));
      assert false;
    };
  };

  func assertEqualRole(actual : Types.Role, expected : Types.Role, message : Text) {
    if (actual != expected) {
      Debug.print("Assertion failed: " # message);
      Debug.print("Expected: " # debug_show (expected) # ", Actual: " # debug_show (actual));
      assert false;
    };
  };

  // Test registerMember function
  func testRegisterMember() : async () {
    Debug.print("Testing registerMember function...");

    let initialMembers : [(Principal, Types.Member)] = [];
    let newMember : Types.Member = { name = "John Doe"; role = #Student };
    let caller = Principal.fromText("aaaaa-aa");

    let (updatedMembers, result) = MemberManager.registerMember(initialMembers, newMember, caller);

    assertEqualNat(updatedMembers.size(), 1, "Should have one member after registration");
    assertEqualBool(Result.isOk(result), true, "Result should be Ok");

    // Try registering the same member again
    let (_, duplicateResult) = MemberManager.registerMember(updatedMembers, newMember, caller);
    assertEqualBool(Result.isErr(duplicateResult), true, "Should not allow duplicate registration");

    Debug.print("registerMember tests passed!");
  };

  // Test getMember function
  func testGetMember() : async () {
    Debug.print("Testing getMember function...");

    let member : Types.Member = { name = "Jane Doe"; role = #Student };
    let principal = Principal.fromText("bbbbb-bb");
    let members = [(principal, member)];

    let result = MemberManager.getMember(members, principal);
    assertEqualBool(Result.isOk(result), true, "Should find existing member");

    let nonExistentResult = MemberManager.getMember(members, Principal.fromText("ccccc-cc"));
    assertEqualBool(Result.isErr(nonExistentResult), true, "Should not find non-existent member");

    Debug.print("getMember tests passed!");
  };

  // Test getAllMembers function
  func testGetAllMembers() : async () {
    Debug.print("Testing getAllMembers function...");

    let members = [
      (Principal.fromText("ddddd-dd"), { name = "Alice"; role = #Student }),
      (Principal.fromText("eeeee-ee"), { name = "Bob"; role = #Mentor }),
    ];

    let allMembers = MemberManager.getAllMembers(members);
    assertEqualNat(allMembers.size(), 2, "Should return all members");

    Debug.print("getAllMembers tests passed!");
  };

  // Test numberOfMembers function
  func testNumberOfMembers() : async () {
    Debug.print("Testing numberOfMembers function...");

    let members = [
      (Principal.fromText("fffff-ff"), { name = "Charlie"; role = #Student }),
      (Principal.fromText("ggggg-gg"), { name = "David"; role = #Graduate }),
    ];

    let count = MemberManager.numberOfMembers(members);
    assertEqualNat(count, 2, "Should correctly count number of members");

    Debug.print("numberOfMembers tests passed!");
  };

  // Test graduate function
  func testGraduate() : async () {
    Debug.print("Testing graduate function...");

    let student = Principal.fromText("hhhhh-hh");
    let mentor = Principal.fromText("iiiii-ii");
    let members = [
      (student, { name = "Eve"; role = #Student }),
      (mentor, { name = "Frank"; role = #Mentor }),
    ];

    let (graduatedMembers, graduateResult) = await MemberManager.graduate(members, student, mentor);
    assertEqualBool(Result.isOk(graduateResult), true, "Should successfully graduate student");
    assertEqualNat(graduatedMembers.size(), 2, "Number of members should remain the same");

    // Check if the student's role has changed to Graduate
    let graduatedMemberResult = MemberManager.getMember(graduatedMembers, student);
    switch (graduatedMemberResult) {
      case (#ok(graduatedMember)) {
        assertEqualRole(graduatedMember.role, #Graduate, "Student should now be a Graduate");
      };
      case (#err(_)) {
        assert false; // This should not happen
      };
    };

    Debug.print("graduate tests passed!");
  };

  // Run all tests
  public func runTests() : async () {
    await testRegisterMember();
    await testGetMember();
    await testGetAllMembers();
    await testNumberOfMembers();
    await testGraduate();
    Debug.print("All tests completed successfully!");
  };
};
