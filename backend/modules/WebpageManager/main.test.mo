import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import WebpageManager "./main";

actor {
  // Type-specific assertion function for Principal
  func assertEqualPrincipal(actual : Principal, expected : Principal, message : Text) {
    if (not Principal.equal(actual, expected)) {
      Debug.print("Assertion failed: " # message);
      Debug.print("Expected: " # debug_show (expected));
      Debug.print("Actual: " # debug_show (actual));
      assert false;
    };
  };

  // Test create function
  public func testCreate() : async () {
    Debug.print("Testing create function...");

    let testPrincipal = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
    let manager = WebpageManager.create(testPrincipal);

    assertEqualPrincipal(
      manager.getIdWebpage(),
      testPrincipal,
      "create should return a WebpageManager with the correct Principal",
    );

    Debug.print("create function test passed!");
  };

  // Test createDefault function
  public func testCreateDefault() : async () {
    Debug.print("Testing createDefault function...");

    let defaultManager = WebpageManager.createDefault();
    let expectedDefaultPrincipal = Principal.fromText("bnz7o-iuaaa-aaaaa-qaaaa-cai");

    assertEqualPrincipal(
      defaultManager.getIdWebpage(),
      expectedDefaultPrincipal,
      "createDefault should return a WebpageManager with the default Principal",
    );

    Debug.print("createDefault function test passed!");
  };

  // Run all tests
  public func runTests() : async () {
    await testCreate();
    await testCreateDefault();
    Debug.print("All tests completed successfully!");
  };
};
